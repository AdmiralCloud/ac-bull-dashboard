const liveServer = require('live-server');
const path = require('path');
const fs = require('fs');

(async () => {
    const { default: open } = await import('open');

    liveServer.start({
        port: 5000, // Set the server port. Defaults to 8080.
        host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: path.resolve(__dirname + '/../dist'), // Set root directory that's being served. Defaults to cwd.
        watch: [],
        open: false, // When false, it won't load your browser by default.
        // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
        // mount: [['/components', './node_modules']], // Mount a directory to a route.
        logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
        middleware: [
            function(req, res, next) {
                if (req.url.endsWith('.js.gz')) {
                    res.setHeader('content-encoding', 'gzip');
                    res.setHeader('content-type', 'application/javascript');
                }
                if (req.url.endsWith('.css.gz')) {
                    res.setHeader('content-encoding', 'gzip');
                    res.setHeader('content-type', 'text/css');
                }
                next();
            },
        ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
        https: {
            cert: fs.readFileSync(path.resolve(__dirname + '/https_local_cert.pem')),
            key: fs.readFileSync(path.resolve(__dirname + '/https_local_key.pem')),
        },
    });

    open('https://local.admiralcloud.com:5000');
})();