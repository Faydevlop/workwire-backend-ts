const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'workwiseoffice@gmail.com',
        pass:'jxrd fiij lmtt ifav'
    }
})

const sendVerificationmail = async(userEmail:string,randomPass:string) => {
    const mailOptions = {
        from: 'workwiseoffice@gmail.com', // Sender address
        to: `${userEmail}`, // Replace with the new employee's email address
        subject: 'Welcome to Workwise - Your Temporary Password', // Subject line
        text: `Hello,
      
      Welcome to Workwise!
      
      Your temporary password is: ${randomPass}
      
      Please use this password to log in and then update it to something more secure once you’re logged in.
      
      If you have any questions or need further assistance, feel free to reach out to our support team.
      
      Best regards,
      The Workwise Team`, // Plain text body
        html: `
          <p>Hello,</p>
          <p>Welcome to <strong>Workwise</strong>!</p>
          <p>Your temporary password is: <strong>${randomPass}</strong></p>
          <p>Please use this password to log in and then update it to something more secure once you’re logged in.</p>
          <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Workwise Team</p>
        `, // HTML body
      };
    try {
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent successfully', info.messageId);
      
    } catch (error) {
        
        console.error('Verification mail send failed', error);
    }


}


export default sendVerificationmail