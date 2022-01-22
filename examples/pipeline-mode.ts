import { Flow, FlowMode } from '../src'

interface UserInput {
  email: string
  role: string
}
export class GetUserInfo {
  get(userInput: UserInput): any {
    console.log(
      '>> 1.1 getting user email:[%s] role:[%s]',
      userInput.email,
      userInput.email,
    )
    return {
      id: 1,
      email: userInput.email,
    }
  }
}

export class EmailSender {
  async send(userInfo: any): Promise<any> {
    console.log('>> 2.1. sending email to userInfo:%o', userInfo)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent:[%s]', userInfo.email)
        resolve({
          event: 'email',
          userID: userInfo.id,
        })
      }, 300)
    })
  }
}

export class Database {
  async storeLog(log: any): Promise<boolean> {
    console.log('>> 3.1. storing log for event:[%s]', log.event)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 3.2. log saved id:[%s]', log.userID)
        resolve(true)
      }, 300)
    })
  }
}

const getUserInfo = new GetUserInfo()
const emailSender = new EmailSender()
const database = new Database()

const options = {
  mode: FlowMode.PIPELINE,
}

const flow = new Flow(
  [getUserInfo.get, emailSender.send, database.storeLog],
  options,
)

flow.execute({ email: 'email@email.com', role: 'admin' }).then((lastResult) => {
  console.log('done', lastResult)
})
