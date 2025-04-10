export const getVerificationEmailTemplate = (verificationLink: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .header h1 {
          color: #333333;
          font-size: 24px;
          margin: 0;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content p {
          color: #666666;
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #999999;
          font-size: 14px;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Platform!</h1>
        </div>
        <div class="content">
          <p>Thank you for signing up. Please verify your email address to activate your account.</p>
          <p>
            <a href="${verificationLink}" class="button">Verify Your Account</a>
          </p>
          <p>If the button above doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
        </div>
        <div class="footer">
          <p>If you didn’t create this account, please ignore this email.</p>
          <p>&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
