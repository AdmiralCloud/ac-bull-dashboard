const { esbuild_config } = require('./esbuild.common');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const { spawn, exec } = require('child_process');

const BUILD_DIR = path.resolve(__dirname, '../dist-dev');
const URL = 'https://local.admiralcloud.com:5000';

(async () => {
    try {
        if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR);
        fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), '<html><head><title>...</title></head><body><h1>👷 Building...</h1></body></html>');

        startServer();

        const cfg = esbuild_config(BUILD_DIR);
        cfg.sourcemap = true;

        const ctx = await esbuild.context({
            ...cfg,
            plugins: [
                ...cfg.plugins,
                {
                    name: 'refresh_JE',
                    setup(build) {
                        build.onStart(() => {
                            console.time('BUILD');
                        });
                        build.onEnd((buildResult) => {
                            console.timeEnd('BUILD');
                            if (buildResult.errors.length > 0) {
                                fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), '<html><head><title>ERROR</title></head><body><h1>❗ERROR❗</h1><p>Look at the console output</p></body></html>');
                            }
                        });
                    },
                }
            ]
        });

        await ctx.watch();

        setTimeout(() => openBrowser(URL), 1000);
    } catch (e) {
        console.error(e);
    }
})();

function startServer() {
    spawn('npx', [
        'serve',
        '-l', '5000',
        '-s',
        '--ssl-cert', path.resolve(__dirname, 'https_local_cert.pem'),
        '--ssl-key', path.resolve(__dirname, 'https_local_key.pem'),
        BUILD_DIR,
    ], { stdio: 'inherit' });
}

function openBrowser(url) {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${cmd} ${url}`);
}
