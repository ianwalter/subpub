const Subpub = require('../')

test('subscribe/publish works', done => {
  const sb = new Subpub()
  const data = { date: new Date() }
  sb.sub('test', d => {
    expect(d).toBe(data)
    done()
  })
  sb.pub('test', data)
})

test('unsubscribe works', done => {
  const sb = new Subpub()
  const unsubscribe = sb.sub('test', () => done.fail())
  unsubscribe()
  try {
    sb.pub('test', { date: new Date() })
  } catch (err) {
    done()
  }
})

test('topic deletion works', done => {
  const sb = new Subpub()
  sb.sub('test', () => done.fail())
  sb.del('test')
  try {
    sb.pub('test', { date: new Date() })
  } catch (err) {
    done()
  }
})
