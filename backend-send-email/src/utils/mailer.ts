import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export const sendVerificationEmail = async (to: string, code: string) => {
  await transporter.sendMail({
    from: `"Mini Trello App - by Nguyễn Minh Đức" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Verification code for Mini Trello App',
    text: `Your verification code is: ${code}`
  })
}
