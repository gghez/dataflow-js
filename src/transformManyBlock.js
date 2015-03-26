var Q = require('q');

function TransformManyBlock(action) {
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
TransformManyBlock.prototype.post = function () {
    var _this = this;

    var task = Q.fapply(this.action, arguments).then(function (output) {
        return Q.all(_this._linkToBlocks.map(function (block) {
            return Q.all(output.map(function (outputItem) {
                block.post(outputItem);
                return block.completion;
            }));
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
TransformManyBlock.prototype.linkTo = function (block) {
    this._linkToBlocks.push(block);
};


module.exports = TransformManyBlock;