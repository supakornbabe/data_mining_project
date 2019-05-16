class Edge:
    def __init__(self, src, dest):
        self.src = src;
        self.dest = dest;

class Graph:
    def __init__(self, edges):
        self.edges = edges