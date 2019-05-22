import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    let count = 1;

    const topicSet = new Set<string>();
    const topicTags = new Map<string, string[]>();
    const tagMap = new Map<string, number>();
    const relationSet = new Set<string>();

    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`../data/processed/pantip_edge_10.csv`), {
            encoding: 'utf-8'
        });

        const rl = readline.createInterface({
            input: ifs,
            terminal: false
        });

        rl.on('line', line => {
            const splits = line.split(',');
            topicSet.add(splits[0]);
            topicSet.add(splits[1]);
        });
    })();

    const tagWs = fs.createWriteStream(path.resolve(`tag_id.csv`), {
        encoding: 'utf-8'
    });

    // const relationWs = fs.createWriteStream(path.resolve(`relation.csv`), {
    //     encoding: 'utf-8'
    // });

    let tagId = 1;
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

                    if (topicSet.has(topic_id)) {
                        if (!!!topicTags.has(topic_id)) {
                            topicTags.set(topic_id, tags);
                            for (const tag of tags) {
                                if (!!!tagMap.has(tag)) {
                                    tagMap.set(tag, tagId);
                                    console.log(`${tag}: ${tagId}`);
                                    tagId++;
                                }
                            }
                        }
                    }
                } catch (err) {

                }
            });

            rl.on('close', () => { console.log('end'); resolve(); });
        });
    }

    tagMap.forEach((value, key) => {
        tagWs.write(`${value},${key}`);
        tagWs.write("\n");
    });
    tagWs.end();
    
})();