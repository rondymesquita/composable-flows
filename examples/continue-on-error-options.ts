import { Flow } from '../src'

export class GetUserInfo {
  get(email: string, role: string): any {
    console.log('This stage fails')
    throw new Error('Error when getting user information')
  }
}

export class EmailSender {
  send(email: string, body: string): any {
    console.log('This will be executed even if previous stage fails')
  }
}

const getUserInfo = new GetUserInfo()
const emailSender = new EmailSender()

const options = {
  stopOnError: false,
}
const flow = new Flow(
  [
    () => getUserInfo.get('email@email.com', 'admin'),
    () => emailSender.send('email@email.com', '#hello'),
  ],
  options,
)

flow.execute().then((lastResult) => {
  console.log('done', lastResult)
})
