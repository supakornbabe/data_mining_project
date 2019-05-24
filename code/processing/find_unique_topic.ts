import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import readline from 'readline';

(async function() {
    const topicSet = new Set<string>();

    await (function() {
        const ifs = fs.createReadStream(
            path.resolve(`../data/processed_except/pantip_edge_10.csv`),
            {encoding : 'utf-8'});

        const rl = readline.createInterface({input : ifs, terminal : false});

        return new Promise((resolve, reject) => {
            rl.on('line', line => {
                const splits = line.split(',');
                topicSet.add(splits[0]);
                topicSet.add(splits[1]);
            });

            rl.on('close', () => { resolve(); });
        });
    })();

    const topics = [...topicSet.entries() ];
    for (let i = 0; i < topics.length; i++) {
        const reqUrl = `https://m.pantip.com/topic/${topics[i][0]}`;
        // console.log(reqUrl);

        let res = '';
        try {
            res = await fetch(reqUrl, {method : 'get'}).then(res => res.text());
        } catch (err) {
            console.error(err);
        }

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

        const data = {title, date, URL : reqUrl, topic_id : topics[i][0]};
        console.log(JSON.stringify(data));

        await new Promise(
            (resolve, reject) => { setTimeout(() => { resolve(); }, 10); });
        // console.log(res);
        // break;
    }
})();