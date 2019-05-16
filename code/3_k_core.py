import networkx as nx

from pathlib import Path

def main():
    path = Path('../data/processed/pantip_incoming_10.csv').resolve();
    
    di_graph = nx.DiGraph()
    with open(path, 'r') as input_file:
        while True:
            line = input_file.readline().rstrip()

            # EOF
            if line == '':
                break
            
            splits = line.split(',')
            # prevent self-loop
            if splits[0] != splits[1]:
                di_graph.add_edge(splits[1], splits[0])

    # Processing Step
    # Finding the Giant Component
    # Finding 3-K Core

    undi_graph = di_graph.to_undirected()
    graph_components = (undi_graph.subgraph(c) for c in nx.connected_components(undi_graph));
    graph_components = sorted(graph_components, key=len, reverse=True)

    giant_component =  di_graph.subgraph(graph_components[0].nodes())

    di_3k_core = nx.algorithms.core.k_core(giant_component, 3)
    undi_3k_core = di_3k_core.to_undirected()

    # prevent infomation loss
    # extract subgraph from directed graph by node values
    sub_graph_di_3k_core = di_graph.subgraph(undi_3k_core.nodes())
    # print(sub_graph_di_3k_core.edges())

    # sub_graphs_3k_core = (undi_3k_core.subgraph(c).to_directed() for c in nx.connected_components(undi_3k_core))

    print("Source,Target")
    for edge in sub_graph_di_3k_core.edges():
        (src, dest) = edge
        print("%s,%s" % (src, dest))


if __name__ == "__main__":
    main()