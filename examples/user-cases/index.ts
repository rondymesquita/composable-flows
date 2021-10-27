export class EmailValidator {
  validate(email: string): boolean {
    console.log('>> 1.1 validating email', email)
    return email.includes('@email.com')
  }
}

export class EmailSender {
  async send(email: string, body: string): Promise<boolean> {
    console.log('>> 2.1. sending email', email, body)

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('>> 2.2. email sent')
        resolve(true)
      }, 700)
    })
  }
}
