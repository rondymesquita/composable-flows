import { ComposableFlow } from '../src'
import { EmailValidator, EmailSender } from './user-cases'

const emailValidator = new EmailValidator()
const emailSender = new EmailSender()

const flow = new ComposableFlow([
  {
    handler: emailValidator.validate,
    when: () => {
      return false
    },
  },
  () => emailSender.send('email@email.com', '# hello'),
])

flow.execute().then((lastResult) => {
  console.log('done', lastResult)
})
