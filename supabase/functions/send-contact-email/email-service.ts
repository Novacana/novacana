
import { Resend } from "npm:resend@2.0.0";

/**
 * Service for sending emails using the Resend API
 */
export class EmailService {
  private resend: Resend;
  private readonly defaultFromAddress: string = "Novacana <noreply@novacana.de>";
  private readonly notificationAddress: string = "info@novacana.de";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Resend API key is not provided");
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Sends a confirmation email to the person who submitted the contact form
   * @param recipientEmail Email address of the recipient
   * @param name Name of the recipient
   * @param htmlContent HTML content of the email
   * @returns Response from the Resend API
   */
  async sendConfirmationEmail(recipientEmail: string, name: string, htmlContent: string) {
    try {
      console.log(`Sending confirmation email to ${recipientEmail}`);
      
      const result = await this.resend.emails.send({
        from: this.defaultFromAddress,
        to: recipientEmail,
        subject: "Vielen Dank für Ihre Anfrage bei Novacana",
        html: htmlContent,
        text: `Vielen Dank für Ihre Anfrage, ${name}. Wir werden uns so schnell wie möglich bei Ihnen melden.`
      });

      if (!result || !result.id) {
        throw new Error("Fehler beim Senden der Bestätigungs-E-Mail: Keine gültige Antwort vom E-Mail-Server");
      }

      console.log(`Confirmation email sent with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw error;
    }
  }

  /**
   * Sends a notification email to Novacana about the new contact form submission
   * @param senderEmail Email address of the sender (for reply-to)
   * @param subject Subject of the email
   * @param htmlContent HTML content of the email
   * @returns Response from the Resend API
   */
  async sendNotificationEmail(senderEmail: string, subject: string, htmlContent: string) {
    try {
      console.log(`Sending notification email to ${this.notificationAddress}`);
      
      const result = await this.resend.emails.send({
        from: "Novacana Kontaktformular <noreply@novacana.de>",
        to: this.notificationAddress,
        subject: subject,
        html: htmlContent,
        reply_to: senderEmail,
        text: `Neue Kontaktanfrage über das Formular auf novacana.de. Bitte prüfen Sie den HTML-Inhalt für Details.`
      });

      if (!result || !result.id) {
        throw new Error("Fehler beim Senden der Benachrichtigungs-E-Mail: Keine gültige Antwort vom E-Mail-Server");
      }

      console.log(`Notification email sent with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error("Error sending notification email:", error);
      throw error;
    }
  }
}
