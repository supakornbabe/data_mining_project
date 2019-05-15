import { Edge, Components, Graph } from "./definitions";
import createDirectedGraph, { createUndirectedGraph } from "./graphs";

export default function FindGraphComponents(edges: Edge[]): Components[] {
    const undirectedGraph = createUndirectedGraph(edges, true);
    const graphs = undirectedGraph.graphs;
    const nodeSet = undirectedGraph.nodes;

    const results = new Array<Components>();
    const visitedSet = new Set<string>();

    nodeSet.forEach(function(node) {
        if (visitedSet.has(node)) {
            return;
        }
        const curComponent: string[] = [ node ];
        visitedSet.add(node);

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
                        curComponent.push(value);
                        queue.push(value);
                    });
                }
            }
        }
        results.push({ nodes: curComponent });
    });
    
    return results;
}

export function FindComponentsGraph(edges: Edge[]): Graph[] {

    const undirectedGraph = createUndirectedGraph(edges, true);
    const graphs = undirectedGraph.graphs;
    const nodeSet = undirectedGraph.nodes;

    const results = new Array<Graph>();
    const visitedSet = new Set<string>();

    const directedGraph = createDirectedGraph(edges);

    nodeSet.forEach(function(node) {
        if (visitedSet.has(node)) {
            return;
        }
        const curComponent: string[] = [ node ];
        visitedSet.add(node);

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
                        curComponent.push(value);
                        queue.push(value);
                    });
                }
            }
        }

        const curComponentEdges: Edge[] = [];
        for (let i = 0; i < curComponent.length; i++) {
            for (let j = 0; j < curComponent.length; j++) {
                if (i === j) {
                    continue;
                }

                // console.log(curComponent[i], '->', curComponent[j]);
                const fromNode = curComponent[i];
                const toNode = curComponent[j];
                const fromSet = directedGraph.graphs.get(fromNode);

                if (fromSet === undefined) {
                    continue;
                }

                if (fromSet.has(toNode)) {
                    curComponentEdges.push({ from: fromNode, to: toNode });
                }
            }
        }
        results.push({ edges: curComponentEdges });
    });
    
    return results;
}

// TEST CASE:
// FindGraphComponents([
//     { from: '1', to: '2' },
//     { from: '2', to: '3' },
//     { from: '3', to: '1' },
//     { from: '4', to: '5' },
//     { from: '5', to: '6' },
//     { from: '6', to: '4' },
//     { from: '3', to: '4' },
// ]).forEach(edge => console.log('result: ', edge));

// FindComponentsGraph([
//     { from: '1', to: '2' },
//     { from: '2', to: '3' },
//     { from: '3', to: '1' },
//     { from: '4', to: '5' },
//     { from: '5', to: '6' },
//     { from: '6', to: '4' },
//     // { from: '1', to: '4' },
// ]).forEach(comp => {
//     comp.edges.forEach(edge => console.log(edge))
//     console.log('\nnext\n');
// });