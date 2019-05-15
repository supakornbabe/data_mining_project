export interface Edge { 
    from: string;
    to: string;
}

export interface Components {
    nodes: string[];
}

export interface Graph {
    edges: Edge[];
};