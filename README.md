dataflow-js
========

DataFlow JS provides an actor-based programming model that supports in-process message passing for coarse-grained dataflow and pipelining tasks.

[![Build Status](https://travis-ci.org/gghez/dataflow-js.svg?branch=master)](https://travis-ci.org/gghez/dataflow-js)
[![NPM version](https://badge.fury.io/js/dataflow-js.png)](http://badge.fury.io/js/dataflow-js)

## Installation

Using npm package manager for nodejs module:

```
npm install --save dataflow-js
```


## API

### ActionBlock

ActionBlock class provides a dataflow block that invokes a provided action for every data element posted.

```js
var ActionBlock = require('dataflow-js').ActionBlock;

var addToBasket = new ActionBlock(function(product, price, quantity) {
    console.log('Adding product', product);
    // ...
});

addToBasket.post('Shoes', 49, 2);
addToBasket.post('Pants', 19, 3);

```

#### Methods

- `post()` Posts a data element to this dataflow block.

#### Properties

- `completion` [q](https://github.com/kriskowal/q) promise for all running actions started by `post()` calls.

### BatchBlock

BatchBlock class provides a dataflow block that batches inputs into arrays.

```js
var BatchBlock = require('dataflow-js').BatchBlock;
var ActionBlock = require('dataflow-js').ActionBlock;

var batchedAddToBasket = new BatchBlock(3);

var addToBasket = new ActionBlock(function(products) {
    // products == [ ['Shoes', 49, 2], ['Pants', 19, 3], ['Trousers', 29, 1] ]
});

batchedAddToBasket.linkTo(addToBasket);

batchedAddToBasket.post('Shoes', 49, 2);
batchedAddToBasket.post('Pants', 19, 3);
// No relay to addToBasket post() yet
batchedAddToBasket.post('Trousers', 29, 1);
// Batch size reached, the 3 post() commands are relayed to addToBasket

```

#### Methods

- `post()` Posts a data element to this dataflow block.
- `trigger()` Transfer pending `post()` call to next blocks even if batch size is not reached.
- `linkTo()` Link current block output to another block input.

#### Properties

- `completion` [q](https://github.com/kriskowal/q) promise for all running actions started by `post()` calls.

### TransformBlock

TransformBlock provides a dataflow block that invokes a provided transformation function for every data element received.

```js
var block = new TransformBlock(function (input) {
    return input * 10;
});

block.linkTo(new ActionBlock(function(input) {
    console.log(input);
}));

block.post(5);
block.post(1);
block.post(3);

// Output:
// 50
// 10
// 30
```

#### Methods

- `post()` Posts a data element to this dataflow block.
- `linkTo()` Link current block output to another block input.

#### Properties

- `completion` [q](https://github.com/kriskowal/q) promise for all running actions started by `post()` calls.

### TransformManyBlock

TransformManyBlock provides a dataflow block that invokes a provided transformation function for every data element received.
Output linked blocks will receive on their input each element from output enumerable.

```js
var block = new TransformManyBlock(function (input) {
    return [input, input * 2, input * 4, input * 8];
});

block.linkTo(new ActionBlock(function(input) {
    console.log(input);
}));

block.post(5);
block.post(1);
block.post(3);

// output:
// 5
// 10
// 20
// 40
// 1
// 2
// ...
```

#### Methods

- `post()` Posts a data element to this dataflow block.
- `linkTo()` Link current block output to another block input.

#### Properties

- `completion` [q](https://github.com/kriskowal/q) promise for all running actions started by `post()` calls.
