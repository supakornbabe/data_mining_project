import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { stringify } from 'csv';

type Pair<U, V> = { a: U, b: V };

(async function() {
    const mm = new Map<string, Pair<Number, string>[]>();
    let count = 1, totalCount = 0;
    for (let i = 15; i <= 21; i++) {
        await new Promise((resolve, reject) => {
            const ifs = fs.createReadStream(path.resolve(`../data/ptlog_201810${i}.json`), {
                encoding: 'utf-8'
            });
        
            // const ifs = fs.createReadStream(path.resolve(`../data/small.json`), {
            //     encoding: 'utf-8'
            // });

            const rl = readline.createInterface({
                input: ifs,
                terminal: false
            });
        
            rl.on('line', function(line) {
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
        
                    if (count >= 10000) {
                        count = 0;
                        totalCount += 10000;
                        console.log(totalCount);
                    }
                    count++;
                    
                    if (topic_id === undefined ||
                        comment_id === undefined ||
                        device === undefined ||
                        browser === undefined ||
                        os === undefined ||
                        referrer === undefined ||
                        rooms === undefined ||
                        tags === undefined ||
                        mid === undefined ||
                        tc === undefined ||
                        updated_time === undefined)
                    {
                        return;
                    }

                    const split = referrer.split('/');
                    if (split.length >= 3) {
                        // console.log(split[2]);
                        if (!!!mm.has(split[2])) {
                            mm.set(split[2], [ { a: topic_id, b: referrer } ]);
                            // console.log(split[2]);
                        } else {
                            const arr = mm.get(split[2]);
                            if (arr !== undefined) {
                                arr.push({ a: topic_id, b: referrer });
                            }
                        }
                    }

                    // console.log(referrer);

                } catch (err) {
        
                }
            });
        
            rl.on('close', () => resolve());
        });
    }

    let keys = mm.keys();
    let it = keys.next();
    while (!!!it.done) {
        const arr = mm.get(it.value);
        console.log('save: ', it.value);
        if (arr !== undefined) {
            const ws = fs.createWriteStream(path.resolve(`../data/processed/referrer/${it.value}.csv`), {
                encoding: 'utf-8'
            });
            
            const stringifier = stringify({
                header: false,
                columns: [ 'topic_id', 'referrer' ]
            });
            stringifier.pipe(ws);

            arr.forEach(pair => {
                stringifier.write([ pair.a, pair.b ]);
            });

            stringifier.end();
        }
        it = keys.next();
    }
})();