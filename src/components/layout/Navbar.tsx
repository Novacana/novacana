
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ShoppingCart, Globe, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Dies wird durch den tatsächlichen Auth-Status ersetzt
  const navigate = useNavigate();

  // Nur für Demonstrationszwecke - in der Produktionsversion durch echte Auth ersetzt
  useEffect(() => {
    // Überprüfen, ob ein Token im lokalen Speicher vorhanden ist
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // Für Testzwecke - Mock Login/Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Navigation mit übersetzten Texten
  const getNavigation = () => {
    const baseNavigation = [
      { name: t('nav.home'), href: "/", current: true },
      { name: t('nav.about'), href: "/#about", current: false },
      { name: t('nav.contact'), href: "/#contact", current: false },
    ];
    
    // Füge Produkte nur hinzu, wenn der Benutzer eingeloggt ist
    if (isLoggedIn) {
      baseNavigation.splice(1, 0, { name: t('nav.products'), href: "/products", current: false });
    }
    
    return baseNavigation;
  };

  const navigation = getNavigation();

  // Prüfen, ob der Benutzer nach unten gescrollt hat
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobiles Menü umschalten
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sprache wechseln
  const toggleLanguage = (lang: 'de' | 'en') => {
    setLanguage(lang);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container-content flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png" 
              alt="Novacana" 
              className="h-8 md:h-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                console.error("Logo konnte nicht geladen werden:", e);
                target.src = "/placeholder.svg";
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="ml-10 flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-2 py-1 text-sm font-medium animated-underline",
                  item.current
                    ? "text-black dark:text-white"
                    : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth, Cart und Language Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Sprachumschalter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Globe size={16} />
                <span>{t('language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleLanguage('de')} className={language === 'de' ? 'bg-muted' : ''}>
                {t('language.de')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLanguage('en')} className={language === 'en' ? 'bg-muted' : ''}>
                {t('language.en')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <User size={16} />
                  <span>{t('nav.dashboard')}</span>
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 relative">
                  <ShoppingCart size={16} />
                  <span>{t('nav.cart')}</span>
                  <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    0
                  </span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleLogout}>
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm" className="bg-black hover:bg-gray-800 text-white">
                  {t('nav.register')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Sprachumschalter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center justify-center p-1">
                <Globe size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleLanguage('de')} className={language === 'de' ? 'bg-muted' : ''}>
                {t('language.de')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLanguage('en')} className={language === 'en' ? 'bg-muted' : ''}>
                {t('language.en')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button
            type="button"
            className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                item.current
                  ? "text-black dark:text-white"
                  : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.cart')}
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
