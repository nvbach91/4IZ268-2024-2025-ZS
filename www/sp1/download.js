const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

const urls = fs.readFileSync('./links.txt', 'utf-8').split(/[\r\n]+/);

(async () => {
    for (const url of urls) {
        try {
            const resp = await axios.get(url);
            const parts = url.split('/');
            const xname = parts[3].replace('~', '');
            const file = parts.slice(5).join('/');
            const filePath = `./${xname}/${file.includes('.') ? file : `${file}/index.html`}`;
            // console.log(filePath);
            ensureDirectoryExistence(filePath);
            fs.writeFileSync(filePath, resp.data);
        } catch (err) {
            console.log(url, err.message);
        }
    }
})();