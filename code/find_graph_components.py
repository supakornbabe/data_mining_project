import graphs
from definitions import Edge, Graph
from collections import deque

def FindComponentsGraph(edges):
    un_graph_result = graphs.createUndirectedGraph(edges, True)
    un_graph = un_graph_result.graphs
    un_nodes = un_graph_result.nodes

    result = []
    visited_set = set()

    di_graph = graphs.createDirectedGraph(edges).graphs

    for node in un_nodes:

        if node in visited_set:
            continue
        visited_set.add(node)

        cur_component = [ node ]
        que = deque([ node ])
        while que: # que in not empty.
            cur_queue_size = len(que)
            for i in range(cur_queue_size):
                from_node = que.popleft()
                next_nodes = un_graph[from_node]
                for next_node in next_nodes:
                    if next_node in visited_set:
                        continue
                    
                    visited_set.add(next_node)
                    cur_component.append(next_node)
                    que.append(next_node)

        cur_components_edges = []

        for i, from_node in enumerate(cur_component):
            for j, to_node in enumerate(cur_component):
                if i == j:
                    continue

                if from_node in di_graph:
                    from_set = di_graph[from_node]
                    if to_node in from_set:
                        cur_components_edges.append(Edge(from_node, to_node))

        result.append(Graph(cur_components_edges))

    return result

# result = FindComponentsGraph([
#     Edge('1', '2'),
#     Edge('2', '3'),
#     Edge('1', '3')
# ])

# for edge in result[0].edges:
#     print('from %s to %s' % (edge.src, edge.dest))
