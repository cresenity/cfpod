class ManifestPlugin {
    /**
     *
     * @param {import("../Pod")} pod
     */
    constructor(pod) {
        // TODO: Simplify in Pod 7 -- Here for backwards compat if a plugin creates this class directly
        this.pod = pod || global.Pod;
    }

    /**
     * Apply the plugin.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.emit.tapAsync('ManifestPlugin', (curCompiler, callback) => {
            let stats = curCompiler.getStats().toJson();

            // Handle the creation of the pod-manifest.json file.
            this.pod.manifest.transform(stats).refresh();

            callback();
        });
    }
}

module.exports = ManifestPlugin;
