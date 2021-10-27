import { ComposableFlow } from '../src'

export class EmailValidator {
  validate(email: string): boolean {
    console.log('>> 1.1 validating email', email)
    return email.includes('@email.com')
  }
}

export class EmailSender {
  async send(email: string): Promise<boolean> {
    console.log('>> 2.1. sending email', email)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent')
        resolve(true)
      }, 700)
    })
  }
}

const emailValidator = new EmailValidator()
const emailSender = new EmailSender()

const flow = new ComposableFlow([emailValidator.validate, emailSender.send])

flow.execute('email@email.com').then((lastResult) => {
  console.log('done', lastResult)
})
