import nodemailer from 'nodemailer'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.newtechbd.net',
      port: 587,
      secure: false,
      auth: {
        user: config.email,
        pass: config.appPass,
      },
    })
    if (to) {
      await transporter.sendMail({
        from: {
          name: 'Newtech Technology',
          address: config.email || '',
        },
        to,
        subject,
        html,
      })
    }
  } catch (error) {
    throw new ApiError(500, (error as Error).message)
  }
}
