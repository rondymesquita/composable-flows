import { Flow, FlowOptions } from '../src'

function emailValidator(email: string) {
  console.log('>> 1. validating email', email)
  throw new Error('Error on validating user')
}

class EmailSender {
  async send(email: string): Promise<string> {
    console.log('>> 2. email sent')
    return Promise.resolve(`E-mail sent to ${email}`)
  }
}

const options: FlowOptions = {
  isSafe: false,
}
const flow = new Flow([emailValidator, new EmailSender().send], options)

;(async () => {
  try {
    await flow.execute('email@email.com')
  } catch (error) {
    console.log((error as Error).message)
  }
})()
