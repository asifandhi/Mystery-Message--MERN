export const verificationEmailHTML = (username,otp)=> `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Hey ${username}, verify your account</h2>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
    <p>This code expires in <strong>1 hour</strong>.</p>
    <p>If you didn't sign up, ignore this email.</p>
  </body>
</html>
`;