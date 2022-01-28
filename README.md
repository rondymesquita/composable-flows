# Composable Flows

Compose flows and use cases using functions.

```ts
import { Flow } from '../src'

function emailValidator(email: string) {
  console.log('>> 1. validating email', email)
  return true
}

class EmailSender {
  async send(email: string): Promise<boolean> {
    console.log('>> 2. email sent')
    await ...
    return true
  }
}

const emailSender = new EmailSender()

const flow = new Flow([emailValidator, emailSender.send])

const result = await flow.execute('email@email.com')
console.log('done', result)

// OUTPUT

// >> 1. validating email email@email.com
// >> 2. email sent
// done {
//   result: StageResult { isError: false, error: undefined, value: true },
//   resultAll: [
//     IndexedStageResult {
//       isError: false,
//       error: undefined,
//       value: true,
//       id: 0
//     },
//     IndexedStageResult {
//       isError: false,
//       error: undefined,
//       value: true,
//       id: 1
//     }
//   ]
// }
```

### Result

| asdasd     |     |     |     |     |
| ---------- | --- | --- | --- | --- |
| FlowResult |     |     |     |     |
|            |     |     |     |     |
|            |     |     |     |     |

### Passing parameters

A Flow allow you to pass a single parameter to all stages in a single `execute` call.
The same parameter is injected in all stages.

```ts
// a parameter passed on `execute`
await flow.execute('email@email.com')

// is injected on each stage
function emailValidator(email: string) {
  console.log('>> 1. validating email', email)
  return true
}

class EmailSender {
  async send(email: string): Promise<boolean> {
    console.log('>> 2. email sent')
    return true
  }
}
```

### Using promises?

The `execute` method returns a promise.

```ts
// using `then`
flow.execute('email@email.com').then((result) => {})

// or async/await
const result = await flow.execute('email@email.com')
```

### Stages

Stages are functions.

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
