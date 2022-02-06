import { Flow, FlowMode } from '../src'

interface UserInput {
  email: string
}

interface User {
  id: number
  email: string
}

interface Event {
  name: string
  datetime: Date
}
export class GetUserInfo {
  get(userInput: UserInput): User {
    console.log('1. getting user information:[%s]', userInput.email)
    return {
      id: 1,
      email: userInput.email,
    }
  }
}

export class EmailSender {
  async send(user: User): Promise<Event> {
    console.log('2. sending email:[%s]', user.email)
    return Promise.resolve({
      name: 'email',
      datetime: new Date(),
    })
  }
}

export class Database {
  async storeEvent(event: Event): Promise<boolean> {
    console.log(
      '3. storing log for event:[%s] at [%s]',
      event.name,
      event.datetime,
    )
    return Promise.resolve(true)
  }
}

const getUserInfo = new GetUserInfo()
const emailSender = new EmailSender()
const database = new Database()

const options = {
  mode: FlowMode.PIPELINE,
}

const flow = new Flow<UserInput>(
  [getUserInfo.get, emailSender.send, database.storeEvent],
  options,
)

flow.execute({ email: 'email@email.com' }).then((result) => {
  console.log('done', JSON.stringify(result, null, 2))
})
