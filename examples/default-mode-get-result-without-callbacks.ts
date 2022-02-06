import { Flow } from '../src'

function emailValidator(email: string) {
  console.log('>> 1. validating email', email)
  return true
}

class EmailSender {
  async send(email: string): Promise<string> {
    console.log('>> 2. email sent')
    return Promise.resolve(`E-mail sent to ${email}`)
  }
}

const flow = new Flow([emailValidator, new EmailSender().send])

;(async () => {
  const result = await flow.execute('email@email.com')
  console.log(result)
})()
