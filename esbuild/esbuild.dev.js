require('log-timestamp');
const { esbuild_config } = require('./esbuild.common');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const BUILD_DIR = path.resolve(__dirname, '../dist-dev');

(async () => {
    try {
        const { default: open } = await import('open');
        if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR);
        fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), '<html><head><title>...</title></head><body><h1>👷 Building...</h1></body></html>');

        let server = makeServer();
        open('https://local.admiralcloud.com:5000');

        const cfg = esbuild_config(BUILD_DIR);
        // cfg.incremental = true; // incremental is deprecated in newer esbuild
        // cfg.watch = true; // watch is handled via context in newer esbuild
        cfg.sourcemap = true;

        const ctx = await esbuild.context({
            ...cfg,
            plugins: [
                ...cfg.plugins,
                {
                    name: 'refresh_JE',
                    setup(build) {
                        build.onStart(() => {
                            fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), '<html><head><title>...</title></head><body><h1>👷 Building...</h1></body></html>');
                            server.refresh();
                            console.time('BUILD');
                        });
                        build.onEnd((buildResult) => {
                            console.timeEnd('BUILD');
                            if (buildResult.errors.length > 0) {
                                fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), '<html><head><title>ERROR</title></head><body><h1>❗ERROR❗</h1><p>Look at the console output</p></body></html>');
                                if (server) setTimeout(() => server.refresh(), 100);
                                return;
                            }
                            if (server) setTimeout(() => server.refresh(), 500);
                        });
                    },
                }
            ]
        });

        await ctx.watch();
    } catch (e) {
        console.error(e);
    }
})();

function makeServer() {
    const liveServer = require('live-server');

    liveServer.start({
        port: 5000, // Set the server port. Defaults to 8080.
        host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: path.resolve(__dirname + '/../dist-dev'), // Set root directory that's being served. Defaults to cwd.
        watch: [],
        open: false, // When false, it won't load your browser by default.
        // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
        // wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
        // mount: [['/components', './node_modules']], // Mount a directory to a route.
        logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
        middleware: [
            function (req, res, next) {
                next();
            },
        ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
        https: {
            cert: fs.readFileSync(path.resolve(__dirname + '/https_local_cert.pem')),
            key: fs.readFileSync(path.resolve(__dirname + '/https_local_key.pem')),
        },
    });

    return {
        refresh() {
            liveServer.watcher.emit('change', 'index.html');
        },
    };
}