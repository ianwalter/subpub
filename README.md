# @ianwalter/subpub
> A super-simple JavaScript Subscribe/Publish (pubsub) implementation

[![npm page][npmImage]][npmUrl]

## Installation

```console
yarn add @ianwalter/subpub
```

## Usage

```js
import { Subpub } from '@ianwalter/subpub'

// Create a Subpub instance.
const sp = new Subpub()

// Create a subscription to a topic.
const usubscribe = sp.sub('alerts', msg => console.log(msg))

// Publish a message on the topic.
sp.pub('alerts', 'We ran out of coffee!')

// Unsubscribe the subscriber from the topic.
usubscribe()

// Create a subscriber with an object key that can be pattern-matched.
sp.sub({ key: '1d', name: 'BIBA' }, async msg => msg.toUpperCase())

// Send a message to the subscriber using only the key property to match and
// wait for the returned promise to resolve with the transformed value.
await sp.pub({ key: '1d' }, 'Te biba nachdi') // => TE BIBA NACHDI
```

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://ianwalter.dev)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/subpub.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/subpub
[licenseUrl]: https://github.com/ianwalter/subpub/blob/master/LICENSE
