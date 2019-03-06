const wait = (time) =>  new Promise(done => setTimeout(done, time));

module.exports.wait = wait;