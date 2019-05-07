import { Edge } from "./definitions";
import { stringify } from "querystring";

export default function createDirectedGraph(edges: Edge[]): Map<string, Set<string>> {
    const graphs = new Map<string, Set<string>>();
    for (const edge of edges) {
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
    return graphs;
}

export function createUndirectedGraph(edges: Edge[]): Map<string, Set<string>> {
    const graphs = new Map<string, Set<string>>();
    for (const edge of edges) {
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
    return graphs;
}