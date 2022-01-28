import { Flow } from '../src'

function emailValidator(email: string) {
  console.log('>> 1. validating email', email)
  return true
}

class EmailSender {
  async send(email: string): Promise<boolean> {
    console.log('>> 2. email sent')
    return true
  }
}

const emailSender = new EmailSender()

const flow = new Flow([emailValidator, emailSender.send])

flow.execute('email@email.com').then((result) => {
  console.log('done', result)
})
