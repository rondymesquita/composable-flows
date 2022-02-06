import { Flow } from '../src'

function emailValidator(email: string) {
  console.log('validating email', email)
  return true
}

class EmailSender {
  async send(email: string): Promise<string> {
    console.log('email sent to %s', email)
    return Promise.resolve(`E-mail sent to ${email}`)
  }
}

const emailSender = new EmailSender()
const flow = new Flow([
  // normal function
  emailValidator,

  // method
  emailSender.send,

  // bind function
  emailSender.send.bind(emailSender, 'email@another.com'),

  // an anonymous function
  (email: string) => {
    const newEmail = email.replace('@email.com', '@completelydifferent.com')
    emailSender.send(newEmail)
    return 'DONE'
  },
])

;(async () => {
  await flow.execute('email@email.com')

  await flow.allOk((resultValues) => {
    console.log(resultValues)
  })
})()
