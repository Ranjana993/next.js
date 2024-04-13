import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model"
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";





connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { username, email, password } = reqBody

    // validation 

    console.log(reqBody);
    const user = await User.findOne({ email })
    if (user) {
      return NextResponse.json({ error: "User already exist with this email" }, { status: 400 })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newSavedUser = await new User({
      username: username,
      email: email,
      password: hashedPassword
    }).save()
    console.log(newSavedUser);

    // sending verification email
    const emailres = await sendEmail({ email, emailType: "VERIFY", userId: newSavedUser._id })
    return NextResponse.json({ message: "User registered successfully ", success: true, newSavedUser })

  }
  catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}