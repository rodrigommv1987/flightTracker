// index.js
const cron = require("node-cron");

cron.schedule("1 * * * * *", function () {
    console.log(new Date());
});

