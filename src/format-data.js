const Promise = require('bluebird');

function flattenObj(obj) {
    if (!obj) return;
    for (let i in obj) {
        if (Array.isArray(obj[i]) && obj[i].length === 1) {
            obj[i] = obj[i][0];
        }
    }
    return obj;
}

module.exports = async function formatData(data) {
    return await Promise.all(data.map(async (machine) => {
        if (typeof machine === 'object') {

            // Flatten first layer
            flattenObj(machine)

            // Flatten images
            if (machine.images && machine.images.image && machine.images.image.length) {
                let images = []
                machine.images.image.forEach(img => {
                    if (img.filePointer && img.filePointer.length) {
                        if (img.filePointer[0].indexOf('http:') != -1) {
                            images.push(
                                'https' + img.filePointer[0].slice(4)
                            );
                        } else {
                            images.push(img.filePointer[0]);
                        }
                    }
                })
                machine.images = images;
            } else {
                machine.images = [];
            }

            // Flatten options
            if (machine.options && machine.options.option && machine.options.option.length) {
                let options = [];
                machine.options.option.forEach(obj => {
                    options.push({
                        label: obj.label ? obj.label[0] : '',
                        value: obj.value ? obj.value[0] : ''
                    });
                });
                machine.options = options;
            }

            // Flatten price
            flattenObj(machine.advertised_price);
            if (machine.advertised_price && machine.advertised_price.amount) {
                machine.advertised_price = Number(machine.advertised_price.amount);
            }
            if (machine.wholesale_price && machine.wholesale_price.amount) {
                machine.wholesale_price = Number(machine.advertised_price.amount);
            } else {
                machine.wholesale_price = null;
            }

            // Convert hours to numbers
            if (machine.operationHours) {
                machine.operationHours = Number(machine.operationHours);
            } else {
                machine.operationHours = null;
            }
            if (machine.separatorHours) {
                machine.separatorHours = Number(machine.separatorHours);
            } else {
                machine.separatorHours = null;
            }

            return machine;

        }
    }));
} 
