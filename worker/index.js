var CronJob = require('cron').CronJob;

const fetchGithub = require('./tasks/fetch-github.js')

//fetch github jobs
var job = new CronJob('* * * * *', fetchGithub, null, true, 'America/Los_Angeles');


// we can fetch indeed, stackoverflow here
// create cron jobs for every fetch 