
// Email templates for the contact form notifications

/**
 * Generates an HTML template for the confirmation email sent to the user
 * @param name The name of the person who submitted the contact form
 * @returns HTML template as a string
 */
export const getConfirmationEmailTemplate = (name: string): string => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestätigung Ihrer Anfrage bei Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Vielen Dank für Ihre Anfrage</h2>
    
    <p>Sehr geehrte(r) ${name},</p>
    
    <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
    
    <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
`;

/**
 * Generates an HTML template for the notification email sent to Novacana
 * @param name The name of the person who submitted the contact form
 * @param email The email address of the person who submitted the contact form
 * @param pharmacyName Optional name of the pharmacy
 * @param message The message content from the contact form
 * @returns HTML template as a string
 */
export const getNotificationEmailTemplate = (
  name: string, 
  email: string, 
  pharmacyName: string, 
  message: string
): string => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kontaktanfrage - Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .info-block {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f0f7f2;
      border-radius: 4px;
    }
    .message-block {
      margin-top: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-left: 4px solid #4a7b57;
      border-radius: 4px;
    }
    h2 {
      color: #4a7b57;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Neue Kontaktanfrage</h2>
    
    <p>Sie haben eine neue Anfrage über das Kontaktformular auf Ihrer Website erhalten.</p>
    
    <div class="info-block">
      <p><span class="label">Name:</span> ${name}</p>
      <p><span class="label">E-Mail:</span> ${email}</p>
      <p><span class="label">Apotheke:</span> ${pharmacyName || 'Nicht angegeben'}</p>
    </div>
    
    <h3>Nachricht:</h3>
    <div class="message-block">
      ${message.replace(/\n/g, '<br>')}
    </div>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese Nachricht wurde über das Kontaktformular auf novacana.de gesendet.</p>
  </div>
</body>
</html>
`;
