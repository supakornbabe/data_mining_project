import { Edge, Components } from "./definitions";

export default function FindGraphComponents(edges: Edge[]): Components[] {
    const graphs = new Map<string, Set<string>>();
    const nodeSet = new Set<string>();
    // build a graph.
    for (const edge of edges) {
        if (!!!nodeSet.has(edge.from)) {
            nodeSet.add(edge.from);
        }
        if (!!!nodeSet.has(edge.to)) {
            nodeSet.add(edge.to);
        }

        if (graphs.has(edge.from)) {
            const set = graphs.get(edge.from);
            if (set !== undefined) {
                set.add(edge.to);
            }
        } else {
            const newSet = new Set<string>();
            newSet.add(edge.to);
            graphs.set(edge.from, newSet);
        }

        if (graphs.has(edge.to)) {
            const set = graphs.get(edge.to);
            if (set !== undefined) {
                set.add(edge.from);
            }
        } else {
            const newSet = new Set<string>();
            newSet.add(edge.from);
            graphs.set(edge.to, newSet);
        }
    }

    const results = new Array<Components>();
    const visitedSet = new Set<string>();

    nodeSet.forEach(function(node) {
        if (visitedSet.has(node)) {
            return;
        }
        const curComponent: Edge[] = [];
        const queue = [ node ];
        while (queue.length > 0) {
            // do BFS
            const curQueueSize = queue.length;
            for (let i = 0; i < curQueueSize; i++) {
                const fromNode = queue[0];
                const nextNodes = graphs.get(fromNode);
                queue.shift();
                if (nextNodes !== undefined) {
                    nextNodes.forEach(function(value) {
                        if (visitedSet.has(value)) {
                            return;
                        }
                        visitedSet.add(value);
                        curComponent.push({ from: fromNode, to: value });
                        queue.push(value);
                    });
                }
            }
        }
        results.push({ edges: curComponent });
    });
    
    return results;
}

FindGraphComponents([
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '1' },
    { from: '4', to: '5' },
    { from: '5', to: '6' },
    { from: '6', to: '4' },
]).forEach(edge => console.log('result: ', edge));