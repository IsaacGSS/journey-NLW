import nodemailer from 'nodemailer'

async function getMailClient() {
  const account = await nodemailer.createTestAccount()

  const trasporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    }
  })

  return trasporter
}

export default getMailClient