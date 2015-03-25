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
            assert.isTrue(spy.calledTwice, 'linked block not called 2x.');
            assert.isTrue(spy.calledWith(1), 'linked block not called with posted 1');
            assert.isTrue(spy.calledWith(2), 'linked block not called with posted 2');
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
            assert.isTrue(spy.calledThrice, 'linked block not called 3x.');
            assert.isTrue(spy.calledWith(1), 'linked block not called with posted 1');
            assert.isTrue(spy.calledWith(2), 'linked block not called with posted 2');
            assert.isTrue(spy.calledWith(3), 'linked block not called with posted 3');
        });
    });
});