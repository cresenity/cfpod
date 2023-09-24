import test from 'ava';

import { context } from '../helpers/test.js';

test('mix.options()', t => {
    const { mix, Pod } = context(t);

    mix.options({
        foo: 'bar'
    });

    t.is('bar', Pod.config.foo);
});
