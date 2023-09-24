/**
 *
 * @param {import("../Pod")} pod
 * @returns {import("webpack").RuleSetRule[]}
 */
module.exports = function (pod) {
    // TODO: Remove in Pod 7 -- Here for backwards compat if a plugin requires this file
    pod = pod || global.Pod;

    return Array.from(buildRules(pod));
};

/**
 * @param {string} filename
 */
function isFromPackageManager(filename) {
    return /node_modules|bower_components/.test(filename);
}

/**
 * @param {string} filename
 * @param {string[]} dirs
 */
function normalizedPackageFilename(filename, dirs) {
    const WINDOWS_PATH_SEPARATORS = /\\/g;

    const patternTemplate = /((.*(node_modules|bower_components))|__DIRS__)\//g;
    const vendoredPath = new RegExp(
        patternTemplate.source.replace('__DIRS__', dirs.join('|')),
        'g'
    );

    return filename.replace(WINDOWS_PATH_SEPARATORS, '/').replace(vendoredPath, '');
}

/**
 *
 * @param {import("../Pod")} pod
 * @returns {Iterable<import("webpack").RuleSetRule>}
 */
function* buildRules(pod) {
    /**
     * @param {object} param0
     * @param {boolean} [param0.when]
     * @param {RegExp} param0.test
     * @param {(data: *, meta: { dirs: Record<string, string>}) => string} param0.name
     * @param {import("webpack").RuleSetUseItem[]} [param0.loaders]
     * @returns {import("webpack").RuleSetRule[]}
     **/
    function asset({ when = true, test, name, loaders = [] }) {
        if (!when) {
            return [];
        }

        if (pod.config.assetModules) {
            return [
                {
                    test,
                    type: 'asset/resource',
                    generator: {
                        /**
                         *
                         * @param {any} pathData
                         * @returns
                         */
                        filename: pathData =>
                            name(pathData, { dirs: pod.config.assetDirs }),
                        publicPath: pod.config.resourceRoot
                    },
                    use: loaders
                }
            ];
        }

        return [
            {
                test,
                use: [
                    {
                        loader: pod.resolve('file-loader'),
                        options: {
                            // we're somewhat mimic-ing the asset module API here to simply name resolution further down
                            /**
                             *
                             * @param {string} path
                             */
                            name: path =>
                                name(
                                    { filename: path },
                                    {
                                        dirs:
                                            pod.config.fileLoaderDirs ||
                                            pod.config.assetDirs
                                    }
                                ).replace('[ext]', '.[ext]'),
                            publicPath: pod.config.resourceRoot
                        }
                    },
                    ...loaders
                ]
            }
        ];
    }

    // Add support for loading HTML files.
    yield {
        test: /\.html$/,
        resourceQuery: { not: [/\?vue/i] },
        use: [{ loader: pod.resolve('html-loader') }]
    };

    // Add support for loading images.
    yield* asset({
        when: !!pod.config.imgLoaderOptions,

        // only include svg that doesn't have font in the path or file name by using negative lookahead
        test: /(\.(png|jpe?g|gif|webp|avif)$|^((?!font).)*\.svg$)/,

        loaders: [
            {
                loader: pod.resolve('img-loader'),
                options: pod.config.imgLoaderOptions || {}
            }
        ],

        name: ({ filename }, { dirs }) => {
            if (isFromPackageManager(filename)) {
                filename = normalizedPackageFilename(filename, [
                    'images',
                    'image',
                    'img',
                    'assets'
                ]);

                return `${dirs.images}/vendor/${filename}?[hash]`;
            }

            return `${dirs.images}/[name][ext]?[hash]`;
        }
    });

    // Add support for loading fonts.
    yield* asset({
        test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
        name: ({ filename }, { dirs }) => {
            if (isFromPackageManager(filename)) {
                filename = normalizedPackageFilename(filename, [
                    'fonts',
                    'font',
                    'assets'
                ]);

                return `${dirs.fonts}/vendor/${filename}?[hash]`;
            }

            return `${dirs.fonts}/[name][ext]?[hash]`;
        }
    });

    // Add support for loading cursor files.
    yield* asset({
        test: /\.(cur|ani)$/,
        name: () => '[name][ext]?[hash]'
    });
}
