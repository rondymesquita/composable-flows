# Composable Flows

Compose flows and use cases using functions.

[Check docs.](https://rondymesquita.github.io/composable-flows/)

```ts
import { Flow } from 'composable-flows'

function emailValidator(email: string) {
  return true
}

class EmailSender {
  async send(email: string): Promise<string> {
    return Promise.resolve(`E-mail sent to ${email}`)
  }
}

const flow = new Flow([emailValidator, new EmailSender().send])

;(async () => {
  await flow.execute('email@email.com')

  await flow.allOk((resultValues) => {
    console.log(resultValues)
  })
})()
```

## Import/Require

Import

```ts
import { Flow, FlowMode } from 'composable-flows'
```

Require

```js
const { Flow, FlowMode } = require('composable-flows')
```

Browser

```html
<script src="dist/browser/index.js"></script>
```

## Options

| Option name  | Default value    | Description                                                                                                                                                                      | Possible values                     |     |
| ------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --- |
| isStoppabble | false            | If flow should stop when an error occurs                                                                                                                                         | true,false                          |     |
| isSafe       | true             | If should not thrown an exception when an error occurs                                                                                                                           | true,false                          |     |
| mode         | FlowMode.DEFAULT | Defines how flow will be executed. DEFAULT: the stages run with same parameter passed on `execute` method. PIPELINE: the result of a stage is passed as parameter of next stage. | FlowMode.DEFAULT, FlowMode.PIPELINE |     |

## Passing parameters

A Flow allow you to pass a single parameter to all stages in a single `execute` call.
The same parameter is injected in all stages.

```ts
// a parameter passed on `execute`
await flow.execute('email@email.com')

// is injected on each stage
function emailValidator(email: string) {
  // email is 'email@email.com'
}

class EmailSender {
  async send(email: string): Promise<string> {
    // email is 'email@email.com' also
  }
}
```

## Using promises?

The `execute` method returns a promise.

```ts
// using `then`
flow.execute('email@email.com').then((result) => {})

// or using async/await
const result = await flow.execute('email@email.com')
```

## Stages

Each step of flow (each item of the array) is called `Stage`.
Stages can be functions or methods.

```ts
// a simple function
function simpleFunction(email: string) {}

// a method
class Example {
  method(email: string) {}
}

const example = new Example()
const flow = new Flow([simpleFunction, example.method])
```

## Callbacks

Flow comes with callbacks to handle the flow result.
This is useful to leverage exeception handling and increase code readability.

### **Success callbacks**

Get the result of all stage when they all run successfully

```ts
await flow.allOk((resultValues) => {
  console.log(resultValues)
})
```

Get the result of stages, when having any stage that run successfully

```ts
await flow.anyOk((resultValues) => {
  console.log(resultValues)
})
```

Get the result of a specific stage by its index

```ts
const flow = new Flow([emailValidator, new EmailSender().send])

const index = 0
await flow.ok(index, (resultValue) => {
  //resultValue is the result of emailValidator
  console.log(resultValue)
})
```

Get the result of a specific stage by its name

```ts
const flow = new Flow([
  emailValidator,
  { 'send email': new EmailSender().send },
])

await flow.ok('send email', (resultValue) => {
  //resultValue is the result of EmailSender.send
  console.log(resultValue)
})
```

### **Error callbacks**

Get the errors of stages when they all fail

```ts
await flow.allFail((errors) => {
  console.log(errors)
})
```

Get the errors of stages, when having any stage fails

```ts
await flow.anyFail((errors) => {
  console.log(errors)
})
```

Get the result of a specific stage by its index

```ts
const flow = new Flow([emailValidator, new EmailSender().send])

const index = 0
await flow.fail(index, (error) => {
  // error is the error of emailValidator
  console.log(error)
})
```

Get the error of a specific stage by its name

```ts
const flow = new Flow([
  emailValidator,
  { 'send email': new EmailSender().send },
])

await flow.fail('send email', (error) => {
  //error is the error of EmailSender.send
  console.log(error)
})
```

### Get the result without using callbacks

If you don't want to use the callbacks and wants to handle the result by yourself.

```ts
const result = await flow.execute('email@email.com')
console.log('result', result)
```

The resulting log is:

```ts
{
  result: StageResult {
    isError: false,
    error: undefined,
    value: 'E-mail sent to email@email.com'
  },
  resultAll: [
    IndexedStageResult {
      isError: false,
      error: undefined,
      value: true,
      id: 0
    },
    IndexedStageResult {
      isError: false,
      error: undefined,
      value: 'E-mail sent to email@email.com',
      id: 1
    }
  ]
}
```

### Multiples callbacks

You can use multiples callbacks in the same flow.

```ts
const flow = new Flow([emailValidator, new EmailSender().send])

await flow.allOk((resultValues) => {
  console.log(resultValues)
})

await flow.anyFail((errors) => {
  console.log(errors)
})
```

### Callbacks as promises

Each callback call is a promise. This is because depending on you flow, you can wait or not for the callback completion. Let's suppose you have an express.js controller like that:

```ts
app.get('/', async function (req, res) {
  const flow = new Flow([emailValidator, new EmailSender().send])
  await flow.execute('email@email.com')

  flow.allOk((resultValues) => {
    // This will be called when all stages run
    res.json({ resultValues })
  })

  flow.anyFail((errors) => {
    // This will be called when any stage throws an exeception
    res.status(400).json({ errors })
  })
})
```

This will work fine with or without the `await` keyword on `flow.allOk` and `flow.anyFail`.

But, let suppose you run an asynchronous code inside of each callback:

```ts
function notifyUser(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[NOTIFY] ${value}`)
      resolve()
    }, 200)
  })
}

const flow = new Flow([emailValidator, new EmailSender().send])

await flow.execute('email@email.com')

flow.allOk(async (resultValues) => {
  console.log('allOk', resultValues)
  await notifyUser('allOk')
})

flow.anyOk(async (resultValues) => {
  console.log('anyOk', resultValues)
  await notifyUser('anyOk')
})

console.log('done')
res.send({ status: 'ok' })
```

The resulting log will be:

```
allOk [ true, 'E-mail sent to email@email.com' ]
anyOk [ true, 'E-mail sent to email@email.com' ]
done
[NOTIFY] allOk
[NOTIFY] anyOk
```

That means, the `notifyUser` function is being resolved only after the response has been sent.

If you want to wait the callbacks, before sending the response, you must add the `await` keyword on the callbacks, like that:

```ts
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
  res.send({ status: 'ok' })`
```

And the resulting log will be:

```
allOk [ true, 'E-mail sent to email@email.com' ]
[NOTIFY] allOk
anyOk [ true, 'E-mail sent to email@email.com' ]
[NOTIFY] anyOk
done
```

Thus, this will make the callbacks to be resolved, before continuing the execution.

## Exception handling

By default, Flow will never thrown an exception. To handle exception and get the errors, you should use the proper callbacks: `fail`, `anyFail` and `allFail`.

But, if you want the handle the exception by yourself, you just simply need to pass the option `isSafe: false` and use `try/catch` for that.

If `isSafe` is `false` and an exeception occurs, the flow will be interrupted.

```ts
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
    const result = await flow.execute('email@email.com')
    console.log('result', result)
  } catch (error) {
    console.log((error as Error).message)
  }
})()
```

> ### Note
>
> ```ts
> // This
> new Flow([], { isSafe: true })
> // is equivalent to
> new Flow([])
> ```

## Stop the flow

By default, if an exception occurs, the flow will never stop, unless you say so with `isStoppable: true`.

```ts
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

  // EmailSender().send was never executed since emailValidator throws an exeception

  await flow.anyFail((errors) => {
    console.log(errors)
  })
})()
```

## Pipeline mode

By default, the parameter passed on `execute` function, is used to call each stage.

With PIPELINE mode, the result of a stage is used as parameter of the next stage.

In this mode, the parameter passed on `execute` is used only in the first stage.

Also, in PIPELINE mode, if an exception occurs, the flow is interrupted.
Since the result of a stage is used as parameter of next, in case of exeception, the next stage cannot have the result of a failed stage.

So, in PIPELINE mode, `isStoppable` is always `true`.

```ts
import { Flow, FlowMode } from 'composable-flows'

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

    // this result will be input of EmailSender.send
    return {
      id: 1,
      email: userInput.email,
    }
  }
}

export class EmailSender {
  async send(user: User): Promise<Event> {
    console.log('2. sending email:[%s]', user.email)

    // this result will be input of Database.storeEvent
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

// This parameter will be passed only to the first stage
flow.execute({ email: 'email@email.com' }).then((result) => {
  console.log('done', JSON.stringify(result, null, 2))
})
```

> ### Note
>
> ```ts
> // This
> new Flow([], { mode: FlowMode.DEFAULT })
> // is equivalent to
> new Flow([])
> ```

## Advanced usage

Some way you can use Flow.

```ts
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
```

> ### Note
>
> When using PIPELINE mode, the anonymous functions are required to return the value since it will be used as input of next stage.
>
> ```ts
> const flow = new Flow([
>   // an anonymous function
>   (email: string) => {
>     const newEmail = email.replace('@email.com', '@different.com')
>     const response = emailSender.send(newEmail)
>
>     // Remember to return here, when needed
>     return response
>   },
> ])
> ```
