import { Edge } from "./definitions";
import { stringify } from "querystring";


export interface CreateGraphResult {
    graphs: Map<string, Set<string>>;
    nodes: Set<string>;
}

export default function createDirectedGraph(edges: Edge[], includeNodeSet: boolean = false): CreateGraphResult {
    const graphs = new Map<string, Set<string>>();
    const nodes = new Set<string>();

    for (const edge of edges) {
        if (includeNodeSet) {
            nodes.add(edge.from);
            nodes.add(edge.to);
        }
        if (graphs.has(edge.from)) {
            const set = graphs.get(edge.from);
            if (set !== undefined) {
                set.add(edge.to);
            }
        } else {
            const set = new Set<string>();
            set.add(edge.to);
            graphs.set(edge.from, set);
        }
    }
    return { graphs, nodes };
}

export function createUndirectedGraph(edges: Edge[], includeNodeSet: boolean = false): CreateGraphResult {
    const graphs = new Map<string, Set<string>>();
    const nodes = new Set<string>();

    for (const edge of edges) {
        if (includeNodeSet) {
            nodes.add(edge.from);
            nodes.add(edge.to);
        }

        if (graphs.has(edge.from)) {
            const set = graphs.get(edge.from);
            if (set !== undefined) {
                set.add(edge.to);
            }
        } else {
            const set = new Set<string>();
            set.add(edge.to);
            graphs.set(edge.from, set);
        }

        if (graphs.has(edge.to)) {
            const set = graphs.get(edge.to);
            if (set !== undefined) {
                set.add(edge.from);
            }
        } else {
            const set = new Set<string>();
            set.add(edge.from);
            graphs.set(edge.to, set);
        }
    }
    return { graphs, nodes };
}