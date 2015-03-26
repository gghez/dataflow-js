var Q = require('q');

/**
 * Provides a dataflow block that batches inputs into arrays.
 *
 * @param size Batch size.
 * @constructor
 */
function BatchBlock(size) {
    var _this = this;

    this.size = size;
    this._buffer = [];
    this._linkToBlocks = [];

    Object.defineProperty(this, 'completion', {
        get: function () {
            return Q.all(_this._linkToBlocks.map(function (block) {
                return block.completion;
            }));
        }
    });
}

/**
 * Triggers the batch block to initiate a batching operation even if the number
 * of currently queued or postponed items is less than the batch size.
 *
 */
BatchBlock.prototype.trigger = function () {
    var _this = this;

    this._linkToBlocks.forEach(function (block) {
        block.post.apply(block, _this._buffer);
    });

    this._buffer.length = 0;
};

/**
 * Posts a data element to this dataflow block.
 */
BatchBlock.prototype.post = function () {
    var input = arguments.length == 1 ? arguments[0] : Array.prototype.slice.apply(arguments);
    this._buffer.push(input);

    if (this._buffer.length >= this.size) {
        this.trigger();
    }
};

/**
 * Links this block output to a target block input.
 *
 * @param block Target block.
 */
BatchBlock.prototype.linkTo = function (block) {
    this._linkToBlocks.push(block);
};

module.exports = BatchBlock;
