import User from "@/models/user.model";
import bcrypt from "bcryptjs"
const nodemailer = require("nodemailer");

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {

    const hashedToken = await bcrypt.hash(userId.toString(), 10)

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000
      })
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000
      })
    }

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "1c90c476b6932c",
        pass: "d0a18a17b91025"
      }
    });

    const mailOption = {
      from: 'ranjana99@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email " : "Reset your password ",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
    }

    const info = await transporter.sendMail(mailOption);
    return info
  } catch (error: any) {
    throw new Error(error.message)
  }
}

