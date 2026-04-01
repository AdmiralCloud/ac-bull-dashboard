const { esbuild_config } = require('./esbuild.common');
const path = require('path');
const esbuild = require('esbuild');

const BUILD_DIR = path.resolve(__dirname, '../dist');

(async () => {
    try {
        const cfg = esbuild_config(BUILD_DIR, true);
        cfg.minifyIdentifiers = true;
        cfg.minify = true;
        cfg.splitting = true;
        cfg.format = 'esm';
        cfg.target = ['chrome100', 'edge100', 'safari16', 'firefox100'];

        console.log('*** esbuild ***');
        await esbuild.build(cfg);
    } catch (e) {}
})();
