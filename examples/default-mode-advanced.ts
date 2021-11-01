import { Flow } from '../src'

export class EmailValidator {
  validate(email: string): boolean {
    console.log('>> 1.1 validating email [%s]', email)
    return email.includes('@email.com')
  }
}

export class EmailSender {
  async send(email: string): Promise<boolean> {
    console.log('>> 2.1. sending email to:[%s]', email)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent:[%s]', email)
        resolve(true)
      }, 700)
    })
  }
}

const emailValidator = new EmailValidator()
const emailSender = new EmailSender()

;(async () => {
  const flow = new Flow([
    { validateEmail: emailValidator.validate },
    { 'send email': emailSender.send },
  ])
  const { result, get } = await flow.execute('email@email.com')

  get('send email', ({ success, failure }) => {
    success((data) => {})
    failure((error) => {})
  })

  get('send email')()

  // result.with('emailValidator.validate', () => {

  // })
  // const stageResult = result.with('emailValidator.validate')
  console.log('done', result)
})()
