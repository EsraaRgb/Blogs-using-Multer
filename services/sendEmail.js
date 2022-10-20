import nodeoutlook from 'nodejs-nodemailer-outlook'
import fs from 'fs'
export default function sendConfirmationEmail(email,message,attachments){
    nodeoutlook.sendEmail({
        auth:{
            user: "sarahaserver@outlook.com",
            pass: "rvyG_Nea8kXuH_G"
        },
        from: 'sarahaserver@outlook.com',
        to: email,
        subject: 'Welcome !',
        html: message,
        text: 'This is text version!',
        attachments,
    
        onError: (e) => console.log(e),
    })
}

