import { ComposableFlow } from '.'

class EmailValidator {
  validate(email: string): boolean {
    console.log('>> 1.1 validating email', email)
    return email === 'email@email.com'
  }
}

class EmailSender {
  async send(email: string, body: string): Promise<boolean> {
    console.log('>> 2.1. sending email', email, body)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent')
        resolve(true)
      }, 700)
    })
  }
}

class Notifier {
  async notify(): Promise<string> {
    console.log('>> 3.1. sending notification')

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 3.2. notification sent')
        resolve('notification sent')
      }, 300)
    })
  }
}

const emailSender = new EmailSender()
const emailValidator = new EmailValidator()
const notifier = new Notifier()

const flow = new ComposableFlow([
  () => emailValidator.validate('email@email.com'),
  () => emailSender.send('email@email.com', '# hello'),
  () => notifier.notify(),
])

flow.execute().then((response) => {
  console.log('>> done', response)
})
