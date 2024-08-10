import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAILPASS
    }
})

const sendRestlink = async(userEmail:string,resetLink:string) =>{
    const mailOptions = {
        to: userEmail,
        from: 'workwiseoffice@gmail.com',
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`,
      };

      try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Message sent successfully', info.messageId);
      } catch (error) {
        console.error('Verification mail send failed', error);
        
      }
    

}

export default sendRestlink
  
    
