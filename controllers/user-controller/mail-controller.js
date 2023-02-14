const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSOWRD,
    },
  });

  let MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
    }
  })

  const registerMail = async (req,res)=>{
    const {username, userEmail, text, subject} = req.body;

    //body of the email
    let email = {
        body:{
            username,
            intro:text || 'welcome to turf play',
            outro:'Need help,just replay to this mail'
        }
    }
    let emailBody = MailGenerator.generate(email)

    const mailOptions = {
        from:'yasermuhammed367@gmail.com',
        to:userEmail,
        subject:subject||"verify your email",
        html:emailBody
    }

    await transporter.sendMail(mailOptions)
    return res.status(200).send({message:"successfully sent"})

  }

  module.exports = {
    registerMail
  }