describe('TransformManyBlock unit tests', function () {

    it('Transform posted data to linked block input.', function () {

        var block = new TransformManyBlock(function (input) {
            return [input, input * 2, input * 4, input * 8];
        });

        var spy = sinon.spy();
        block.linkTo(new ActionBlock(spy));

        block.post(5);
        block.post(1);
        block.post(3);

        return block.completion.then(function () {
            assert.equal(spy.args.length, 12);

            assert.equal(spy.args[0], 5);
            assert.equal(spy.args[1], 10);
            assert.equal(spy.args[2], 20);
            assert.equal(spy.args[3], 40);

            assert.equal(spy.args[4], 1);
            assert.equal(spy.args[5], 2);
            assert.equal(spy.args[6], 4);
            assert.equal(spy.args[7], 8);

            assert.equal(spy.args[8], 3);
            assert.equal(spy.args[9], 6);
            assert.equal(spy.args[10], 12);
            assert.equal(spy.args[11], 24);
        });

    });
});