import importlib.util
import os
import json
import csv

from pathlib import Path
from definitions import Edge
from find_graph_components import FindComponentsGraph

def main():
    path = Path('../data/processed/pantip_incoming_10.csv').resolve();
    
    edges = []
    with open(path, 'r') as input_file:
        while True:
            line = input_file.readline().rstrip()

            # EOF
            if line == '':
                break
            
            splits = line.split(',')
            # prevent self-loop
            if splits[0] != splits[1]:
                edges.append(Edge(splits[1], splits[0]))

    # for item in edges:
    #     print('from %s to %s' % (item.src, item.dest)) 
            
    components = FindComponentsGraph(edges)
    print(components)
    print(len(components))

if __name__ == "__main__":
    main()