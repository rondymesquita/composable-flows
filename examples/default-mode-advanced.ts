import { Flow } from '../src'

export class EmailValidator {
  validate(email: string): boolean {
    console.log('>> 1.1 validating email [%s]', email)
    return email.includes('@email.com')
  }
}

export class EmailSender {
  async send(email: string): Promise<any> {
    console.log('>> 2.1. sending email to:[%s]', email)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent:[%s]', email)
        resolve({ ok: true })
      }, 200)
    })
  }
}

const emailValidator = new EmailValidator()
const emailSender = new EmailSender()

;(async () => {
  const flow = new Flow([
    emailSender.send,
    { validateEmail: emailValidator.validate },
    { 'send email': emailSender.send },
  ])
  const { resultAll } = await flow.execute('email@email.com')

  await flow.ok('send email', async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('done send email', data)
        resolve({})
      }, 200)
    })
  })
  console.log('done', resultAll)
})()
