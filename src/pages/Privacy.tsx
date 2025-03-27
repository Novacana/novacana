
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-content max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {language === "de" ? "Datenschutzerklärung" : "Privacy Policy"}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="lead mb-6">
              {language === "de"
                ? "Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Hier erfahren Sie, wie wir mit Ihren Daten umgehen."
                : "The protection of your personal data is important to us. Here you can find out how we handle your data."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {language === "de" ? "Allgemeine Informationen" : "General Information"}
            </h2>
            <p>
              {language === "de"
                ? "Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben."
                : "The use of our website is usually possible without providing personal data. As far as personal data (such as name, address or e-mail addresses) are collected on our pages, this is always done on a voluntary basis if possible. This data will not be passed on to third parties without your express consent."}
            </p>
            <p>
              {language === "de"
                ? "Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich."
                : "We would like to point out that data transmission on the Internet (e.g. when communicating by e-mail) may have security gaps. Complete protection of data against access by third parties is not possible."}
            </p>
            <p>
              {language === "de"
                ? "Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor."
                : "We hereby expressly prohibit the use of contact data published as part of the imprint obligation by third parties for sending unsolicited advertising and information materials. The operators of the pages expressly reserve the right to take legal action in the event of the unsolicited sending of advertising information, such as through spam mails."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {language === "de" ? "Google Analytics" : "Google Analytics"}
            </h2>
            <p>
              {language === "de"
                ? "Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. (''Google''). Google Analytics verwendet sog. ''Cookies'', Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer IP-Adresse) wird an einen Server von Google in den USA übertragen und dort gespeichert. Google wird diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen. Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden."
                : "This website uses Google Analytics, a web analytics service provided by Google Inc. (''Google''). Google Analytics uses so-called ''cookies'', text files that are stored on your computer and that enable an analysis of your use of the website. The information generated by the cookie about your use of this website (including your IP address) is transmitted to a Google server in the USA and stored there. Google will use this information to evaluate your use of the website, to compile reports on website activities for website operators and to provide other services related to website usage and internet usage. Google may also transfer this information to third parties if this is required by law or if third parties process this data on behalf of Google. Google will never associate your IP address with other Google data. You can prevent the installation of cookies by setting your browser software accordingly; however, we would like to point out that in this case you may not be able to use all functions of this website to their full extent. By using this website, you consent to the processing of data about you by Google in the manner and for the purposes set out above."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {language === "de" ? "Verantwortliche Stelle" : "Responsible party"}
            </h2>
            <p>
              {language === "de" ? "Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:" : "The responsible party within the meaning of the data protection laws is:"}
              <br />
              Novacana GmbH<br />
              Guerickeweg 5<br />
              64291 Darmstadt
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {language === "de" ? "Ihre Rechte" : "Your rights"}
            </h2>
            <p>
              {language === "de"
                ? "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen."
                : "You have the right to receive information about the origin, recipient and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances."}
            </p>
            <p>
              {language === "de"
                ? "Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden."
                : "You can contact us at any time regarding this and other questions on the subject of data protection."}
            </p>
            
            <p className="mt-12 text-sm text-gray-500">
              © {new Date().getFullYear()} Novacana GmbH.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
