let Log = require('../Log');
let collect = require('collect.js');

class CustomTasksPlugin {
    /**
     *
     * @param {import('../Pod')} pod
     */
    constructor(pod) {
        this.pod = pod || global.Pod;
    }

    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tapPromise(this.constructor.name, async stats => {
            await this.runTasks(stats);

            if (this.pod.components.get('version') && !this.pod.isUsing('hmr')) {
                this.applyVersioning();
            }

            if (this.pod.inProduction()) {
                await this.minifyAssets();
            }

            if (this.pod.isWatching()) {
                this.pod.tasks.forEach(task => task.watch(this.pod.isPolling()));
            }

            this.pod.manifest.refresh();
        });
    }

    /**
     * Add asset to the webpack stats.
     *
     * @param {import("../File")} asset
     * @param {import("webpack").Stats} stats
     */
    async addAsset(asset, stats) {
        // Skip adding directories to the manifest
        // TODO: We should probably add the directory but skip hashing
        if (asset.isDirectory()) {
            return;
        }

        const path = asset.pathFromPublic();

        // Add the asset to the manifest
        this.pod.manifest.add(path);

        // Update the Webpack assets list for better terminal output.
        stats.compilation.assets[path] = {
            size: () => asset.size(),
            emitted: true
        };
    }

    /**
     * Execute potentially asynchronous tasks sequentially.
     *
     * @param stats
     */
    async runTasks(stats) {
        let assets = [];

        for (const task of this.pod.tasks) {
            await Promise.resolve(task.run());

            assets.push(...task.assets);
        }

        await Promise.allSettled(assets.map(asset => this.addAsset(asset, stats)));
    }

    /**
     * Minify the given asset file.
     */
    async minifyAssets() {
        const assets = collect(this.pod.tasks)
            .where('constructor.name', '!==', 'VersionFilesTask')
            .where('constructor.name', '!==', 'CopyFilesTask')
            .flatMap(({ assets }) => assets);

        const tasks = assets.map(async asset => {
            try {
                await asset.minify();
            } catch (e) {
                Log.error(
                    `Whoops! We had trouble minifying "${asset.relativePath()}". ` +
                        `Perhaps you need to use pod.babel() instead?`
                );

                throw e;
            }
        });

        await Promise.allSettled(tasks);
    }

    /**
     * Version all files that are present in the manifest.
     */
    applyVersioning() {
        for (const [key, value] of Object.entries(this.pod.manifest.get())) {
            this.pod.manifest.hash(key);
        }
    }
}

module.exports = CustomTasksPlugin;
