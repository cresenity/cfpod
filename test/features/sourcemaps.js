import test from 'ava';

import { context } from '../helpers/test.js';

test('mix.sourceMaps()', t => {
    const { mix, Pod } = context(t);

    t.false(Pod.config.sourcemaps);

    mix.sourceMaps();

    // Sourcemaps should use a sensible type as the default for dev.
    t.is('eval-source-map', Pod.config.sourcemaps);

    // For production builds, we should use a more performant type.
    Pod.config.production = true;
    mix.sourceMaps();
    t.is('source-map', Pod.config.sourcemaps);

    // But if the user specifies that sourcemaps shouldn't be built for
    // production, then we should disable it.
    mix.sourceMaps(false);
    t.false(Pod.config.sourcemaps);

    // Finally, you can override the sourcemap type for production mode.
    mix.sourceMaps(true, 'eval-source-map', 'hidden-source-map');
    t.is('hidden-source-map', Pod.config.sourcemaps);
});

test.serial('it works fine with cache busting chunk filenames', async t => {
    const { mix, Pod, assert, webpack } = context(t);

    Pod.config.production = true;
    mix.js(`test/fixtures/app/src/js/chunk.js`, 'js')
        .webpackConfig({
            output: {
                chunkFilename: '[name].js?v=[chunkhash]'
            }
        })
        .version()
        .sourceMaps();

    await t.notThrowsAsync(() => webpack.compile());
    assert().file(`test/fixtures/app/dist/js/chunk.js.map`).exists();
});
