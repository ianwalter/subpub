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
  const unsubscribe = sb.sub('test', () => t.fail())
  unsubscribe()
  try {
    sb.pub('test', { date: new Date() })
  } catch (err) {
    t.pass()
  }
})

test('topic deletion works', t => {
  const sb = new Subpub()
  sb.sub('test', () => t.fail())
  sb.del('test')
  try {
    sb.pub('test', { date: new Date() })
  } catch (err) {
    t.pass()
  }
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
