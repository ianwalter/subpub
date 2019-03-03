import test from 'ava'
import Subpub from '.'

test('subscribe/publish works', t => {
  const sb = new Subpub()
  const data = { date: new Date() }
  t.plan(1)
  sb.sub('test', d => t.is(d, data))
  sb.pub('test', data)
})

test('unsubscribe works', t => {
  const sb = new Subpub()
  const unsubscribe = sb.sub('test', t.fail)
  unsubscribe()
  t.throws(() => sb.pub('test', 'The subscriber was not unsubscribed'))
})

test('topic deletion works', t => {
  const sb = new Subpub()
  sb.sub('test', t.fail)
  sb.del('test')
  t.throws(() => sb.pub('test', 'The topic was not deleted'))
})

test('async callbacks can be awaited', async t => {
  const sb = new Subpub()

  let time = new Date().getTime()
  sb.sub('test', () => new Promise(
    resolve => setTimeout(() => resolve(new Date().getTime() - time > 99), 100)
  ))

  const [result] = await Promise.all(sb.pub('test'))
  t.true(result)
})

test('pattern matching on object keys', async t => {
  const sb = new Subpub()
  const unsubscribe = sb.sub({ path: '/foo' }, async () => t.pass())
  await sb.pub({ name: 'Foo', path: '/foo' })
  unsubscribe()
})

test('subscribe to all', async t => {
  const sb = new Subpub()
  sb.sub('test', async () => 'one')
  sb.sub(async () => 'two')
  t.deepEqual(['two', 'one'], await Promise.all(sb.pub('test')))
  sb.del()
})
