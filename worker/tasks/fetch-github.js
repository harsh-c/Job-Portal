var fetch = require('node-fetch')

var redis = require('redis'),
    client = redis.createClient();

const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json' 


// this is for fetching jobs on all pages
async function fetchGithub() {
    let resultCount =  1, onPage = 0;
    const allJobs = [];
    while(resultCount > 0) {
        const res = await fetch(`${baseURL}?page=${onPage}`);
        const jobs = await res.json();
        allJobs.push(...jobs);
        resultCount = jobs.length;
        console.log('got', jobs.length, 'jobs');
        onPage++;
        if(jobs.length < 50){
            break;
        }
    }
    console.log('total', allJobs.length, 'jobs');

    // filtering algorithm for junior level software dev jobs
    const jrJobs = allJobs.filter(job => {
        const jobTitle = job.title.toLowerCase();
        let isJunior = true; 

        // main algo logic
        if (
            jobTitle.includes('senior') ||
            jobTitle.includes('manager') ||
            jobTitle.includes('sr.') ||
            jobTitle.includes('architect')
            ){
                return false;
            }
        return true;
    })
    
    console.log('filtered the jobs down to ', jrJobs.length);

    // set in redis
    const success = await setAsync('github', JSON.stringify(jrJobs)); 

    console.log({success});
}

 
module.exports = fetchGithub;