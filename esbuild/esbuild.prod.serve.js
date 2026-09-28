const path = require('path');
const { spawn, exec } = require('child_process');

const BUILD_DIR = path.resolve(__dirname, '../dist');
const URL = 'https://local.admiralcloud.com:5000';

spawn('npx', [
    'serve',
    '-l', '5000',
    '-s',
    '--ssl-cert', path.resolve(__dirname, 'https_local_cert.pem'),
    '--ssl-key', path.resolve(__dirname, 'https_local_key.pem'),
    BUILD_DIR,
], { stdio: 'inherit' });

setTimeout(() => openBrowser(URL), 1000);

function openBrowser(url) {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${cmd} ${url}`);
}
