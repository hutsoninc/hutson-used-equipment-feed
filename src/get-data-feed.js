const Json2csvParser = require('json2csv').Parser;

const fields = [
    'ID',
    'ID2',
    'Item title',
    'Final URL',
    'Image URL',
    'Item subtitle',
    'Item description',
    'Item category',
    'Price',
    'Sale price',
    'Contextual keywords',
    'Item address',
    'Tracking template',
    'Custom parameter',
    'Final mobile URL'
];

const hutsonStores = [
    { store: "Mayfield, KY", ag: "034320", cce: "034321", address: "1201 Fulton Road, Mayfield, KY 42066" },
    { store: "Princeton, KY", ag: "034787", cce: "034788", address: "1117 Hopkinsville Street, Princeton, KY 42445" },
    { store: "Russellville, KY", ag: "039630", cce: "039631", address: "250 Shelton Lane, Russellville, KY 42276" },
    { store: "Morganfield, KY", ag: "039604", cce: "039605", address: "1540 State Route 130, Morganfield, KY 42437" },
    { store: "Clarksville, TN", ag: "039678", cce: "039674", address: "411 Alfred Thun Road, Clarksville, TN 37040" },
    { store: "Clinton, KY", ag: "037899", cce: "037813", address: "188 US-51, Clinton, KY 42031" },
    { store: "Cypress, IL", ag: "035759", cce: "035065", address: "5485 State Route 37, Cypress, IL 62923" },
    { store: "Paducah, KY", ag: "033014", cce: "035800", address: "3690 James Sanders Boulevard, Paducah, KY 42001" },
    { store: "Hopkinsville, KY", ag: "039189", cce: "039185", address: "2804 Pembroke Road, Hopkinsville, KY 42240" },
    { store: "Jasper, IN", ag: "039988", cce: "039985", address: "2951 North 600 West, Jasper, IN 47546" },
    { store: "Evansville, IN", ag: "039979", cce: "039977", address: "10300 Telephone Road, Evansville, IN 47610" },
    { store: "Poseyville, IN", ag: "039983", cce: "039981", address: "60 Frontage Road, Poseyville, IN 47633" },
    { store: "Newberry, IN", ag: "039975", cce: "039972", address: "7362 South, IN-57, Newberry, IN 47529" }
];

module.exports = function getDataFeed(data) {

    const json2csvParser = new Json2csvParser({ fields });

    let output = [];

    data.forEach(machine => {

        let obj = {
            'ID': '',
            'ID2': '',
            'Item title': '',
            'Final URL': '',
            'Image URL': '',
            'Item subtitle': '',
            'Item description': '',
            'Item category': '',
            'Price': '',
            'Sale price': '',
            'Contextual keywords': '',
            'Item address': '',
            'Tracking template': '',
            'Custom parameter': '',
            'Final mobile URL': ''
        };

        // Skip equipment with placeholder images
        if (machine.images && machine.images.length > 1) {
            obj['Image URL'] = machine.images[1];
        } else {
            return;
        }

        obj['ID'] = machine.id;

        obj['Final URL'] = `https://www.hutsoninc.com/used-equipment/${machine.id}/`;
        obj['Tracking template'] = `${obj['Final URL']}?utm_source=Google&utm_medium=Dynamic%20Ad`;

        obj['Contextual keywords'] = ['used', 'equipment', 'for sale'];

        obj['Item title'] = ['Used'];
        if (machine.modelYear) {
            obj['Item title'].push(machine.modelYear);
        }
        if (machine.manufacturer && machine.manufacturer != 'Other') {
            obj['Item title'].push(machine.manufacturer);
            obj['Contextual keywords'].push(machine.manufacturer);
        }
        obj['Item title'].push(machine.model);
        obj['Item title'] = obj['Item title'].join(' ');

        obj['Item subtitle'] = 'for sale at Hutson';
        if (machine.dealerId) {
            let storeObj = hutsonStores.find(obj => { return obj.ag == machine.dealerId || obj.cce == machine.dealerId });
            if (storeObj) {
                obj['Item subtitle'] += ` in ${storeObj.store}`;
                obj['Item address'] = storeObj.address;
            }
        }

        obj['Item category'] = machine.category;

        obj['Price'] = `${machine.advertised_price.toLocaleString('en-US')} USD`;

        obj['Contextual keywords'] = obj['Contextual keywords'].join(';').toLowerCase();

        output.push(obj);
    });

    const csv = json2csvParser.parse(output);

    return csv

}