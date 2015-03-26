describe('TransformBlock unit tests', function () {

    it('Transform posted data to linked block input.', function () {

        var block = new TransformBlock(function (input) {
            return input * 10;
        });

        var spy = sinon.spy();
        block.linkTo(new ActionBlock(spy));

        block.post(5);
        block.post(1);
        block.post(3);

        return block.completion.then(function () {
            assert.equal(spy.args.length, 3);

            assert.equal(spy.args[0], 50);
            assert.equal(spy.args[1], 10);
            assert.equal(spy.args[2], 30);
        });

    });
});