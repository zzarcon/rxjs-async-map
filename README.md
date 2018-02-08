# rxjs-async-map

Map an observable using an async function with a configurable concurreny level, while preserving element order.

[![CircleCI](https://img.shields.io/circleci/project/github/srijs/rxjs-async-map.svg)](https://circleci.com/gh/srijs/rxjs-async-map/tree/master)
[![Greenkeeper badge](https://badges.greenkeeper.io/srijs/rxjs-async-map.svg)](https://greenkeeper.io/)

## Installation

`rxjs-async-map` is available via npm or yarn:

```
npm i --save rxjs-async-map
```

```
yarn add rxjs-async-map
```

## Usage

```js
import { of } from 'rxjs/observable/of';
import { asyncMap } from 'rxjs-async-map';

const myPromise = val =>
  new Promise(resolve => setTimeout(() => resolve(`Result: ${val}`), Math.random() * 1000));

const source = of(1, 2, 3);

// Map over the observable using the async function, while running
// up to two promises concurrently.
//
// The order of elements is preserved, even if the promises resolve
// out-of-order.
const example = source.pipe(asyncMap(myPromise, /* concurrency: */ 2));

/*
  output:
  "Result: 1"
  "Result: 2"
  "Result: 3"
*/
const subscribe = example.subscribe(val => console.log(val));
```

## License

MIT
