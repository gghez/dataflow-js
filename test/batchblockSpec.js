describe('BatchBlock unit test', function () {

    it('Batch is not triggered when batch size not reached', function () {
        var block = new BatchBlock(3);
        var spy = sinon.spy(block, 'trigger');

        block.post(1);
        block.post(2);

        return block.completion.then(function () {
            assert.isTrue(spy.notCalled, 'Batch triggered.');
        });
    });

    it('Batch is triggered when batch size is reached.', function () {
        var block = new BatchBlock(3);
        var spy = sinon.spy(block, 'trigger');

        block.post(1);
        block.post(2);
        block.post(3);

        return block.completion.then(function () {
            assert.isTrue(spy.calledOnce, 'Nothing triggered.');
        });
    });

    it('Manually trigger batch relay to linked blocks.', function () {
        var block = new BatchBlock(3);

        var spy = sinon.spy();
        block.linkTo(new ActionBlock(spy));

        block.post(1);
        block.post(2);

        block.trigger();

        return block.completion.then(function () {
            assert.isTrue(spy.calledOnce, 'linked block not called.');
            assert.deepEqual(spy.args[0], [1, 2]);
        });
    });

    it('Automatically triggered batch relay to linked blocks.', function () {
        var block = new BatchBlock(3);

        var spy = sinon.spy();
        block.linkTo(new ActionBlock(spy));

        block.post(1);
        block.post(2);
        block.post(3);

        return block.completion.then(function () {
            assert.isTrue(spy.calledOnce, 'linked block not called.');
            assert.deepEqual(spy.args[0], [1, 2, 3]);
        });
    });
});