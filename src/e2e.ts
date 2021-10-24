import { ComposableFlow } from '.'

class EmailValidator {
  validate(email: string): boolean {
    console.log('>>validating email', email)
    return email === 'email@email.com'
  }
}

class EmailSender {
  async send(email: string, body: string): Promise<boolean> {
    console.log('>>sending email', email, body)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>>email sent')
        resolve(true)
      }, 1500)
    })
  }
}

const emailSender = new EmailSender()
const emailValidator = new EmailValidator()
const flow = new ComposableFlow([
  () => emailValidator.validate('email@email.com'),
  () => emailSender.send('email@email.com', '# hello'),
])

flow.execute().then((response) => {
  console.log('>> done', response)
})
