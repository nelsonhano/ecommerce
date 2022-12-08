const nodemailer = require("nodemailer");
function sendCode(email, otp) {
  var email = email;
  var otp = otp;

  var mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adebayowalid@gmail.com", // Your email id
      pass: "swqabzajomjokwye", // Your password
    },
  });

  var mailOptions = {
    from: {name:"AluSoft Mall",address: "adebayowalid@gmail.com"},
    to: email,
    subject: "Otp verification code",
    html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Alusoft Mall</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Alusoft Mall. Use the following OTP to complete your Sign Up procedures. OTP is valid for 10 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Alusoft Mall</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>AluSoft Technologies Ltd | RC1602804</p>
        <p>Elem Building Opposite IDC Primary School Akobo Road Akobo, Local Government, Ibadan</p>
        <p>Nigeria</p>
      </div>
    </div>
  </div>`,
  };
  mail.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('OTP sent to : ' + email);
    }
  });
}
module.exports = sendCode