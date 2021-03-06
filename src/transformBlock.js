var Q = require('q');

function TransformBlock(action) {
    var _this = this;

    this.action = action;
    this._tasks = [];
    this._linkToBlocks = [];

    Object.defineProperty(this, 'completion', {
        get: function () {
            return Q.all(_this._tasks);
        }
    });
}

/**
 * Posts a data element to this dataflow block.
 */
TransformBlock.prototype.post = function () {
    var _this = this;

    var task = Q.fapply(this.action, arguments).then(function (output) {
        return Q.all(_this._linkToBlocks.map(function (block) {
            block.post(output);
            return block.completion;
        }));
    });

    this._tasks.push(task);

    task.finally(function () {
        _this._tasks.splice(_this._tasks.indexOf(task), 1);
    });
};

/**
 * Links this block output to a target block input.
 *
 * @param block Target block.
 */
TransformBlock.prototype.linkTo = function (block) {
    this._linkToBlocks.push(block);
};


module.exports = TransformBlock;