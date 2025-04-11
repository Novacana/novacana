
import { Resend } from "npm:resend@2.0.0";

/**
 * Service for sending emails using the Resend API
 */
export class EmailService {
  private resend: Resend;
  private readonly defaultFromAddress: string = "Novacana <noreply@novacana.de>";
  private readonly notificationAddress: string = "info@novacana.de";

  /**
   * Initialize the email service with Resend API key
   * @param apiKey The Resend API key
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Resend API key is not provided");
    }
    this.resend = new Resend(apiKey);
    console.log("EmailService initialized with Resend API");
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

      this.validateEmailResult(result, "confirmation");
      
      console.log(`Confirmation email sent with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw this.enhanceError(error, "confirmation");
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

      this.validateEmailResult(result, "notification");
      
      console.log(`Notification email sent with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error("Error sending notification email:", error);
      throw this.enhanceError(error, "notification");
    }
  }

  /**
   * Validates the email sending result to ensure it was successful
   * @param result The result from the Resend API
   * @param emailType The type of email (confirmation or notification)
   */
  private validateEmailResult(result: any, emailType: string): void {
    console.log(`${emailType} email API response:`, result);

    if (!result || !result.id) {
      console.error(`Invalid response from email server for ${emailType} email:`, result);
      throw new Error(`Fehler beim Senden der ${emailType === "confirmation" ? "Bestätigungs" : "Benachrichtigungs"}-E-Mail: Keine gültige Antwort vom E-Mail-Server`);
    }
  }

  /**
   * Enhances an error with more descriptive information
   * @param error The original error
   * @param emailType The type of email (confirmation or notification)
   * @returns Enhanced error with more descriptive message
   */
  private enhanceError(error: any, emailType: string): Error {
    const emailTypeDE = emailType === "confirmation" ? "Bestätigungs" : "Benachrichtigungs";
    
    if (error.statusCode) {
      return new Error(`Fehler beim Senden der ${emailTypeDE}-E-Mail: Status ${error.statusCode} - ${error.message || "Unbekannter Fehler"}`);
    }
    
    return error instanceof Error 
      ? error 
      : new Error(`Fehler beim Senden der ${emailTypeDE}-E-Mail: ${error?.toString() || "Unbekannter Fehler"}`);
  }
}
