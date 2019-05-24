import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import readline from 'readline';

const SOURCE_FILE = '../data/processed_except/all_topic_id.csv';
const DESTINATION_FILE = 'test.csv';
const CONCURRENT_LIMIT = 10;

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    })
}

function fetchTopic(topicId): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reqUrl = `https://m.pantip.com/topic/${topicId}`;
        fetch(reqUrl, {method : 'get'})
        .then(res => res.text())
        .then(res => {
            const title = (function() {
                const matches =
                    res.match(/<meta name="twitter:title" content="(.*)" \/>/);
                return matches === null ? '' : matches[1];
            })();
    
            const date = (function() {
                const matches = res.match(
                    /<abbr title=".*" data-utime="(.*)" class="timeago"><\/abbr>/);
                return matches === null ? '' : matches[1];
            })();
    
            const data = { title, date, URL : reqUrl, topic_id : topicId };
            resolve(JSON.stringify(data));
        })
        .catch(err => reject(err));
    });
}

(async function() {
    // const ows = fs.createWriteStream(DESTINATION_FILE, { encoding: 'utf-8' });

    const topics: string[] = [];
    await (function() {
        const ifs = fs.createReadStream(
            path.resolve(SOURCE_FILE),
            {encoding : 'utf-8'});

        const rl = readline.createInterface({input : ifs, terminal : false});

        return new Promise((resolve, reject) => {
            rl.on('line', line => {
                topics.push(line);
            });

            rl.on('close', () => { resolve(); });
        });
    })();

    let index = 0;
    while (index < topics.length) {
        const fetchSize = Math.min(CONCURRENT_LIMIT, topics.length - index);
        const fetchPromises: Promise<string>[] = [];
        for (let i = 0; i < fetchSize; i++) {
            fetchPromises.push(fetchTopic(topics[index + i]));
        }
        index += fetchSize;

        const result = await Promise.all(fetchPromises);
        console.log(result);

        await delay(5);
    }

    // ows.end();
})();