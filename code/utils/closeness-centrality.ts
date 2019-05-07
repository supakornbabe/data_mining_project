import { Edge } from "./definitions";
import { findGraphComponentEdges } from "./find-graph-components";
import createDirectedGraph from "./graphs";

import Heap from 'collections/heap';

interface Search {
    node: string;
    timestamp: number;
}

export interface ClosessCentralityResult {
    node: string;
    value: number;
}

export default function ClosenessCentrality(edges: Edge[]): ClosessCentralityResult[] {
    const componenEdges = findGraphComponentEdges(edges);

    for (const ce of componenEdges) {
        const graphs = createDirectedGraph(ce.edges);

    }

    return new Array<ClosessCentralityResult>();
}

interface DijkstraEdge {
    from: string;
    to: string;
    weight: number;
}

function inverseDijkstraAlgorithm(edges: DijkstraEdge[]) {
    const maxHeap = new Heap();
    
}