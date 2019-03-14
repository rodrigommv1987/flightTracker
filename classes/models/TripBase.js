const fs = require('fs');

class TripBase {

    constructor(){
        return (async () => {
            await this.loadImplementations();
            return this;
        })();
    }

    loadImplementations() {

        return new Promise((resolve, reject) => {
            fs.readdir(__dirname + '/implementations', (err, files) => {

                this.airlines = new Map();
                for (const file of files) {

                    if (file == 'Vueling.js') break;

                    const implementation = new (require(`${__dirname}/implementations/${file}`));

                    this.airlines.set(implementation.name, {
                        name: implementation.name,
                        implementation: {
                            file,
                            handle: implementation
                        }
                    });
                }

                resolve(this);
            });
        });
    }

    get getImplementations() {
        const imps = [];
        for (const { implementation: { handle } } of this.airlines.values()) {
            imps.push(handle);
        }
        return imps;
    }
}

module.exports = TripBase;