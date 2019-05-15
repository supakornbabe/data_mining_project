import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { Edge } from '../utils/definitions';
import FindGraphComponents, { FindComponentsGraph } from '../utils/find-graph-components';

const EDGE_WEIGHT_THRESHOLD = 10;

(async function() {
    let count = 0;
    let totalCount = 0;

    let ifs = fs.createReadStream(path.resolve(`../data/processed/pantip_incoming_10.csv`), {
        encoding: 'utf-8'
    });

    let rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    const edges: Edge[] = [];
    await new Promise(function(resolve, reject) {
        rl.on('line', function(line) {
            if (count == 1000) {
                // console.log(totalCount);
                count = 0;
            }
            count++;
            totalCount++;

            const splits = line.split(',', 2);

            // prevent self-loop
            if (splits[0].localeCompare(splits[1]) === 0) {
                return;
            }

            edges.push({ from: splits[1], to: splits[0] });
        });

        rl.on('close', () => { resolve() });
    });

    let max = 0;
    const components = FindComponentsGraph(edges);
    console.log(`Source,Target`);
    components.forEach(comp => {
        if (comp.edges.length >= 2) {
            if (comp.edges.length > max) {
                max = comp.edges.length;
            }
            // comp.edges.forEach(edge => console.log(`${edge.from},${edge.to}`));
        }
    });
    console.log(max);
})();