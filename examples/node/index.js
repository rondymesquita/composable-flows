const { ComposableFlow } = require('composable-flows')

const flow = new ComposableFlow([
  () => console.log('stage 1'),
  () => console.log('stage 2'),
])

flow.execute().then((lastResult) => {
  console.log('done', lastResult)
})
