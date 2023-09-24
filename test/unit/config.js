import test from 'ava';

import buildConfig from '../../src/config.js';
import Pod from '../../src/Pod.js';

test('that it can merge config', t => {
    let config = buildConfig(new Pod());

    config.merge({
        versioning: true,
        foo: 'bar'
    });

    // @ts-ignore
    t.is('bar', config.foo);

    // @ts-ignore
    t.true(config.versioning);
});
