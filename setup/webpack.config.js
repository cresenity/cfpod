const { assertSupportedNodeVersion } = require('../src/Engine');

module.exports = async () => {
    // @ts-ignore
    process.noDeprecation = true;

    assertSupportedNodeVersion();

    const pod = require('../src/Pod').primary;

    require(pod.paths.mix());

    await pod.installDependencies();
    await pod.init();

    return pod.build();
};
