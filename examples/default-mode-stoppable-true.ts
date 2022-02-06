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
  isStoppable: true,
}
const flow = new Flow([emailValidator, new EmailSender().send], options)

;(async () => {
  await flow.execute('email@email.com')

  await flow.anyOk((resultValues) => {
    console.log(resultValues)
  })

  await flow.anyFail((errors) => {
    console.log(errors)
  })
})()
