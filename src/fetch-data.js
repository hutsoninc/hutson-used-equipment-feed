const fetch = require('fetch-retry');
const xml2js = require('xml2js');

function parseString(str) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(str, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        })
    })
}

module.exports = async function fetchData () {
    let data = await fetch(process.env.MFURL, {
        method: 'POST',
        body: `key=${process.env.MFKEY}&password=${process.env.MFPASSWORD}`,
    });
    let text = await data.text();
    let obj = await parseString(text);
    return obj;
}