const express = require('express')
const { Flow } = require('composable-flows')

const app = express()
const port = 3000

function emailValidator(email) {
  console.log('>> 1. validating email', email)
  return true
}

class EmailSender {
  async send(email) {
    console.log('>> 2. email sent')
    return Promise.resolve(`E-mail sent to ${email}`)
  }
}

function notifyUser(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[NOTIFY] ${value}`)
      resolve()
    }, 200)
  })
}

app.get('/', async (req, res) => {
  const flow = new Flow([emailValidator, new EmailSender().send])

  await flow.execute('email@email.com')

  await flow.allOk(async (resultValues) => {
    console.log('allOk', resultValues)
    await notifyUser('allOk')
  })

  await flow.anyOk(async (resultValues) => {
    console.log('anyOk', resultValues)
    await notifyUser('anyOk')
  })

  console.log('done')
  res.send({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
