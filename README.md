# @ianwalter/subpub
> A super-simple JavaScript Subscribe/Publish (pubsub) implementation

[![npm page][npmImage]][npmUrl]

## Installation

```console
yarn add @ianwalter/subpub
```

## Usage

```js
import Subpub from '@ianwalter/subpub'

const sp = new Subpub()
sp.sub('alerts', msg => console.log(msg))

sp.pub('alerts', 'We ran out of coffee!')
```

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/subpub.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/subpub
[licenseUrl]: https://github.com/ianwalter/subpub/blob/master/LICENSE
