import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    const topicSet = new Set<string>();
    const ows = fs.createWriteStream('topic_tags.json', { encoding: 'utf-8' });

    let count = 0;
    for (let i = 15; i <= 21; i++) {
        const filename = `ptlog_201810${i}`;
        console.log(filename);
        await new Promise(function(resolve, reject) {
            const ifs = fs.createReadStream(path.resolve(`../data/ptlog_201810${i}.json`), {
                encoding: 'utf-8'
            });
            
            let progress = 0;
            const rl = readline.createInterface({
                input: ifs,
                terminal: false
            });

            rl.on('line', line => {
                try {
                    const json = eval(`(${line})`);
                    const {
                        topic_id,
                        comment_id,
                        device,
                        browser,
                        os,
                        referrer,
                        rooms,
                        tags,
                        mid,
                        tc,
                        updated_time
                    } = json;

                    if (progress === 10000) {
                        console.log(count);
                        progress = 0;
                    }
                    count++;
                    progress++;

                    if (!!!topicSet.has(topic_id)) {
                        topicSet.add(topic_id);
                        ows.write(JSON.stringify({
                            topic_id,
                            tags
                        }));
                        ows.write("\n");
                    }
                } catch (err) {
                    // console.error(err);
                }
            });

            rl.on('close', () => { console.log('end'); resolve(); });
        });
    }
    ows.end();
})();