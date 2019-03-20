const wait = (time) =>  new Promise(done => setTimeout(done, time));
module.exports.wait = wait;


const chalk = require('chalk');
const logMasterSend = (action, from) => console.log(chalk`{bold.green Master:} sending {bold.blue ${action}} action to {bold.yellow ${from}}`);
const logMasterReceive = (action, from) => console.log(chalk`{bold.green Master:} received {bold.blue ${action}} action from {bold.yellow ${from}}`);
const logMasterMsg = (msg) => console.log(chalk`{bold.green Master:} ${msg}`);
const logTripBuilderWorkerSend = (action) => console.log(chalk`{bold.yellow TripBuilderWorker:} sending {bold.blue ${action}} action to {bold.green Master}`);
const logTripBuilderWorkerReceive = (action) => console.log(chalk`{bold.yellow TripBuilderWorker:} received {bold.blue ${action}} action from {bold.green Master}`);
const logTripBuilderWorkerMsg = (msg) => console.log(chalk`{bold.yellow TripBuilderWorker:} ${msg}`);
module.exports.logMasterSend = logMasterSend;
module.exports.logMasterReceive = logMasterReceive;
module.exports.logMasterMsg = logMasterMsg;
module.exports.logTripBuilderWorkerSend = logTripBuilderWorkerSend;
module.exports.logTripBuilderWorkerReceive = logTripBuilderWorkerReceive;
module.exports.logTripBuilderWorkerMsg = logTripBuilderWorkerMsg;

