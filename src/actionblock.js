var Q = require('q');

/**
 * Provides a dataflow block that invokes a provided action for every data element posted.
 *
 * @param action
 * @constructor
 */
function ActionBlock(action) {
    var _this = this;

    this.action = action;
    this._tasks = [];

    Object.defineProperty(this, 'completion', {
        get: function () {
            return Q.all(_this._tasks);
        }
    });
}

/**
 * Posts a data element to this dataflow block.
 */
ActionBlock.prototype.post = function () {
    var _this = this;

    var task = Q.fapply(this.action, arguments);
    this._tasks.push(task);

    task.finally(function () {
        _this._tasks.splice(_this._tasks.indexOf(task), 1);
    });
};

module.exports = ActionBlock;