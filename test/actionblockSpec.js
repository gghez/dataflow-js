describe('ActionBlock unit test', function () {
    it('Post calls are executed asynchronously', function (done) {
        var spy = sinon.spy();

        var block = new ActionBlock(function (timeout) {
            setTimeout(function () {
                spy(timeout);
            }, timeout);
        });

        block.post(50);
        block.post(10);

        setTimeout(function () {
            assert.isTrue(spy.calledTwice, 'spy not called twice.');
            assert.equal(spy.args[0][0], 10);
            assert.equal(spy.args[1][0], 50);

            done();
        }, 60);
    });

    it('Use completion property to wait for all posted data executed.', function () {
        var spy = sinon.spy();

        var block = new ActionBlock(spy);

        block.post('a message');
        block.post('another message');

        return block.completion.then(function () {
            assert.isTrue(spy.calledTwice, 'spy not called twice.');
            assert.isTrue(spy.calledWith('a message'), 'spy not called with "a message"');
            assert.isTrue(spy.calledWith('another message'), 'spy not called with "another message"');
        });

    });
});