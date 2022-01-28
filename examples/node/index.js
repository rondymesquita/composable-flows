const { Flow } = require('composable-flows')

const flow = new Flow([
  () => console.log('stage 1'),
  () => console.log('stage 2'),
])

flow.execute().then((lastResult) => {
  console.log('done', lastResult)
})
