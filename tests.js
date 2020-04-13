const { test } = require('@ianwalter/bff')
const { Subpub } = require('.')

test('subscribe/publish works', ({ expect }) => {
  const sb = new Subpub()
  const data = { date: new Date() }
  sb.sub('test', d => expect(d).toBe(data))
  sb.pub('test', data)
})

test('unsubscribe works', ({ expect, fail }) => {
  const sb = new Subpub()
  const unsubscribe = sb.sub('test', fail)
  unsubscribe()
  expect(() => sb.pub('test', 'The subscriber was not unsubscribed')).toThrow()
})

test('topic deletion works', ({ expect, fail }) => {
  const sb = new Subpub()
  sb.sub('test', fail)
  sb.del('test')
  expect(() => sb.pub('test', 'The topic was not deleted')).toThrow()
})

test('async callbacks can be awaited', async ({ expect }) => {
  const sb = new Subpub()

  const time = new Date().getTime()
  sb.sub('test', () => new Promise(
    resolve => setTimeout(() => resolve(new Date().getTime() - time > 99), 100)
  ))

  const [result] = await Promise.all(sb.pub('test'))
  expect(result).toBe(true)
})

test('pattern matching on object keys', async ({ pass }) => {
  const sb = new Subpub()
  const unsubscribe = sb.sub({ path: '/foo' }, pass)
  await sb.pub({ name: 'Foo', path: '/foo' })
  unsubscribe()
})

test('subscribe to all', async ({ expect }) => {
  const sb = new Subpub()
  sb.sub('test', async () => 'one')
  sb.sub(async () => 'two')
  expect(['two', 'one']).toEqual(await Promise.all(sb.pub('test')))
  sb.del()
})
