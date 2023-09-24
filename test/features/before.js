import test from 'ava';
import sinon from 'sinon';

import { context } from '../helpers/test.js';

test('it waits for all before/init hooks to complete', async t => {
    const { mix, Pod } = context(t);

    const spy = sinon.spy();

    mix.before(async () => {
        spy();
        await new Promise(resolve => setTimeout(resolve, 100));
        spy();
    });

    t.false(spy.called);

    await Pod.init();

    t.true(spy.called);
    t.is(spy.callCount, 2);
});

test('a throwing before hook stops the build', async t => {
    const { mix, Pod } = context(t);

    mix.before(async () => {
        throw new Error('error 123');
    });

    await t.throwsAsync(
        async () => {
            await Pod.init();
        },
        { message: 'error 123' }
    );
});
