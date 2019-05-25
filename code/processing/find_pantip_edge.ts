import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    let count = 1;
    const ws = fs.createWriteStream(path.resolve(`../data/edges_with_condition.csv`), {
        encoding: 'utf-8'
    });

    for (let i = 15; i <= 21; i++) {
        const filename = `ptlog_201810${i}`;
        console.log(filename);
        await new Promise(function(resolve, reject) {
            const ifs = fs.createReadStream(path.resolve(`../data/${filename}.json`), {
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

                    if ((comment_id as string).localeCompare("0") === 0) {
                        const curReferrer = referrer as string;
                        const splits = curReferrer.split('/');
                        const domainName = splits[2];
                        if (domainName.localeCompare("pantip.com") === 0) {
                            const matches = referrer.match(/pantip.com\/topic\/([0-9]*)/);
                            if (matches !== null) {
                                // console.log(matches);
                                // console.log(matches[1]);
                                // console.log(`${topic_id},${matches[1]}`);
                                ws.write(`${topic_id},${matches[1]}`);
                                ws.write('\n');
                                // if (adjMap.has(topic_id)) {
                                //     const arr = adjMap.get(topic_id);
                                //     if (arr !== undefined) {
                                //         arr.push(matches[1]);
                                //     }
                                // } else {
                                //     adjMap.set(topic_id, [ matches[1] ]);
                                // }
                            }
                        } else if (domainName.localeCompare("m.pantip.com") === 0) {
                            const matches = referrer.match(/m.pantip.com\/topic\/([0-9]*)/);
                            if (matches !== null) {
                                // console.log(matches);
                                // console.log(matches[1]);
                                // console.log(`${topic_id},${matches[1]}`);
                                ws.write(`${topic_id},${matches[1]}`);
                                ws.write('\n');
                                // if (adjMap.has(topic_id)) {
                                //     const arr = adjMap.get(topic_id);
                                //     if (arr !== undefined) {
                                //         arr.push(matches[1]);
                                //     }
                                // } else {
                                //     adjMap.set(topic_id, [ matches[1] ]);
                                // }
                            }
                        }
                    }
                } catch (err) {

                }
            });

            rl.on('close', () => { console.log('end'); resolve(); });
        });
    }

    ws.end();
    // adjMap.forEach((value, key) => {
    //     if (value.length >= 10) {
    //         console.log(key);
    //     }
    // });
    // console.log(adjMap.size);

})();