const path = require('path')
const fs = require('fs')
const axios = require('axios')
const run = require('../')

const entryPath = path.join(__dirname, 'fixture/app.js')
const port = 9988
const url = `http://localhost:${port}`
const appContent = `
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = 'hello world'
})

app.listen(${port})
`

const modifyContent = `
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = 'hello koa'
})

app.listen(${port})
`
const defaultOpts = {
  exec: entryPath,
  context: entryPath,
  cluster: 1
}

const delay = num => new Promise(resolve => {
  setTimeout(() => resolve(), num)
})

beforeEach(() => {
  fs.writeFileSync(entryPath, appContent)
  run(defaultOpts)
})

afterEach(() => {
  fs.unlinkSync(entryPath)
})

test('should reload after modify file', async () => {
  await delay(1000)
  const res = await axios.get(url)
  expect(res.data).toBe('hello world')
  fs.writeFileSync(entryPath, modifyContent)
  await delay(1000)
  const res2 = await axios.get(url)
  expect(res2.data).toBe('hello koa')
})
