
// HTML-Template für die Bestätigungs-E-Mail
export const getConfirmationEmailTemplate = (confirmationURL: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestätigen Sie Ihre Registrierung bei Novacana</title>
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
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
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
    .button {
      display: inline-block;
      background-color: #4a7b57;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .info {
      font-size: 14px;
      background-color: #f0f7f2;
      border-left: 4px solid #4a7b57;
      padding: 10px 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo" class="logo">
  </div>
  
  <div class="container">
    <h2>Bestätigen Sie Ihre Registrierung</h2>
    
    <p>Vielen Dank für Ihre Registrierung bei Novacana. Als Teil des medizinischen Fachkreises bieten wir Ihnen Zugang zu exklusiven Informationen und Produkten.</p>
    
    <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die folgende Schaltfläche klicken:</p>
    
    <div style="text-align: center;">
      <a href="${confirmationURL}" class="button">E-Mail bestätigen</a>
    </div>
    
    <div class="info">
      <p><strong>Hinweis:</strong> Diese E-Mail wurde für medizinisches Fachpersonal und Apotheken generiert. Falls Sie diese E-Mail irrtümlicherweise erhalten haben, ignorieren Sie diese bitte.</p>
    </div>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
`;

// HTML-Template für die Passwort-Reset-E-Mail
export const getResetPasswordEmailTemplate = (resetURL: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen - Novacana</title>
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
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
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
    .button {
      display: inline-block;
      background-color: #4a7b57;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .warning {
      font-size: 14px;
      background-color: #fff6f6;
      border-left: 4px solid #e74c3c;
      padding: 10px 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo" class="logo">
  </div>
  
  <div class="container">
    <h2>Passwort zurücksetzen</h2>
    
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für Ihren Novacana-Zugang gestellt.</p>
    
    <p>Bitte klicken Sie auf die folgende Schaltfläche, um Ihr Passwort zurückzusetzen:</p>
    
    <div style="text-align: center;">
      <a href="${resetURL}" class="button">Passwort zurücksetzen</a>
    </div>
    
    <div class="warning">
      <p><strong>Sicherheitshinweis:</strong> Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail und stellen Sie sicher, dass Sie weiterhin Zugriff auf Ihr Konto haben.</p>
    </div>
    
    <p>Dieser Link ist aus Sicherheitsgründen nur für eine begrenzte Zeit gültig.</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
`;

// HTML-Template für die Kontaktformular-Benachrichtigung
export const getContactFormEmailTemplate = (name: string, email: string, pharmacyName: string, message: string) => `
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
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
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
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo" class="logo">
  </div>
  
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
    
    <p>Sie können auf diese E-Mail antworten, um direkt mit dem Absender zu kommunizieren.</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese Nachricht wurde über das Kontaktformular auf novacana.de gesendet.</p>
  </div>
</body>
</html>
`;
