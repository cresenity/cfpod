let assert = require('assert');
let File = require('./File');

class Assert {
    /**
     * Assert that the call the pod.js() is valid.
     *
     * @param {any} entry
     * @param {any} output
     */
    static js(entry, output) {
        assert(
            typeof entry === 'string' || Array.isArray(entry),
            'pod.js() is missing required parameter 1: entry'
        );

        assert(
            typeof output === 'string',
            'pod.js() is missing required parameter 2: output'
        );
    }

    /**
     * Assert that the calls to pod.sass() and pod.less() are valid.
     *
     * @param {string} type
     * @param {string} src
     * @param {string} output
     */
    static preprocessor(type, src, output) {
        assert(
            typeof src === 'string',
            `pod.${type}() is missing required parameter 1: src`
        );

        assert(
            typeof output === 'string',
            `pod.${type}() is missing required parameter 2: output`
        );
    }

    /**
     * Assert that calls to pod.combine() are valid.
     *
     * @param {string|string[]} src
     * @param {File}   output
     */
    static combine(src, output) {
        assert(
            typeof src === 'string' || Array.isArray(src),
            `pod.combine() requires a valid src string or array.`
        );

        assert(
            output.isFile(),
            'pod.combine() requires a full output file path as the second argument. Got ' +
                output.path()
        );
    }

    /**
     * Assert that the given file exists.
     *
     * @param {string} file
     */
    static exists(file) {
        assert(
            File.exists(file),
            `Whoops, you are trying to compile ${file}, but that file does not exist.`
        );
    }
}

module.exports = Assert;
