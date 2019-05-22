import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    let count = 0;

    const ws = fs.createWriteStream(path.resolve(`100000.json`), {
        encoding: 'utf-8'
    });

    for (let i = 15; i <= 15; i++) {
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
                    progress++;

                    if (count < 100000) {
                        ws.write(JSON.stringify(json));
                        ws.write("\n");
                        count++;
                    } else {
                        rl.removeAllListeners();
                    }
                    
                } catch (err) {

                }
            });

            rl.on('close', () => { 
                console.log('end'); 
                ws.end();
                resolve(); 
            });
        });
    }
})();