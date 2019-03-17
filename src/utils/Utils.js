const wait = (time) =>  new Promise(done => setTimeout(done, time));
module.exports.wait = wait;


const chalk = require('chalk');
const logSend = (action, from) => console.log(chalk`{bold.green Master:} sending {bold.blue ${action}} action to {bold.yellow ${from}}`);
const logReceive = (action, from) => console.log(chalk`{bold.green Master:} received {bold.blue ${action}} action from {bold.yellow ${from}}`);
module.exports.logSend = logSend;
module.exports.logReceive = logReceive;

