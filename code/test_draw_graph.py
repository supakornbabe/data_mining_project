import networkx as nx
import matplotlib.pyplot as plt

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
    nx.draw(giant_component)
    plt.show()
    # plt.draw()

if __name__ == "__main__":
    main()