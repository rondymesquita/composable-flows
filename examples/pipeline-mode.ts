import { ComposableFlow, Mode } from '../src'

export class GetUserInfo {
  get(email: string, role: string): any {
    console.log('>> 1.1 getting user', email, role)
    return {
      id: 1,
      email,
    }
  }
}

export class EmailSender {
  async send(userInfo: any): Promise<any> {
    console.log('>> 2.1. sending email to', userInfo)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent', userInfo)
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
    console.log('>> 3.1. storing log for event [%s]', log.event)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 3.2. log saved', log)
        resolve(true)
      }, 300)
    })
  }
}

const getUserInfo = new GetUserInfo()
const emailSender = new EmailSender()
const database = new Database()

const options = {
  mode: Mode.PIPELINE,
}

const flow = new ComposableFlow(
  [
    () => {
      return getUserInfo.get('email@email.com', 'admin')
    },
    emailSender.send,
    database.storeLog,
  ],
  options,
)

flow.execute().then((lastResult) => {
  console.log('done', lastResult)
})
