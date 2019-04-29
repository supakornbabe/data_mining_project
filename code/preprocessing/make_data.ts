import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { stringify } from 'csv';

function uniqueFileToMap(path: string): Promise<Map<string, number>> {
    return new Promise(function(resolve, reject) {
        const map = new Map<string, number>();
    
        const ifs = fs.createReadStream(path, {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
            input: ifs,
            terminal: false
        });
    
        let count = 1;
        rl.on('line', line => {
            map.set(line, count);
            count++;
        });
    
        rl.on('close', () => resolve(map));
    });
}

(async function() {
    let browserSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_browser.txt'));
    let deviceSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_device.txt'));
    let osSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_os.txt'));
    let referrerSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_referrer.txt'));
    let roomSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_room.txt'));
    let tagSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_tag.txt'));
    // let topicIdSet: Map<string, number> = await uniqueFileToMap(path.resolve('../data/unique_topicid.txt'));

    const filename = 'ptlog_20181015';

    const ifs = fs.createReadStream(path.resolve(`../data/${filename}.json`), {
            encoding: 'utf-8'
    });
    
    await new Promise(function(resolve, reject) {

        const ws = fs.createWriteStream(path.resolve(`../data/${filename}_data.csv`), {
            encoding: 'utf-8'
        });

        const stringifier = stringify({
            header: false,
            columns: [ 'id', 'topic_id', 'device', 'browser', 'os', 'referrer', 'tc', 'updated_time', 'mid', 'comment_id' ]
        });

        stringifier.pipe(ws);

        let count = 1;
        let progress = 0;
        const rl = readline.createInterface({
            input: ifs,
            terminal: false
        })
        .on('line', line => {
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

                if (progress === 1000) {
                    console.log(count);
                    progress = 0;
                }
                progress++;

                const deviceId = deviceSet.get(device);
                const browserId = browserSet.get(browser);
                const osId = osSet.get(os);
                const referrerId = referrerSet.get(referrer);

                // ws.write(`"${count}","${topic_id}","${deviceId}","${browserId}","${osId}","${referrerId}","${tc}","${updated_time}","${mid}","${comment_id}"`);
                // ws.write('\n');
                stringifier.write([ count, topic_id, deviceId, browserId, osId, referrerId, tc, updated_time, mid, comment_id ]);
                count++;

                // for (const room of rooms) {
                //     console.log(roomSet.get(room));
                // }

                // for (const tag of tags) {
                //     console.log(tagSet.get(tag));
                // }
            } catch (err) {

            }
        })
        .off('close', () => { stringifier.end(); console.log('end'); resolve() });
    });
})();