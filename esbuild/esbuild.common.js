const fs = require('fs-extra');
const path = require('path');
const { version } = require('../package.json');

const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
const SRC_DIR = path.resolve(__dirname, '../src');

function esbuild_config(BUILD_DIR, IS_PRODUCTION) {
    return {
        entryPoints: [path.join(SRC_DIR, '/index.tsx')],
        entryNames: '[dir]/[name]-[hash]',
        chunkNames: 'chunks/[name]-[hash]',
        metafile: true,
        bundle: true,
        logLevel: 'error',
        outdir: BUILD_DIR,

        external: ['crypto', 'stream'],

        define: {
            global: 'window',
            PRODUCTION: JSON.stringify(!!IS_PRODUCTION),
            process: JSON.stringify({
                env: {
                    npm_package_version: version,
                    // NODE_ENV: IS_PRODUCTION ? 'production' : 'development',
                },
            }),
        },

        loader: {
            '.png': 'file',
            '.jpg': 'file',
            '.gif': 'file',
            '.eot': 'file',
            '.woff': 'file',
            '.woff2': 'file',
            '.ttf': 'file',
            '.svg': 'file',
        },

        plugins: [
            {
                name: 'alias_images_fonts',
                setup(build) {
                    build.onResolve({ filter: /\/images.*/ }, (args) => ({
                        path: path.resolve(args.path.replace(/.*\/images/, path.join(SRC_DIR, 'images'))),
                    }));
                },
            },
            {
                name: 'fixSVG',
                setup(build) {
                    const svgLoadedFromJS = {};
                    build.onResolve({ filter: /\.svg$/ }, (args) => {
                        if (args.kind === 'require-call') {
                            svgLoadedFromJS[path.resolve(args.resolveDir + '/' + args.path)] = true;
                        }
                    });
                    build.onLoad({ filter: /\.svg$/ }, (args) => {
                        return {
                            contents: fs.readFileSync(args.path, { encoding: 'utf-8' }),
                            loader: svgLoadedFromJS[path.resolve(args.path)] ? 'text' : 'file',
                        };
                    });
                },
            },
            {
                name: 'copy_htdocs',
                setup(build) {
                    build.onEnd((buildResult) => {
                        if (buildResult.errors.length > 0) return;
                        if (fs.existsSync(path.join(SRC_DIR, 'htdocs'))) {
                            copyDirectory(path.join(SRC_DIR, 'htdocs'), BUILD_DIR);
                        }
                    });
                },
            },
            {
                name: 'copy_images',
                setup(build) {
                    build.onEnd((buildResult) => {
                        if (buildResult.errors.length > 0) return;
                        if (fs.existsSync(path.join(SRC_DIR, 'images'))) {
                            fs.copySync(path.join(SRC_DIR, 'images'), path.join(BUILD_DIR, 'images'));
                        }
                    });
                },
            },
            {
                name: 'fix_index.html',
                setup(build) {
                    build.onEnd((buildResult) => {
                        if (buildResult.errors.length > 0) return;

                        const outFiles_JS_CSS = Object.keys(buildResult.metafile.outputs).filter((filePath) => ['.js', '.css'].includes(path.extname(filePath)));
                        const indexPath = path.join(BUILD_DIR, 'index.html');
                        if (!fs.existsSync(indexPath)) return;

                        let indexHTML = fs.readFileSync(indexPath, { encoding: 'utf-8' });

                        outFiles_JS_CSS.forEach((outFile) => {
                            const fileName = path.basename(outFile);
                            const shortFileName = fileName.replace(/\-\w+\./, '.');

                            while (indexHTML.includes(shortFileName)) indexHTML = indexHTML.replace(shortFileName, fileName);
                        });

                        indexHTML = indexHTML.replace('<!-- version -->', version);

                        fs.writeFileSync(indexPath, indexHTML);
                    });
                },
            },
        ],
    };
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;
    const files = fs.readdirSync(src);

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

module.exports = {
    esbuild_config,
};