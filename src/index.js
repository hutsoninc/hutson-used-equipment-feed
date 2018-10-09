require('dotenv').config();
const fetchData = require('./fetch-data');
const formatData = require('./format-data');
const getDataFeed = require('./get-data-feed');
const fs = require('fs');
const path = require('path');

(async function run() {

    console.log('Fetching MachineFinder equipment');
    let data = await fetchData();
    data = data.machines.machine;

    console.log('Formatting MachineFinder equipment data');
    data = await formatData(data);

    console.log('Creating Data Feed CSV');
    let dataFeedCsv = getDataFeed(data);
    fs.writeFile(path.join(__dirname, '/data/used-equipment-feed.csv'), dataFeedCsv, err => {
        if (err) console.log(err);
        console.log('Wrote Data Feed CSV to file');
    });

})();