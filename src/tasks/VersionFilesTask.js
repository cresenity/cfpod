let Task = require('./Task');
let File = require('../File');
let FileCollection = require('../FileCollection');
const { FileGlob } = require('./FileGlob');

/**
 * @extends {Task<{ files: string[] }>}
 */
class VersionFilesTask extends Task {
    /**
     * Run the task.
     */
    async run() {
        const fileGroups = await Promise.all(
            this.data.files.map(async filepath => {
                const relativePath = new File(filepath).forceFromPublic().relativePath();

                return FileGlob.expand(relativePath);
            })
        );

        const files = fileGroups.flat();

        this.files = new FileCollection(files);
        this.assets = files.map(filepath => {
            const file = new File(filepath);

            this.pod.manifest.hash(file.pathFromPublic());

            return file;
        });
    }

    /**
     * Handle when a relevant source file is changed.
     *
     * @param {string} updatedFile
     */
    onChange(updatedFile) {
        this.pod.manifest.hash(new File(updatedFile).pathFromPublic()).refresh();
    }

    get pod() {
        return global.Pod;
    }
}

module.exports = VersionFilesTask;
