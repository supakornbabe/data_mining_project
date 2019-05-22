import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    let count = 1;

    const topicSet = new Set<string>();
    const topicTags = new Map<string, string[]>();
    const tagMap = new Map<string, number>();
    const relationMap = new Map<string, number>();

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

    const relationWs = fs.createWriteStream(path.resolve(`relation_2.csv`), {
        encoding: 'utf-8'
    });

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

                    let from_topic = '0';
                    let to_topic = '0';
                    if (topicSet.has(topic_id)) {
                        const matches = referrer.match(/pantip.com\/r\/([0-9]*)\//);
                        if (matches !== null) {
                            from_topic = matches[1];
                            to_topic = topic_id;
                        } else {
                            const matches2 = referrer.match(/pantip.com\/topic\/([0-9]*)/);
                            if (matches2 !== null) {
                                from_topic = matches[1];
                                to_topic = topic_id;
                            }
                        }
                    }

                    if (from_topic.localeCompare(to_topic) !== 0 && topicSet.has(to_topic)) {
                        const fromTags = topicTags.get(from_topic) || [];
                        const toTags = topicTags.get(to_topic) || [];
                        
                        if (fromTags.length > 0 && toTags.length > 0) {
                            for (const ft of fromTags) {
                                const ftId = tagMap.get(ft) || 0;
                                if (ftId === 0) {
                                    continue;
                                }

                                for (const tt of toTags) {
                                    const ttId = tagMap.get(tt) || 0;
                                    if (ftId !== ttId && ttId !== 0) {
                                        const relationStr = `${ftId},${ttId}`;
                                        const weight = relationMap.get(relationStr) || 0;
                                        relationMap.set(relationStr, weight + 1);
                                        // console.log(relationStr);
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {

                }
            });

            rl.on('close', () => { 
                console.log('end'); 
                resolve(); 
            });
        });
    }
    relationMap.forEach((value, key) => {
        relationWs.write(`${key},${value}`);
        relationWs.write("\n");
    });
    relationWs.end();
})();