let path = require('path');
let File = require('./File');

class HotReloading {
    /**
     *
     * @param {import('./Pod')} pod
     */
    constructor(pod) {
        this.pod = pod;
    }

    record() {
        this.clean();

        if (!this.pod.config.hmr) {
            return;
        }

        const { https, host, port } = this.pod.config.hmrOptions;
        const protocol = https ? 'https' : 'http';
        const url = `${protocol}://${host}:${port}`;

        this.hotFile().write(url);

        process.on('exit', () => this.clean());
        process.on('SIGINT', () => this.clean());
        process.on('SIGHUP', () => this.clean());
    }

    hotFile() {
        return new File(path.join(this.pod.config.publicPath, 'hot'));
    }

    /** @deprecated */
    http() {
        return this.pod.config.hmrOptions.https ? 'https' : 'http';
    }

    /** @deprecated */
    port() {
        return this.pod.config.hmrOptions.port;
    }

    clean() {
        this.hotFile().delete();
    }

    /** @deprecated */
    static record() {
        return new HotReloading(global.Pod).record();
    }

    /** @deprecated */
    static hotFile() {
        return new HotReloading(global.Pod).hotFile();
    }

    /** @deprecated */
    static http() {
        return new HotReloading(global.Pod).http();
    }

    /** @deprecated */
    static port() {
        return new HotReloading(global.Pod).port();
    }

    /** @deprecated */
    static clean() {
        return new HotReloading(global.Pod).clean();
    }
}

module.exports = HotReloading;
