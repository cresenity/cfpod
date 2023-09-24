const { Component } = require('./Component');

module.exports = class Preact extends Component {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['babel-preset-preact'];
    }

    register() {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'pod.preact() is now a feature flag. Use pod.js(source, destination).preact() instead'
            );
        }
    }

    /**
     * Babel config to be merged with Pod's defaults.
     */
    babelConfig() {
        return {
            presets: ['preact']
        };
    }
};
