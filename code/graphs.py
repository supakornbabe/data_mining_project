from definitions import Edge

class CreateGraphResult:
    def __init__(self, graphs, nodes):
        self.graphs = graphs
        self.nodes = nodes

def createDirectedGraph(edges, includeNodeSet=False):
    graphs = dict()
    nodes = set()

    for edge in edges:
        if includeNodeSet:
            if edge.src not in nodes:
                nodes.add(edge.src)
            if edge.dest not in nodes:
                nodes.add(edge.dest)

        if edge.src in graphs:
            src_set = graphs[edge.src]
            if src_set is not None:
                src_set.add(edge.dest)
        else:
            new_set = set()
            new_set.add(edge.dest)
            graphs[edge.src] = new_set

    return CreateGraphResult(graphs, nodes)

def createUndirectedGraph(edges, includeNodeSet=False):
    graphs = dict()
    nodes = set()

    for edge in edges:
        if includeNodeSet:
            if edge.src not in nodes:
                nodes.add(edge.src)
            if edge.dest not in nodes:
                nodes.add(edge.dest)

        if edge.src in graphs:
            src_set = graphs[edge.src]
            if src_set is not None:
                src_set.add(edge.dest)
        else:
            new_set = set()
            new_set.add(edge.dest)
            graphs[edge.src] = new_set

        if edge.dest in graphs:
            dest_set = graphs[edge.dest]
            if dest_set is not None:
                dest_set.add(edge.src)
        else:
            new_set = set()
            new_set.add(edge.src)
            graphs[edge.dest] = new_set

    return CreateGraphResult(graphs, nodes)

# result = createUndirectedGraph([
#     Edge('1', '2'),
#     Edge('2', '3'),
#     Edge('1', '3')
# ])
        
# print(result)