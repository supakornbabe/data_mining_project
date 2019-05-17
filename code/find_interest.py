import networkx as nx

from operator import itemgetter
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
    betweeness = sorted(nx.edge_betweenness_centrality(giant_component).items(), key=itemgetter(1), reverse=True)
    
    for bet in betweeness:
        print("%s: %s" % bet)

    # print("Source,Target")
    # for com in list(nx.algorithms.community.k_clique_communities(giant_component.to_undirected(), 3)):
    #     if len(com) == 33:
    #         for edge in di_graph.subgraph(com).edges():
    #             (src, dest) = edge
    #             print("%s,%s" % (src, dest))

if __name__ == "__main__":
    main()