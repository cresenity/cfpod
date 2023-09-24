import test from 'ava';
import path from 'path';

import { context } from '../helpers/test.js';

test('mix.setPublicPath()', t => {
    const { mix, Pod } = context(t);

    mix.setPublicPath('somewhere/else');

    t.is(path.normalize('somewhere/else'), Pod.config.publicPath);

    // It will also trim any closing slashes.
    mix.setPublicPath('somewhere/else/');

    t.is(path.normalize('somewhere/else'), Pod.config.publicPath);
});
