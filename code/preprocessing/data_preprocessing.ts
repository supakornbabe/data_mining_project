import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { resolve } from 'bluebird';

const fsp = fs.promises;

const topicIdSet = new Set<number>();
const deviceSet = new Set<string>();
const browserSet = new Set<string>();
const osSet = new Set<string>();
const referrerSet = new Set<string>();
const tagSet = new Set<string>();
const roomSet = new Set<string>();

let count = 0;
let totalCount = 0;

const readFile = file => new Promise((resolve, reject) => {
    const ifs = fs.createReadStream(path.resolve(`../data/${file}`), {
        encoding: 'utf-8'
    });

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

            if (!!!topicIdSet.has(topic_id)) {

                topicIdSet.add(topic_id);
                for (const tag of tags) {
                    if (!!!tagSet.has(tag)) {
                        tagSet.add(tag);
                    }
                }

                for (const room of rooms) {
                    if (!!!roomSet.has(room)) {
                        roomSet.add(room);
                    }
                }
            }

            if (!!!deviceSet.has(device)) {
                deviceSet.add(device);
            }

            if (!!!browserSet.has(browser)) {
                browserSet.add(browser);
            }

            if (!!!osSet.has(os)) {
                osSet.add(os);
            }

            if (!!!referrerSet.has(referrer)) {
                referrerSet.add(referrer);
            }
        } catch (err) {

        }
    });

    rl.on('close', () => resolve());
});

function setToFile(set: Set<any>, path: string) {
    const ws = fs.createWriteStream(path, {
        encoding: 'utf-8'
    });
    set.forEach(value => {
        ws.write(value);
        ws.write('\r\n');
    });
    ws.close();
}

readFile('ptlog_20181015.json')
.then(() => readFile('ptlog_20181016.json'))
.then(() => readFile('ptlog_20181017.json'))
.then(() => readFile('ptlog_20181018.json'))
.then(() => readFile('ptlog_20181019.json'))
.then(() => readFile('ptlog_20181020.json'))
.then(() => readFile('ptlog_20181021.json'))
.then(() => {
    setToFile(topicIdSet, path.resolve(`../data/unique_topicid.txt`));
    setToFile(deviceSet, path.resolve(`../data/unique_device.txt`));
    setToFile(browserSet, path.resolve(`../data/unique_browser.txt`));
    setToFile(osSet, path.resolve(`../data/unique_os.txt`));
    setToFile(referrerSet, path.resolve(`../data/unique_referrer.txt`));
    setToFile(tagSet, path.resolve(`../data/unique_tag.txt`));
    setToFile(roomSet, path.resolve(`../data/unique_room.txt`));
});