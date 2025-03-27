
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Imprint = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-content max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {language === "de" ? "Impressum" : "Imprint"}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">
              {language === "de" ? "Angaben gemäß § 5 TMG" : "Information according to § 5 TMG"}
            </h2>
            <p>
              Novacana GmbH (Gesellschaft mit beschränkter Haftung)<br />
              Guerickeweg 5<br />
              64291 Darmstadt
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Sie erreichen uns unter:" : "You can reach us at:"}
            </h3>
            <p>
              +49 (0) 69 945159 18
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Vertreten durch:" : "Represented by:"}
            </h3>
            <p>
              Rolf-Wilhelm Schlüter
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Registereintrag:" : "Register entry:"}
            </h3>
            <p>
              {language === "de" ? "Eintragung im Handelsregister." : "Entry in the commercial register."}<br />
              {language === "de" ? "Registergericht: Handelsregister B des Amtsgerichts Frankfurt am Main" : "Register court: Commercial register B of the district court Frankfurt am Main"}<br />
              {language === "de" ? "Registernummer: HRB 115523" : "Register number: HRB 115523"}
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Umsatzsteuer-ID:" : "VAT ID:"}
            </h3>
            <p>
              {language === "de" 
                ? "Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE324922002" 
                : "VAT identification number according to §27a of the German Value Added Tax Law: DE324922002"}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {language === "de" ? "Aufsicht:" : "Supervision:"}
            </h2>
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Erlaubnisse und Zertifikate" : "Permits and Certificates"}
            </h3>
            <p>
              {language === "de" 
                ? "Die Novacana GmbH ist ein 2019 gegründetes GDP-zertifiziertes Unternehmen mit der Erlaubnis zum Handel (Erlaubnis gemäß § 52a Abs. 1 Satz 1 AMG des Regierungspräsidiums Darmstadt) von Arzneimitteln sowie der Erlaubnis zur Teilnahme am Betäubungsmittelverkehr (Erlaubnis gemäß § 3 BtMG der Bundesopiumstelle in der Fassung vom 18. März 2020 BtM-Nummer: 467 48 18) mit Sitz in Frankfurt am Main."
                : "Novacana GmbH is a GDP-certified company founded in 2019 with the permission to trade (permission according to § 52a para. 1 sentence 1 AMG of the regional council of Darmstadt) pharmaceuticals as well as the permission to participate in narcotic drug traffic (permission according to § 3 BtMG of the Federal Opium Agency in the version of March 18, 2020 BtM number: 467 48 18) with headquarters in Frankfurt am Main."}
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Regierungspräsidium Darmstadt" : "Regional Council of Darmstadt"}
            </h3>
            <p>
              {language === "de"
                ? "Die Aufsicht im Arzneimittelverkehr führt das Regierungspräsidium Darmstadt"
                : "The supervision in pharmaceutical traffic is carried out by the Regional Council of Darmstadt"}
              <br />
              Regierungspräsidium Darmstadt<br />
              Pharmazie<br />
              Luisenplatz 2<br />
              64283 Darmstadt
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">
              {language === "de" ? "Bundesopiumstelle" : "Federal Opium Agency"}
            </h3>
            <p>
              {language === "de"
                ? "Die Aufsicht im Betäubungsmittelverkehr führt die Bundesopiumstelle des Bundesinstitut für Arzneimittel und Medizinprodukte (BfArM)"
                : "The supervision in narcotic drug traffic is carried out by the Federal Opium Agency of the Federal Institute for Drugs and Medical Devices (BfArM)"}
              <br />
              Bundesopiumstelle<br />
              Kurt-Georg-Kiesinger-Allee 3<br />
              53175 Bonn
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {language === "de" ? "Haftungsausschluss:" : "Disclaimer:"}
            </h2>
            <p>
              {language === "de"
                ? "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich."
                : "Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Imprint;
