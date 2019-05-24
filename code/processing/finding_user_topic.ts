import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    let count = 1;

    const topicSet = new Set<string>();
    const userTopics = new Map<string, Set<string>>();

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

    const outWs = fs.createWriteStream(path.resolve(`user_topics.csv`), {
        encoding: 'utf-8'
    });

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

                        if (topicSet.has(to_topic)) {
                            if (userTopics.has(tc)) {
                                const set = userTopics.get(tc);
                                if (set !== undefined) {
                                    set.add(from_topic);
                                    set.add(to_topic);
                                }
                            } else {
                                userTopics.set(tc, new Set([ from_topic, to_topic ]));
                            }
                        }
                    }
                } catch (err) {

                }
            });

            rl.on('close', () => { console.log('end'); resolve(); });
        });
    }

    userTopics.forEach((set, key) => {
        set.forEach(value => {
            outWs.write(`${key},${value}`);
            outWs.write("\n");
        });
    });
    outWs.end();
})();