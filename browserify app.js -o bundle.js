(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Graph = require("graph-data-structure");
let graph = Graph();
graph.addNode("CSS 101").addNode("CSS 102").addNode("CSS 103").addNode("CSS 104").addNode("CSS 105");
graph.addEdge("CSS 101","CSS 102");
graph.addEdge("CSS 101","CSS 103");
graph.addEdge("CSS 102","CSS 104");
graph.addEdge("CSS 102","CSS 105");
graph.addEdge("CSS 103","CSS 105");
var radius = 40;
/*let graphData = [{label:"CSS 101",description:"Write application with Programming"},
                {label:"CSS 102", parentNodes:[0],description:""},
                {label:"CSS 103",parentNodes:[0]},
                {label:"CSS 104",parentNodes:[1]},
                {label:"CSS 105",parentNode:[1,2]}
            ];*/

window.states = [];
let x = 40;let y=40;let index= 0;
let nodes = graph.nodes();
for (let i=0;i<nodes.length;i++){
    let node = nodes[i];
    let newNode = {index:index,x:x,y:y,label:node,transitions:[]};
    window.states.push(newNode);
    x = x+100; y = y+100; index = index+1;
}
for (let i=0;i<nodes.length;i++){
    let node = nodes[i];
    let adjNodes = graph.adjacent(node);
    for (let adjNode of adjNodes){
        node.transitions.push({label:'whoo',target:window.states[adjNode]});
    }
}
console.log("Hello");

/*window.states = [];
let x = 40;let y=40;let index= 0;
for (let graphNode of graphData){
    let newNode = {index:index,x:x,y:y,label: graphNode.label,transitions:[]};
    window.states.push(newNode);
    if (graphNode.parentNodes){
        for (let parentNode of graphNode.parentNodes){
            newNode.transitions.push({label:'whooo',target:window.states[parentNode]});
        }
    }
    x=x+100;y=y+100;index=index+1;
}*//*
window.states = [
    { x : 43, y : 67, label : "first", transitions : [] },
    { x : 340, y : 150, label : "second", transitions : [] },
    { x : 200, y : 250, label : "third", transitions : [] },
    { x : 300, y : 320, label : "fourth", transitions : [] },
    { x : 50, y : 250, label : "fifth", transitions : [] },
    { x : 90, y : 170, label : "last", transitions : [] }
];

window.states[0].transitions.push( { label : 'whooo', target : window.states[1]})*/

window.svg = d3.select('body')
.append("svg")
//.attr("viewBox", "0 0 " + 1000 + " " + 1000 )
//.attr("preserveAspectRatio", "xMinYMin")
.attr("width", "960px")
.attr("height", "500px");    

    // define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 3)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

    // line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
    .attr('class', 'dragline hidden')
    .attr('d', 'M0,0L0,0')
;

var gStates = svg.selectAll("g.state").data(states);

var transitions = function() {
    return states.reduce( function( initial, state) {
        return initial.concat( 
            state.transitions.map( function( transition) {
                return { source : state, target : transition.target};
            })
        );
    }, []);
};
    // http://www.dashingd3js.com/svg-paths-and-d3js
var computeTransitionPath = /*d3.svg.diagonal.radial()*/function( d) {
    var deltaX = d.target.x - d.source.x,
    deltaY = d.target.y - d.source.y,
    dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
    normX = deltaX / dist,
    normY = deltaY / dist,
    sourcePadding = radius + 2;//d.left ? 17 : 12,
    targetPadding = radius + 6;//d.right ? 17 : 12,
    sourceX = d.source.x + (sourcePadding * normX),
    sourceY = d.source.y + (sourcePadding * normY),
    targetX = d.target.x - (targetPadding * normX),
    targetY = d.target.y - (targetPadding * normY);
    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
};

var gTransitions = svg.append( 'g').selectAll( "path.transition").data(transitions);

var startState, endState;    
var drag = d3.behavior.drag()
.on("drag", function( d, i) {
    if( startState) {
        return;
    }
    var selection = d3.selectAll( '.selected');

    if( selection[0].indexOf( this)==-1) {
        selection.classed( "selected", false);
        selection = d3.select( this);
        selection.classed( "selected", true);
    } 

    selection.attr("transform", function( d, i) {
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        return "translate(" + [ d.x,d.y ] + ")"
    })
        // reappend dragged element as last 
        // so that its stays on top 
    this.parentNode.appendChild( this);

    gTransitions.attr( 'd', computeTransitionPath);
    d3.event.sourceEvent.stopPropagation();
})
.on( "dragend", function( d) {
    // TODO : http://stackoverflow.com/questions/14667401/click-event-not-firing-after-drag-sometimes-in-d3-js

    // needed by FF
    drag_line.classed('hidden', true).style('marker-end', '');

    if( startState && endState) {
        startState.transitions.push( { label : "transition label 1", target : endState});
        restart();
    }

    startState = undefined;
    d3.event.sourceEvent.stopPropagation();
});

svg.on( "mousedown", function() {
    if( !d3.event.ctrlKey) {
        d3.selectAll( 'g.selected').classed( "selected", false);
    }

    var p = d3.mouse(this);
    //console.log("Mouse Down");
    svg.append( "rect").attr({
        rx: 6, ry: 6, class: "selection", x: p[0], y: p[1], width: 0, height: 0
    })
})
.on( "mousemove", function() {
    var p = d3.mouse( this),
        s = svg.select( "rect.selection");

    if( !s.empty()) {
        var d = { x:parseInt(s.attr("x"),10),y:parseInt(s.attr("y"),10),
                    width:parseInt(s.attr("width"),10),height:parseInt(s.attr( "height"), 10)},
        move = {x : p[0] - d.x,
                y : p[1] - d.y};
        if( move.x < 1 || (move.x*2<d.width)) {
            d.x = p[0];
            d.width -= move.x;
        } else {
            d.width = move.x;       
        }

        if( move.y < 1 || (move.y*2<d.height)) {
            d.y = p[1];
            d.height -= move.y;
        } else {
            d.height = move.y;       
        }
        s.attr( d);
            // deselect all temporary selected state objects
        d3.selectAll( 'g.state.selection.selected').classed( "selected", false);
        d3.selectAll( 'g.state >circle.inner').each( function( state_data, i) {
            if( 
                !d3.select( this).classed( "selected") && 
                    // inner circle inside selection frame
                state_data.x-radius>=d.x && state_data.x+radius<=d.x+d.width && 
                state_data.y-radius>=d.y && state_data.y+radius<=d.y+d.height
            ) {

                d3.select( this.parentNode)
                .classed( "selection", true)
                .classed( "selected", true);
            }
        });
    } else if( startState) {
            // update drag line
        drag_line.attr('d', 'M' + startState.x + ',' + startState.y + 'L' + p[0] + ',' + p[1]);

        var state = d3.select( 'g.state.hover');
        endState = (!state.empty() && state.data()[0]) || undefined;
    }
})
.on("mouseup", function() {
        // remove selection frame
    svg.selectAll( "rect.selection").remove();
        // remove temporary selection marker class
    d3.selectAll( 'g.state.selection').classed( "selection", false);
})
.on("mouseout", function() {
    if( d3.event.relatedTarget.tagName=='HTML') {
            // remove selection frame
        svg.selectAll( "rect.selection").remove();
            // remove temporary selection marker class
        d3.selectAll( 'g.state.selection').classed( "selection", false);
    }
});
restart();
function restart() {
    console.log("RESTART");
    
    gStates = gStates.data(states);
    var gState = gStates.enter().append( "g")
        .attr({
            "transform" : function( d) {
                return "translate("+ [d.x,d.y] + ")";
            },'class': 'state','data-id':function(d){ return d.index} 
        }).call( drag);
    /*gState.append("circle")
        .attr({
            //rx: 5,width:80,height:80
            r       : radius + 100,
            class   : 'outer'
        })
        .on( "mousedown", function( d) {
            startState = d, endState = undefined;

                // reposition drag line
            drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', false)
                .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y)
            ;

                // force element to be an top
            this.parentNode.parentNode.appendChild( this.parentNode);
            console.log( "mousedown", startState);
        });*/
    gState.append('circle').attr({r:40,class:'inner'})
    .on("mouseover",function(d,i){
        d3.select( this.parentNode).classed( "hover", true);})
    .on("click",function(d,i){
        console.log("CLICKED");
        console.log(this.parentNode);
    });
    //gState.append('rect').attr({});
    /*gState.append( "circle")
        .attr({
            //rx: 5,width:80,height:80,
            r       : radius,
            class   : 'inner'
        })
        .on( "click", function( d, i) {
            var e = d3.event,
                g = this.parentNode,
                isSelected = d3.select( g).classed( "selected");

            if( !e.ctrlKey) {
                d3.selectAll( 'g.selected').classed( "selected", false);
            }
            d3.select( g).classed( "selected", !isSelected);
                // reappend dragged element as last 
                // so that its stays on top 
            g.parentNode.appendChild( g);
        })
        .on("mouseover", function(){
            d3.select( this.parentNode).classed( "hover", true);
        })
        .on("mouseout", function() { 
            d3.select( this.parentNode).classed( "hover", false);
        });
    ;*/

    gState.append("text")
        .attr({
            'text-anchor'   : 'middle',
            y               : 4,
            class           : 'title'
        })
        .text( function( d) {
            return d.label;
        })
    ;
    gState.append( "title").text( function( d) {
        return d.label;
    });
    gStates.exit().remove();

    gTransitions = gTransitions.data( transitions);
    gTransitions.enter().append( 'path')
        .attr( 'class', 'transition')
        .attr( 'd', computeTransitionPath)
    ;   
    gTransitions.exit().remove();
};
},{"graph-data-structure":2}],2:[function(require,module,exports){
"use strict";
// A graph data structure with depth-first search and topological sort.
function Graph(serialized) {
    // Returned graph instance
    var graph = {
        addNode: addNode,
        removeNode: removeNode,
        nodes: nodes,
        adjacent: adjacent,
        addEdge: addEdge,
        removeEdge: removeEdge,
        setEdgeWeight: setEdgeWeight,
        getEdgeWeight: getEdgeWeight,
        indegree: indegree,
        outdegree: outdegree,
        depthFirstSearch: depthFirstSearch,
        lowestCommonAncestors: lowestCommonAncestors,
        topologicalSort: topologicalSort,
        shortestPath: shortestPath,
        serialize: serialize,
        deserialize: deserialize
    };
    // The adjacency list of the graph.
    // Keys are node ids.
    // Values are adjacent node id arrays.
    var edges = {};
    // The weights of edges.
    // Keys are string encodings of edges.
    // Values are weights (numbers).
    var edgeWeights = {};
    // If a serialized graph was passed into the constructor, deserialize it.
    if (serialized) {
        deserialize(serialized);
    }
    // Adds a node to the graph.
    // If node was already added, this function does nothing.
    // If node was not already added, this function sets up an empty adjacency list.
    function addNode(node) {
        edges[node] = adjacent(node);
        return graph;
    }
    // Removes a node from the graph.
    // Also removes incoming and outgoing edges.
    function removeNode(node) {
        // Remove incoming edges.
        Object.keys(edges).forEach(function (u) {
            edges[u].forEach(function (v) {
                if (v === node) {
                    removeEdge(u, v);
                }
            });
        });
        // Remove outgoing edges (and signal that the node no longer exists).
        delete edges[node];
        return graph;
    }
    // Gets the list of nodes that have been added to the graph.
    function nodes() {
        // TODO: Better implementation with set data structure
        var nodeSet = {};
        Object.keys(edges).forEach(function (u) {
            nodeSet[u] = true;
            edges[u].forEach(function (v) {
                nodeSet[v] = true;
            });
        });
        return Object.keys(nodeSet);
    }
    // Gets the adjacent node list for the given node.
    // Returns an empty array for unknown nodes.
    function adjacent(node) {
        return edges[node] || [];
    }
    // Computes a string encoding of an edge,
    // for use as a key in an object.
    function encodeEdge(u, v) {
        return u + "|" + v;
    }
    // Sets the weight of the given edge.
    function setEdgeWeight(u, v, weight) {
        edgeWeights[encodeEdge(u, v)] = weight;
        return graph;
    }
    // Gets the weight of the given edge.
    // Returns 1 if no weight was previously set.
    function getEdgeWeight(u, v) {
        var weight = edgeWeights[encodeEdge(u, v)];
        return weight === undefined ? 1 : weight;
    }
    // Adds an edge from node u to node v.
    // Implicitly adds the nodes if they were not already added.
    function addEdge(u, v, weight) {
        addNode(u);
        addNode(v);
        adjacent(u).push(v);
        if (weight !== undefined) {
            setEdgeWeight(u, v, weight);
        }
        return graph;
    }
    // Removes the edge from node u to node v.
    // Does not remove the nodes.
    // Does nothing if the edge does not exist.
    function removeEdge(u, v) {
        if (edges[u]) {
            edges[u] = adjacent(u).filter(function (_v) {
                return _v !== v;
            });
        }
        return graph;
    }
    // Computes the indegree for the given node.
    // Not very efficient, costs O(E) where E = number of edges.
    function indegree(node) {
        var degree = 0;
        function check(v) {
            if (v === node) {
                degree++;
            }
        }
        Object.keys(edges).forEach(function (u) {
            edges[u].forEach(check);
        });
        return degree;
    }
    // Computes the outdegree for the given node.
    function outdegree(node) {
        return node in edges ? edges[node].length : 0;
    }
    // Depth First Search algorithm, inspired by
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
    // This variant includes an additional option
    // `includeSourceNodes` to specify whether to include or
    // exclude the source nodes from the result (true by default).
    // If `sourceNodes` is not specified, all nodes in the graph
    // are used as source nodes.
    function depthFirstSearch(sourceNodes, includeSourceNodes) {
        if (includeSourceNodes === void 0) { includeSourceNodes = true; }
        if (!sourceNodes) {
            sourceNodes = nodes();
        }
        if (typeof includeSourceNodes !== "boolean") {
            includeSourceNodes = true;
        }
        var visited = {};
        var nodeList = [];
        function DFSVisit(node) {
            if (!visited[node]) {
                visited[node] = true;
                adjacent(node).forEach(DFSVisit);
                nodeList.push(node);
            }
        }
        if (includeSourceNodes) {
            sourceNodes.forEach(DFSVisit);
        }
        else {
            sourceNodes.forEach(function (node) {
                visited[node] = true;
            });
            sourceNodes.forEach(function (node) {
                adjacent(node).forEach(DFSVisit);
            });
        }
        return nodeList;
    }
    // Least Common Ancestors
    // Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
    // but uses depth search instead of breadth. Also uses some optimizations
    function lowestCommonAncestors(node1, node2) {
        var node1Ancestors = [];
        var lcas = [];
        function CA1Visit(visited, node) {
            if (!visited[node]) {
                visited[node] = true;
                node1Ancestors.push(node);
                if (node == node2) {
                    lcas.push(node);
                    return false; // found - shortcut
                }
                return adjacent(node).every(function (node) {
                    return CA1Visit(visited, node);
                });
            }
            else {
                return true;
            }
        }
        function CA2Visit(visited, node) {
            if (!visited[node]) {
                visited[node] = true;
                if (node1Ancestors.indexOf(node) >= 0) {
                    lcas.push(node);
                }
                else if (lcas.length == 0) {
                    adjacent(node).forEach(function (node) {
                        CA2Visit(visited, node);
                    });
                }
            }
        }
        if (CA1Visit({}, node1)) {
            // No shortcut worked
            CA2Visit({}, node2);
        }
        return lcas;
    }
    // The topological sort algorithm yields a list of visited nodes
    // such that for each visited edge (u, v), u comes before v in the list.
    // Amazingly, this comes from just reversing the result from depth first search.
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
    function topologicalSort(sourceNodes, includeSourceNodes) {
        if (includeSourceNodes === void 0) { includeSourceNodes = true; }
        return depthFirstSearch(sourceNodes, includeSourceNodes).reverse();
    }
    // Dijkstra's Shortest Path Algorithm.
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
    // Variable and function names correspond to names in the book.
    function shortestPath(source, destination) {
        // Upper bounds for shortest path weights from source.
        var d = {};
        // Predecessors.
        var p = {};
        // Poor man's priority queue, keyed on d.
        var q = {};
        function initializeSingleSource() {
            nodes().forEach(function (node) {
                d[node] = Infinity;
            });
            if (d[source] !== Infinity) {
                throw new Error("Source node is not in the graph");
            }
            if (d[destination] !== Infinity) {
                throw new Error("Destination node is not in the graph");
            }
            d[source] = 0;
        }
        // Adds entries in q for all nodes.
        function initializePriorityQueue() {
            nodes().forEach(function (node) {
                q[node] = true;
            });
        }
        // Returns true if q is empty.
        function priorityQueueEmpty() {
            return Object.keys(q).length === 0;
        }
        // Linear search to extract (find and remove) min from q.
        function extractMin() {
            var min = Infinity;
            var minNode;
            Object.keys(q).forEach(function (node) {
                if (d[node] < min) {
                    min = d[node];
                    minNode = node;
                }
            });
            if (minNode === undefined) {
                // If we reach here, there's a disconnected subgraph, and we're done.
                q = {};
                return null;
            }
            delete q[minNode];
            return minNode;
        }
        function relax(u, v) {
            var w = getEdgeWeight(u, v);
            if (d[v] > d[u] + w) {
                d[v] = d[u] + w;
                p[v] = u;
            }
        }
        function dijkstra() {
            initializeSingleSource();
            initializePriorityQueue();
            while (!priorityQueueEmpty()) {
                var u = extractMin();
                if (u === null)
                    return;
                adjacent(u).forEach(function (v) {
                    relax(u, v);
                });
            }
        }
        // Assembles the shortest path by traversing the
        // predecessor subgraph from destination to source.
        function path() {
            var nodeList = [];
            var weight = 0;
            var node = destination;
            while (p[node]) {
                nodeList.push(node);
                weight += getEdgeWeight(p[node], node);
                node = p[node];
            }
            if (node !== source) {
                throw new Error("No path found");
            }
            nodeList.push(node);
            nodeList.reverse();
            nodeList.weight = weight;
            return nodeList;
        }
        dijkstra();
        return path();
    }
    // Serializes the graph.
    function serialize() {
        var serialized = {
            nodes: nodes().map(function (id) {
                return { id: id };
            }),
            links: []
        };
        serialized.nodes.forEach(function (node) {
            var source = node.id;
            adjacent(source).forEach(function (target) {
                serialized.links.push({
                    source: source,
                    target: target,
                    weight: getEdgeWeight(source, target)
                });
            });
        });
        return serialized;
    }
    // Deserializes the given serialized graph.
    function deserialize(serialized) {
        serialized.nodes.forEach(function (node) {
            addNode(node.id);
        });
        serialized.links.forEach(function (link) {
            addEdge(link.source, link.target, link.weight);
        });
        return graph;
    }
    // The returned graph instance.
    return graph;
}
module.exports = Graph;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJub2RlX21vZHVsZXMvZ3JhcGgtZGF0YS1zdHJ1Y3R1cmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBHcmFwaCA9IHJlcXVpcmUoXCJncmFwaC1kYXRhLXN0cnVjdHVyZVwiKTtcbmxldCBncmFwaCA9IEdyYXBoKCk7XG5ncmFwaC5hZGROb2RlKFwiQ1NTIDEwMVwiKS5hZGROb2RlKFwiQ1NTIDEwMlwiKS5hZGROb2RlKFwiQ1NTIDEwM1wiKS5hZGROb2RlKFwiQ1NTIDEwNFwiKS5hZGROb2RlKFwiQ1NTIDEwNVwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAxXCIsXCJDU1MgMTAyXCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDFcIixcIkNTUyAxMDNcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMlwiLFwiQ1NTIDEwNFwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAyXCIsXCJDU1MgMTA1XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDNcIixcIkNTUyAxMDVcIik7XG52YXIgcmFkaXVzID0gNDA7XG4vKmxldCBncmFwaERhdGEgPSBbe2xhYmVsOlwiQ1NTIDEwMVwiLGRlc2NyaXB0aW9uOlwiV3JpdGUgYXBwbGljYXRpb24gd2l0aCBQcm9ncmFtbWluZ1wifSxcbiAgICAgICAgICAgICAgICB7bGFiZWw6XCJDU1MgMTAyXCIsIHBhcmVudE5vZGVzOlswXSxkZXNjcmlwdGlvbjpcIlwifSxcbiAgICAgICAgICAgICAgICB7bGFiZWw6XCJDU1MgMTAzXCIscGFyZW50Tm9kZXM6WzBdfSxcbiAgICAgICAgICAgICAgICB7bGFiZWw6XCJDU1MgMTA0XCIscGFyZW50Tm9kZXM6WzFdfSxcbiAgICAgICAgICAgICAgICB7bGFiZWw6XCJDU1MgMTA1XCIscGFyZW50Tm9kZTpbMSwyXX1cbiAgICAgICAgICAgIF07Ki9cblxud2luZG93LnN0YXRlcyA9IFtdO1xubGV0IHggPSA0MDtsZXQgeT00MDtsZXQgaW5kZXg9IDA7XG5sZXQgbm9kZXMgPSBncmFwaC5ub2RlcygpO1xuZm9yIChsZXQgaT0wO2k8bm9kZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICBsZXQgbmV3Tm9kZSA9IHtpbmRleDppbmRleCx4OngseTp5LGxhYmVsOm5vZGUsdHJhbnNpdGlvbnM6W119O1xuICAgIHdpbmRvdy5zdGF0ZXMucHVzaChuZXdOb2RlKTtcbiAgICB4ID0geCsxMDA7IHkgPSB5KzEwMDsgaW5kZXggPSBpbmRleCsxO1xufVxuZm9yIChsZXQgaT0wO2k8bm9kZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICBsZXQgYWRqTm9kZXMgPSBncmFwaC5hZGphY2VudChub2RlKTtcbiAgICBmb3IgKGxldCBhZGpOb2RlIG9mIGFkak5vZGVzKXtcbiAgICAgICAgbm9kZS50cmFuc2l0aW9ucy5wdXNoKHtsYWJlbDond2hvbycsdGFyZ2V0OndpbmRvdy5zdGF0ZXNbYWRqTm9kZV19KTtcbiAgICB9XG59XG5jb25zb2xlLmxvZyhcIkhlbGxvXCIpO1xuXG4vKndpbmRvdy5zdGF0ZXMgPSBbXTtcbmxldCB4ID0gNDA7bGV0IHk9NDA7bGV0IGluZGV4PSAwO1xuZm9yIChsZXQgZ3JhcGhOb2RlIG9mIGdyYXBoRGF0YSl7XG4gICAgbGV0IG5ld05vZGUgPSB7aW5kZXg6aW5kZXgseDp4LHk6eSxsYWJlbDogZ3JhcGhOb2RlLmxhYmVsLHRyYW5zaXRpb25zOltdfTtcbiAgICB3aW5kb3cuc3RhdGVzLnB1c2gobmV3Tm9kZSk7XG4gICAgaWYgKGdyYXBoTm9kZS5wYXJlbnROb2Rlcyl7XG4gICAgICAgIGZvciAobGV0IHBhcmVudE5vZGUgb2YgZ3JhcGhOb2RlLnBhcmVudE5vZGVzKXtcbiAgICAgICAgICAgIG5ld05vZGUudHJhbnNpdGlvbnMucHVzaCh7bGFiZWw6J3dob29vJyx0YXJnZXQ6d2luZG93LnN0YXRlc1twYXJlbnROb2RlXX0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHg9eCsxMDA7eT15KzEwMDtpbmRleD1pbmRleCsxO1xufSovLypcbndpbmRvdy5zdGF0ZXMgPSBbXG4gICAgeyB4IDogNDMsIHkgOiA2NywgbGFiZWwgOiBcImZpcnN0XCIsIHRyYW5zaXRpb25zIDogW10gfSxcbiAgICB7IHggOiAzNDAsIHkgOiAxNTAsIGxhYmVsIDogXCJzZWNvbmRcIiwgdHJhbnNpdGlvbnMgOiBbXSB9LFxuICAgIHsgeCA6IDIwMCwgeSA6IDI1MCwgbGFiZWwgOiBcInRoaXJkXCIsIHRyYW5zaXRpb25zIDogW10gfSxcbiAgICB7IHggOiAzMDAsIHkgOiAzMjAsIGxhYmVsIDogXCJmb3VydGhcIiwgdHJhbnNpdGlvbnMgOiBbXSB9LFxuICAgIHsgeCA6IDUwLCB5IDogMjUwLCBsYWJlbCA6IFwiZmlmdGhcIiwgdHJhbnNpdGlvbnMgOiBbXSB9LFxuICAgIHsgeCA6IDkwLCB5IDogMTcwLCBsYWJlbCA6IFwibGFzdFwiLCB0cmFuc2l0aW9ucyA6IFtdIH1cbl07XG5cbndpbmRvdy5zdGF0ZXNbMF0udHJhbnNpdGlvbnMucHVzaCggeyBsYWJlbCA6ICd3aG9vbycsIHRhcmdldCA6IHdpbmRvdy5zdGF0ZXNbMV19KSovXG5cbndpbmRvdy5zdmcgPSBkMy5zZWxlY3QoJ2JvZHknKVxuLmFwcGVuZChcInN2Z1wiKVxuLy8uYXR0cihcInZpZXdCb3hcIiwgXCIwIDAgXCIgKyAxMDAwICsgXCIgXCIgKyAxMDAwIClcbi8vLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pbllNaW5cIilcbi5hdHRyKFwid2lkdGhcIiwgXCI5NjBweFwiKVxuLmF0dHIoXCJoZWlnaHRcIiwgXCI1MDBweFwiKTsgICAgXG5cbiAgICAvLyBkZWZpbmUgYXJyb3cgbWFya2VycyBmb3IgZ3JhcGggbGlua3NcbnN2Zy5hcHBlbmQoJ3N2ZzpkZWZzJykuYXBwZW5kKCdzdmc6bWFya2VyJylcbiAgICAuYXR0cignaWQnLCAnZW5kLWFycm93JylcbiAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAuYXR0cigncmVmWCcsIDMpXG4gICAgLmF0dHIoJ21hcmtlcldpZHRoJywgOClcbiAgICAuYXR0cignbWFya2VySGVpZ2h0JywgOClcbiAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxuICAgIC5hcHBlbmQoJ3N2ZzpwYXRoJylcbiAgICAuYXR0cignZCcsICdNMCwtNUwxMCwwTDAsNScpXG4gICAgLmF0dHIoJ2ZpbGwnLCAnIzAwMCcpO1xuXG5zdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgLmF0dHIoJ2lkJywgJ3N0YXJ0LWFycm93JylcbiAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAuYXR0cigncmVmWCcsIDQpXG4gICAgLmF0dHIoJ21hcmtlcldpZHRoJywgOClcbiAgICAuYXR0cignbWFya2VySGVpZ2h0JywgOClcbiAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxuICAgIC5hcHBlbmQoJ3N2ZzpwYXRoJylcbiAgICAuYXR0cignZCcsICdNMTAsLTVMMCwwTDEwLDUnKVxuICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcblxuICAgIC8vIGxpbmUgZGlzcGxheWVkIHdoZW4gZHJhZ2dpbmcgbmV3IG5vZGVzXG52YXIgZHJhZ19saW5lID0gc3ZnLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgIC5hdHRyKCdjbGFzcycsICdkcmFnbGluZSBoaWRkZW4nKVxuICAgIC5hdHRyKCdkJywgJ00wLDBMMCwwJylcbjtcblxudmFyIGdTdGF0ZXMgPSBzdmcuc2VsZWN0QWxsKFwiZy5zdGF0ZVwiKS5kYXRhKHN0YXRlcyk7XG5cbnZhciB0cmFuc2l0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdGF0ZXMucmVkdWNlKCBmdW5jdGlvbiggaW5pdGlhbCwgc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGluaXRpYWwuY29uY2F0KCBcbiAgICAgICAgICAgIHN0YXRlLnRyYW5zaXRpb25zLm1hcCggZnVuY3Rpb24oIHRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzb3VyY2UgOiBzdGF0ZSwgdGFyZ2V0IDogdHJhbnNpdGlvbi50YXJnZXR9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9LCBbXSk7XG59O1xuICAgIC8vIGh0dHA6Ly93d3cuZGFzaGluZ2QzanMuY29tL3N2Zy1wYXRocy1hbmQtZDNqc1xudmFyIGNvbXB1dGVUcmFuc2l0aW9uUGF0aCA9IC8qZDMuc3ZnLmRpYWdvbmFsLnJhZGlhbCgpKi9mdW5jdGlvbiggZCkge1xuICAgIHZhciBkZWx0YVggPSBkLnRhcmdldC54IC0gZC5zb3VyY2UueCxcbiAgICBkZWx0YVkgPSBkLnRhcmdldC55IC0gZC5zb3VyY2UueSxcbiAgICBkaXN0ID0gTWF0aC5zcXJ0KGRlbHRhWCAqIGRlbHRhWCArIGRlbHRhWSAqIGRlbHRhWSksXG4gICAgbm9ybVggPSBkZWx0YVggLyBkaXN0LFxuICAgIG5vcm1ZID0gZGVsdGFZIC8gZGlzdCxcbiAgICBzb3VyY2VQYWRkaW5nID0gcmFkaXVzICsgMjsvL2QubGVmdCA/IDE3IDogMTIsXG4gICAgdGFyZ2V0UGFkZGluZyA9IHJhZGl1cyArIDY7Ly9kLnJpZ2h0ID8gMTcgOiAxMixcbiAgICBzb3VyY2VYID0gZC5zb3VyY2UueCArIChzb3VyY2VQYWRkaW5nICogbm9ybVgpLFxuICAgIHNvdXJjZVkgPSBkLnNvdXJjZS55ICsgKHNvdXJjZVBhZGRpbmcgKiBub3JtWSksXG4gICAgdGFyZ2V0WCA9IGQudGFyZ2V0LnggLSAodGFyZ2V0UGFkZGluZyAqIG5vcm1YKSxcbiAgICB0YXJnZXRZID0gZC50YXJnZXQueSAtICh0YXJnZXRQYWRkaW5nICogbm9ybVkpO1xuICAgIHJldHVybiAnTScgKyBzb3VyY2VYICsgJywnICsgc291cmNlWSArICdMJyArIHRhcmdldFggKyAnLCcgKyB0YXJnZXRZO1xufTtcblxudmFyIGdUcmFuc2l0aW9ucyA9IHN2Zy5hcHBlbmQoICdnJykuc2VsZWN0QWxsKCBcInBhdGgudHJhbnNpdGlvblwiKS5kYXRhKHRyYW5zaXRpb25zKTtcblxudmFyIHN0YXJ0U3RhdGUsIGVuZFN0YXRlOyAgICBcbnZhciBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG4ub24oXCJkcmFnXCIsIGZ1bmN0aW9uKCBkLCBpKSB7XG4gICAgaWYoIHN0YXJ0U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uID0gZDMuc2VsZWN0QWxsKCAnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiggc2VsZWN0aW9uWzBdLmluZGV4T2YoIHRoaXMpPT0tMSkge1xuICAgICAgICBzZWxlY3Rpb24uY2xhc3NlZCggXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgICAgIHNlbGVjdGlvbiA9IGQzLnNlbGVjdCggdGhpcyk7XG4gICAgICAgIHNlbGVjdGlvbi5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgIH0gXG5cbiAgICBzZWxlY3Rpb24uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiggZCwgaSkge1xuICAgICAgICBkLnggKz0gZDMuZXZlbnQuZHg7XG4gICAgICAgIGQueSArPSBkMy5ldmVudC5keTtcbiAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgWyBkLngsZC55IF0gKyBcIilcIlxuICAgIH0pXG4gICAgICAgIC8vIHJlYXBwZW5kIGRyYWdnZWQgZWxlbWVudCBhcyBsYXN0IFxuICAgICAgICAvLyBzbyB0aGF0IGl0cyBzdGF5cyBvbiB0b3AgXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCB0aGlzKTtcblxuICAgIGdUcmFuc2l0aW9ucy5hdHRyKCAnZCcsIGNvbXB1dGVUcmFuc2l0aW9uUGF0aCk7XG4gICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59KVxuLm9uKCBcImRyYWdlbmRcIiwgZnVuY3Rpb24oIGQpIHtcbiAgICAvLyBUT0RPIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDY2NzQwMS9jbGljay1ldmVudC1ub3QtZmlyaW5nLWFmdGVyLWRyYWctc29tZXRpbWVzLWluLWQzLWpzXG5cbiAgICAvLyBuZWVkZWQgYnkgRkZcbiAgICBkcmFnX2xpbmUuY2xhc3NlZCgnaGlkZGVuJywgdHJ1ZSkuc3R5bGUoJ21hcmtlci1lbmQnLCAnJyk7XG5cbiAgICBpZiggc3RhcnRTdGF0ZSAmJiBlbmRTdGF0ZSkge1xuICAgICAgICBzdGFydFN0YXRlLnRyYW5zaXRpb25zLnB1c2goIHsgbGFiZWwgOiBcInRyYW5zaXRpb24gbGFiZWwgMVwiLCB0YXJnZXQgOiBlbmRTdGF0ZX0pO1xuICAgICAgICByZXN0YXJ0KCk7XG4gICAgfVxuXG4gICAgc3RhcnRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbn0pO1xuXG5zdmcub24oIFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xuICAgIGlmKCAhZDMuZXZlbnQuY3RybEtleSkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnNlbGVjdGVkJykuY2xhc3NlZCggXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHAgPSBkMy5tb3VzZSh0aGlzKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiTW91c2UgRG93blwiKTtcbiAgICBzdmcuYXBwZW5kKCBcInJlY3RcIikuYXR0cih7XG4gICAgICAgIHJ4OiA2LCByeTogNiwgY2xhc3M6IFwic2VsZWN0aW9uXCIsIHg6IHBbMF0sIHk6IHBbMV0sIHdpZHRoOiAwLCBoZWlnaHQ6IDBcbiAgICB9KVxufSlcbi5vbiggXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHAgPSBkMy5tb3VzZSggdGhpcyksXG4gICAgICAgIHMgPSBzdmcuc2VsZWN0KCBcInJlY3Quc2VsZWN0aW9uXCIpO1xuXG4gICAgaWYoICFzLmVtcHR5KCkpIHtcbiAgICAgICAgdmFyIGQgPSB7IHg6cGFyc2VJbnQocy5hdHRyKFwieFwiKSwxMCkseTpwYXJzZUludChzLmF0dHIoXCJ5XCIpLDEwKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6cGFyc2VJbnQocy5hdHRyKFwid2lkdGhcIiksMTApLGhlaWdodDpwYXJzZUludChzLmF0dHIoIFwiaGVpZ2h0XCIpLCAxMCl9LFxuICAgICAgICBtb3ZlID0ge3ggOiBwWzBdIC0gZC54LFxuICAgICAgICAgICAgICAgIHkgOiBwWzFdIC0gZC55fTtcbiAgICAgICAgaWYoIG1vdmUueCA8IDEgfHwgKG1vdmUueCoyPGQud2lkdGgpKSB7XG4gICAgICAgICAgICBkLnggPSBwWzBdO1xuICAgICAgICAgICAgZC53aWR0aCAtPSBtb3ZlLng7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkLndpZHRoID0gbW92ZS54OyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBtb3ZlLnkgPCAxIHx8IChtb3ZlLnkqMjxkLmhlaWdodCkpIHtcbiAgICAgICAgICAgIGQueSA9IHBbMV07XG4gICAgICAgICAgICBkLmhlaWdodCAtPSBtb3ZlLnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkLmhlaWdodCA9IG1vdmUueTsgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcy5hdHRyKCBkKTtcbiAgICAgICAgICAgIC8vIGRlc2VsZWN0IGFsbCB0ZW1wb3Jhcnkgc2VsZWN0ZWQgc3RhdGUgb2JqZWN0c1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnN0YXRlLnNlbGVjdGlvbi5zZWxlY3RlZCcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnN0YXRlID5jaXJjbGUuaW5uZXInKS5lYWNoKCBmdW5jdGlvbiggc3RhdGVfZGF0YSwgaSkge1xuICAgICAgICAgICAgaWYoIFxuICAgICAgICAgICAgICAgICFkMy5zZWxlY3QoIHRoaXMpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIikgJiYgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlubmVyIGNpcmNsZSBpbnNpZGUgc2VsZWN0aW9uIGZyYW1lXG4gICAgICAgICAgICAgICAgc3RhdGVfZGF0YS54LXJhZGl1cz49ZC54ICYmIHN0YXRlX2RhdGEueCtyYWRpdXM8PWQueCtkLndpZHRoICYmIFxuICAgICAgICAgICAgICAgIHN0YXRlX2RhdGEueS1yYWRpdXM+PWQueSAmJiBzdGF0ZV9kYXRhLnkrcmFkaXVzPD1kLnkrZC5oZWlnaHRcbiAgICAgICAgICAgICkge1xuXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoIFwic2VsZWN0aW9uXCIsIHRydWUpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiggc3RhcnRTdGF0ZSkge1xuICAgICAgICAgICAgLy8gdXBkYXRlIGRyYWcgbGluZVxuICAgICAgICBkcmFnX2xpbmUuYXR0cignZCcsICdNJyArIHN0YXJ0U3RhdGUueCArICcsJyArIHN0YXJ0U3RhdGUueSArICdMJyArIHBbMF0gKyAnLCcgKyBwWzFdKTtcblxuICAgICAgICB2YXIgc3RhdGUgPSBkMy5zZWxlY3QoICdnLnN0YXRlLmhvdmVyJyk7XG4gICAgICAgIGVuZFN0YXRlID0gKCFzdGF0ZS5lbXB0eSgpICYmIHN0YXRlLmRhdGEoKVswXSkgfHwgdW5kZWZpbmVkO1xuICAgIH1cbn0pXG4ub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyByZW1vdmUgc2VsZWN0aW9uIGZyYW1lXG4gICAgc3ZnLnNlbGVjdEFsbCggXCJyZWN0LnNlbGVjdGlvblwiKS5yZW1vdmUoKTtcbiAgICAgICAgLy8gcmVtb3ZlIHRlbXBvcmFyeSBzZWxlY3Rpb24gbWFya2VyIGNsYXNzXG4gICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24nKS5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCBmYWxzZSk7XG59KVxuLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgaWYoIGQzLmV2ZW50LnJlbGF0ZWRUYXJnZXQudGFnTmFtZT09J0hUTUwnKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgc2VsZWN0aW9uIGZyYW1lXG4gICAgICAgIHN2Zy5zZWxlY3RBbGwoIFwicmVjdC5zZWxlY3Rpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGVtcG9yYXJ5IHNlbGVjdGlvbiBtYXJrZXIgY2xhc3NcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24nKS5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCBmYWxzZSk7XG4gICAgfVxufSk7XG5yZXN0YXJ0KCk7XG5mdW5jdGlvbiByZXN0YXJ0KCkge1xuICAgIGNvbnNvbGUubG9nKFwiUkVTVEFSVFwiKTtcbiAgICBcbiAgICBnU3RhdGVzID0gZ1N0YXRlcy5kYXRhKHN0YXRlcyk7XG4gICAgdmFyIGdTdGF0ZSA9IGdTdGF0ZXMuZW50ZXIoKS5hcHBlbmQoIFwiZ1wiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICBcInRyYW5zZm9ybVwiIDogZnVuY3Rpb24oIGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIrIFtkLngsZC55XSArIFwiKVwiO1xuICAgICAgICAgICAgfSwnY2xhc3MnOiAnc3RhdGUnLCdkYXRhLWlkJzpmdW5jdGlvbihkKXsgcmV0dXJuIGQuaW5kZXh9IFxuICAgICAgICB9KS5jYWxsKCBkcmFnKTtcbiAgICAvKmdTdGF0ZS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgLy9yeDogNSx3aWR0aDo4MCxoZWlnaHQ6ODBcbiAgICAgICAgICAgIHIgICAgICAgOiByYWRpdXMgKyAxMDAsXG4gICAgICAgICAgICBjbGFzcyAgIDogJ291dGVyJ1xuICAgICAgICB9KVxuICAgICAgICAub24oIFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCBkKSB7XG4gICAgICAgICAgICBzdGFydFN0YXRlID0gZCwgZW5kU3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAvLyByZXBvc2l0aW9uIGRyYWcgbGluZVxuICAgICAgICAgICAgZHJhZ19saW5lXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdtYXJrZXItZW5kJywgJ3VybCgjZW5kLWFycm93KScpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoJ2hpZGRlbicsIGZhbHNlKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgJ00nICsgZC54ICsgJywnICsgZC55ICsgJ0wnICsgZC54ICsgJywnICsgZC55KVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAgICAgLy8gZm9yY2UgZWxlbWVudCB0byBiZSBhbiB0b3BcbiAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCB0aGlzLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coIFwibW91c2Vkb3duXCIsIHN0YXJ0U3RhdGUpO1xuICAgICAgICB9KTsqL1xuICAgIGdTdGF0ZS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoe3I6NDAsY2xhc3M6J2lubmVyJ30pXG4gICAgLm9uKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZCxpKXtcbiAgICAgICAgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpLmNsYXNzZWQoIFwiaG92ZXJcIiwgdHJ1ZSk7fSlcbiAgICAub24oXCJjbGlja1wiLGZ1bmN0aW9uKGQsaSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ0xJQ0tFRFwiKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wYXJlbnROb2RlKTtcbiAgICB9KTtcbiAgICAvL2dTdGF0ZS5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt9KTtcbiAgICAvKmdTdGF0ZS5hcHBlbmQoIFwiY2lyY2xlXCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIC8vcng6IDUsd2lkdGg6ODAsaGVpZ2h0OjgwLFxuICAgICAgICAgICAgciAgICAgICA6IHJhZGl1cyxcbiAgICAgICAgICAgIGNsYXNzICAgOiAnaW5uZXInXG4gICAgICAgIH0pXG4gICAgICAgIC5vbiggXCJjbGlja1wiLCBmdW5jdGlvbiggZCwgaSkge1xuICAgICAgICAgICAgdmFyIGUgPSBkMy5ldmVudCxcbiAgICAgICAgICAgICAgICBnID0gdGhpcy5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQgPSBkMy5zZWxlY3QoIGcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIik7XG5cbiAgICAgICAgICAgIGlmKCAhZS5jdHJsS2V5KSB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zZWxlY3RlZCcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZDMuc2VsZWN0KCBnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIsICFpc1NlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAvLyByZWFwcGVuZCBkcmFnZ2VkIGVsZW1lbnQgYXMgbGFzdCBcbiAgICAgICAgICAgICAgICAvLyBzbyB0aGF0IGl0cyBzdGF5cyBvbiB0b3AgXG4gICAgICAgICAgICBnLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIGcpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGQzLnNlbGVjdCggdGhpcy5wYXJlbnROb2RlKS5jbGFzc2VkKCBcImhvdmVyXCIsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICBkMy5zZWxlY3QoIHRoaXMucGFyZW50Tm9kZSkuY2xhc3NlZCggXCJob3ZlclwiLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIDsqL1xuXG4gICAgZ1N0YXRlLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgJ3RleHQtYW5jaG9yJyAgIDogJ21pZGRsZScsXG4gICAgICAgICAgICB5ICAgICAgICAgICAgICAgOiA0LFxuICAgICAgICAgICAgY2xhc3MgICAgICAgICAgIDogJ3RpdGxlJ1xuICAgICAgICB9KVxuICAgICAgICAudGV4dCggZnVuY3Rpb24oIGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICB9KVxuICAgIDtcbiAgICBnU3RhdGUuYXBwZW5kKCBcInRpdGxlXCIpLnRleHQoIGZ1bmN0aW9uKCBkKSB7XG4gICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgIH0pO1xuICAgIGdTdGF0ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgZ1RyYW5zaXRpb25zID0gZ1RyYW5zaXRpb25zLmRhdGEoIHRyYW5zaXRpb25zKTtcbiAgICBnVHJhbnNpdGlvbnMuZW50ZXIoKS5hcHBlbmQoICdwYXRoJylcbiAgICAgICAgLmF0dHIoICdjbGFzcycsICd0cmFuc2l0aW9uJylcbiAgICAgICAgLmF0dHIoICdkJywgY29tcHV0ZVRyYW5zaXRpb25QYXRoKVxuICAgIDsgICBcbiAgICBnVHJhbnNpdGlvbnMuZXhpdCgpLnJlbW92ZSgpO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEEgZ3JhcGggZGF0YSBzdHJ1Y3R1cmUgd2l0aCBkZXB0aC1maXJzdCBzZWFyY2ggYW5kIHRvcG9sb2dpY2FsIHNvcnQuXG5mdW5jdGlvbiBHcmFwaChzZXJpYWxpemVkKSB7XG4gICAgLy8gUmV0dXJuZWQgZ3JhcGggaW5zdGFuY2VcbiAgICB2YXIgZ3JhcGggPSB7XG4gICAgICAgIGFkZE5vZGU6IGFkZE5vZGUsXG4gICAgICAgIHJlbW92ZU5vZGU6IHJlbW92ZU5vZGUsXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgYWRqYWNlbnQ6IGFkamFjZW50LFxuICAgICAgICBhZGRFZGdlOiBhZGRFZGdlLFxuICAgICAgICByZW1vdmVFZGdlOiByZW1vdmVFZGdlLFxuICAgICAgICBzZXRFZGdlV2VpZ2h0OiBzZXRFZGdlV2VpZ2h0LFxuICAgICAgICBnZXRFZGdlV2VpZ2h0OiBnZXRFZGdlV2VpZ2h0LFxuICAgICAgICBpbmRlZ3JlZTogaW5kZWdyZWUsXG4gICAgICAgIG91dGRlZ3JlZTogb3V0ZGVncmVlLFxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoOiBkZXB0aEZpcnN0U2VhcmNoLFxuICAgICAgICBsb3dlc3RDb21tb25BbmNlc3RvcnM6IGxvd2VzdENvbW1vbkFuY2VzdG9ycyxcbiAgICAgICAgdG9wb2xvZ2ljYWxTb3J0OiB0b3BvbG9naWNhbFNvcnQsXG4gICAgICAgIHNob3J0ZXN0UGF0aDogc2hvcnRlc3RQYXRoLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplXG4gICAgfTtcbiAgICAvLyBUaGUgYWRqYWNlbmN5IGxpc3Qgb2YgdGhlIGdyYXBoLlxuICAgIC8vIEtleXMgYXJlIG5vZGUgaWRzLlxuICAgIC8vIFZhbHVlcyBhcmUgYWRqYWNlbnQgbm9kZSBpZCBhcnJheXMuXG4gICAgdmFyIGVkZ2VzID0ge307XG4gICAgLy8gVGhlIHdlaWdodHMgb2YgZWRnZXMuXG4gICAgLy8gS2V5cyBhcmUgc3RyaW5nIGVuY29kaW5ncyBvZiBlZGdlcy5cbiAgICAvLyBWYWx1ZXMgYXJlIHdlaWdodHMgKG51bWJlcnMpLlxuICAgIHZhciBlZGdlV2VpZ2h0cyA9IHt9O1xuICAgIC8vIElmIGEgc2VyaWFsaXplZCBncmFwaCB3YXMgcGFzc2VkIGludG8gdGhlIGNvbnN0cnVjdG9yLCBkZXNlcmlhbGl6ZSBpdC5cbiAgICBpZiAoc2VyaWFsaXplZCkge1xuICAgICAgICBkZXNlcmlhbGl6ZShzZXJpYWxpemVkKTtcbiAgICB9XG4gICAgLy8gQWRkcyBhIG5vZGUgdG8gdGhlIGdyYXBoLlxuICAgIC8vIElmIG5vZGUgd2FzIGFscmVhZHkgYWRkZWQsIHRoaXMgZnVuY3Rpb24gZG9lcyBub3RoaW5nLlxuICAgIC8vIElmIG5vZGUgd2FzIG5vdCBhbHJlYWR5IGFkZGVkLCB0aGlzIGZ1bmN0aW9uIHNldHMgdXAgYW4gZW1wdHkgYWRqYWNlbmN5IGxpc3QuXG4gICAgZnVuY3Rpb24gYWRkTm9kZShub2RlKSB7XG4gICAgICAgIGVkZ2VzW25vZGVdID0gYWRqYWNlbnQobm9kZSk7XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gUmVtb3ZlcyBhIG5vZGUgZnJvbSB0aGUgZ3JhcGguXG4gICAgLy8gQWxzbyByZW1vdmVzIGluY29taW5nIGFuZCBvdXRnb2luZyBlZGdlcy5cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGluY29taW5nIGVkZ2VzLlxuICAgICAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgZWRnZXNbdV0uZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICh2ID09PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUVkZ2UodSwgdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZW1vdmUgb3V0Z29pbmcgZWRnZXMgKGFuZCBzaWduYWwgdGhhdCB0aGUgbm9kZSBubyBsb25nZXIgZXhpc3RzKS5cbiAgICAgICAgZGVsZXRlIGVkZ2VzW25vZGVdO1xuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIEdldHMgdGhlIGxpc3Qgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGdyYXBoLlxuICAgIGZ1bmN0aW9uIG5vZGVzKCkge1xuICAgICAgICAvLyBUT0RPOiBCZXR0ZXIgaW1wbGVtZW50YXRpb24gd2l0aCBzZXQgZGF0YSBzdHJ1Y3R1cmVcbiAgICAgICAgdmFyIG5vZGVTZXQgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIG5vZGVTZXRbdV0gPSB0cnVlO1xuICAgICAgICAgICAgZWRnZXNbdV0uZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIG5vZGVTZXRbdl0gPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobm9kZVNldCk7XG4gICAgfVxuICAgIC8vIEdldHMgdGhlIGFkamFjZW50IG5vZGUgbGlzdCBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgLy8gUmV0dXJucyBhbiBlbXB0eSBhcnJheSBmb3IgdW5rbm93biBub2Rlcy5cbiAgICBmdW5jdGlvbiBhZGphY2VudChub2RlKSB7XG4gICAgICAgIHJldHVybiBlZGdlc1tub2RlXSB8fCBbXTtcbiAgICB9XG4gICAgLy8gQ29tcHV0ZXMgYSBzdHJpbmcgZW5jb2Rpbmcgb2YgYW4gZWRnZSxcbiAgICAvLyBmb3IgdXNlIGFzIGEga2V5IGluIGFuIG9iamVjdC5cbiAgICBmdW5jdGlvbiBlbmNvZGVFZGdlKHUsIHYpIHtcbiAgICAgICAgcmV0dXJuIHUgKyBcInxcIiArIHY7XG4gICAgfVxuICAgIC8vIFNldHMgdGhlIHdlaWdodCBvZiB0aGUgZ2l2ZW4gZWRnZS5cbiAgICBmdW5jdGlvbiBzZXRFZGdlV2VpZ2h0KHUsIHYsIHdlaWdodCkge1xuICAgICAgICBlZGdlV2VpZ2h0c1tlbmNvZGVFZGdlKHUsIHYpXSA9IHdlaWdodDtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBHZXRzIHRoZSB3ZWlnaHQgb2YgdGhlIGdpdmVuIGVkZ2UuXG4gICAgLy8gUmV0dXJucyAxIGlmIG5vIHdlaWdodCB3YXMgcHJldmlvdXNseSBzZXQuXG4gICAgZnVuY3Rpb24gZ2V0RWRnZVdlaWdodCh1LCB2KSB7XG4gICAgICAgIHZhciB3ZWlnaHQgPSBlZGdlV2VpZ2h0c1tlbmNvZGVFZGdlKHUsIHYpXTtcbiAgICAgICAgcmV0dXJuIHdlaWdodCA9PT0gdW5kZWZpbmVkID8gMSA6IHdlaWdodDtcbiAgICB9XG4gICAgLy8gQWRkcyBhbiBlZGdlIGZyb20gbm9kZSB1IHRvIG5vZGUgdi5cbiAgICAvLyBJbXBsaWNpdGx5IGFkZHMgdGhlIG5vZGVzIGlmIHRoZXkgd2VyZSBub3QgYWxyZWFkeSBhZGRlZC5cbiAgICBmdW5jdGlvbiBhZGRFZGdlKHUsIHYsIHdlaWdodCkge1xuICAgICAgICBhZGROb2RlKHUpO1xuICAgICAgICBhZGROb2RlKHYpO1xuICAgICAgICBhZGphY2VudCh1KS5wdXNoKHYpO1xuICAgICAgICBpZiAod2VpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldEVkZ2VXZWlnaHQodSwgdiwgd2VpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIFJlbW92ZXMgdGhlIGVkZ2UgZnJvbSBub2RlIHUgdG8gbm9kZSB2LlxuICAgIC8vIERvZXMgbm90IHJlbW92ZSB0aGUgbm9kZXMuXG4gICAgLy8gRG9lcyBub3RoaW5nIGlmIHRoZSBlZGdlIGRvZXMgbm90IGV4aXN0LlxuICAgIGZ1bmN0aW9uIHJlbW92ZUVkZ2UodSwgdikge1xuICAgICAgICBpZiAoZWRnZXNbdV0pIHtcbiAgICAgICAgICAgIGVkZ2VzW3VdID0gYWRqYWNlbnQodSkuZmlsdGVyKGZ1bmN0aW9uIChfdikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdiAhPT0gdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gQ29tcHV0ZXMgdGhlIGluZGVncmVlIGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgICAvLyBOb3QgdmVyeSBlZmZpY2llbnQsIGNvc3RzIE8oRSkgd2hlcmUgRSA9IG51bWJlciBvZiBlZGdlcy5cbiAgICBmdW5jdGlvbiBpbmRlZ3JlZShub2RlKSB7XG4gICAgICAgIHZhciBkZWdyZWUgPSAwO1xuICAgICAgICBmdW5jdGlvbiBjaGVjayh2KSB7XG4gICAgICAgICAgICBpZiAodiA9PT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIGRlZ3JlZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICBlZGdlc1t1XS5mb3JFYWNoKGNoZWNrKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWdyZWU7XG4gICAgfVxuICAgIC8vIENvbXB1dGVzIHRoZSBvdXRkZWdyZWUgZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIGZ1bmN0aW9uIG91dGRlZ3JlZShub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlIGluIGVkZ2VzID8gZWRnZXNbbm9kZV0ubGVuZ3RoIDogMDtcbiAgICB9XG4gICAgLy8gRGVwdGggRmlyc3QgU2VhcmNoIGFsZ29yaXRobSwgaW5zcGlyZWQgYnlcbiAgICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDYwNFxuICAgIC8vIFRoaXMgdmFyaWFudCBpbmNsdWRlcyBhbiBhZGRpdGlvbmFsIG9wdGlvblxuICAgIC8vIGBpbmNsdWRlU291cmNlTm9kZXNgIHRvIHNwZWNpZnkgd2hldGhlciB0byBpbmNsdWRlIG9yXG4gICAgLy8gZXhjbHVkZSB0aGUgc291cmNlIG5vZGVzIGZyb20gdGhlIHJlc3VsdCAodHJ1ZSBieSBkZWZhdWx0KS5cbiAgICAvLyBJZiBgc291cmNlTm9kZXNgIGlzIG5vdCBzcGVjaWZpZWQsIGFsbCBub2RlcyBpbiB0aGUgZ3JhcGhcbiAgICAvLyBhcmUgdXNlZCBhcyBzb3VyY2Ugbm9kZXMuXG4gICAgZnVuY3Rpb24gZGVwdGhGaXJzdFNlYXJjaChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKSB7XG4gICAgICAgIGlmIChpbmNsdWRlU291cmNlTm9kZXMgPT09IHZvaWQgMCkgeyBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlOyB9XG4gICAgICAgIGlmICghc291cmNlTm9kZXMpIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzID0gbm9kZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGluY2x1ZGVTb3VyY2VOb2RlcyAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIGluY2x1ZGVTb3VyY2VOb2RlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZpc2l0ZWQgPSB7fTtcbiAgICAgICAgdmFyIG5vZGVMaXN0ID0gW107XG4gICAgICAgIGZ1bmN0aW9uIERGU1Zpc2l0KG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghdmlzaXRlZFtub2RlXSkge1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFkamFjZW50KG5vZGUpLmZvckVhY2goREZTVmlzaXQpO1xuICAgICAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluY2x1ZGVTb3VyY2VOb2Rlcykge1xuICAgICAgICAgICAgc291cmNlTm9kZXMuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlTGlzdDtcbiAgICB9XG4gICAgLy8gTGVhc3QgQ29tbW9uIEFuY2VzdG9yc1xuICAgIC8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9yZWxheGVkd3MvbGNhL2Jsb2IvbWFzdGVyL3NyYy9Mb3dlc3RDb21tb25BbmNlc3Rvci5waHAgY29kZVxuICAgIC8vIGJ1dCB1c2VzIGRlcHRoIHNlYXJjaCBpbnN0ZWFkIG9mIGJyZWFkdGguIEFsc28gdXNlcyBzb21lIG9wdGltaXphdGlvbnNcbiAgICBmdW5jdGlvbiBsb3dlc3RDb21tb25BbmNlc3RvcnMobm9kZTEsIG5vZGUyKSB7XG4gICAgICAgIHZhciBub2RlMUFuY2VzdG9ycyA9IFtdO1xuICAgICAgICB2YXIgbGNhcyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBDQTFWaXNpdCh2aXNpdGVkLCBub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWRbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBub2RlMUFuY2VzdG9ycy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG5vZGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxjYXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBmb3VuZCAtIHNob3J0Y3V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhZGphY2VudChub2RlKS5ldmVyeShmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ0ExVmlzaXQodmlzaXRlZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBDQTJWaXNpdCh2aXNpdGVkLCBub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWRbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZTFBbmNlc3RvcnMuaW5kZXhPZihub2RlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxjYXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGNhcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDQTJWaXNpdCh2aXNpdGVkLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChDQTFWaXNpdCh7fSwgbm9kZTEpKSB7XG4gICAgICAgICAgICAvLyBObyBzaG9ydGN1dCB3b3JrZWRcbiAgICAgICAgICAgIENBMlZpc2l0KHt9LCBub2RlMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxjYXM7XG4gICAgfVxuICAgIC8vIFRoZSB0b3BvbG9naWNhbCBzb3J0IGFsZ29yaXRobSB5aWVsZHMgYSBsaXN0IG9mIHZpc2l0ZWQgbm9kZXNcbiAgICAvLyBzdWNoIHRoYXQgZm9yIGVhY2ggdmlzaXRlZCBlZGdlICh1LCB2KSwgdSBjb21lcyBiZWZvcmUgdiBpbiB0aGUgbGlzdC5cbiAgICAvLyBBbWF6aW5nbHksIHRoaXMgY29tZXMgZnJvbSBqdXN0IHJldmVyc2luZyB0aGUgcmVzdWx0IGZyb20gZGVwdGggZmlyc3Qgc2VhcmNoLlxuICAgIC8vIENvcm1lbiBldCBhbC4gXCJJbnRyb2R1Y3Rpb24gdG8gQWxnb3JpdGhtc1wiIDNyZCBFZC4gcC4gNjEzXG4gICAgZnVuY3Rpb24gdG9wb2xvZ2ljYWxTb3J0KHNvdXJjZU5vZGVzLCBpbmNsdWRlU291cmNlTm9kZXMpIHtcbiAgICAgICAgaWYgKGluY2x1ZGVTb3VyY2VOb2RlcyA9PT0gdm9pZCAwKSB7IGluY2x1ZGVTb3VyY2VOb2RlcyA9IHRydWU7IH1cbiAgICAgICAgcmV0dXJuIGRlcHRoRmlyc3RTZWFyY2goc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2RlcykucmV2ZXJzZSgpO1xuICAgIH1cbiAgICAvLyBEaWprc3RyYSdzIFNob3J0ZXN0IFBhdGggQWxnb3JpdGhtLlxuICAgIC8vIENvcm1lbiBldCBhbC4gXCJJbnRyb2R1Y3Rpb24gdG8gQWxnb3JpdGhtc1wiIDNyZCBFZC4gcC4gNjU4XG4gICAgLy8gVmFyaWFibGUgYW5kIGZ1bmN0aW9uIG5hbWVzIGNvcnJlc3BvbmQgdG8gbmFtZXMgaW4gdGhlIGJvb2suXG4gICAgZnVuY3Rpb24gc2hvcnRlc3RQYXRoKHNvdXJjZSwgZGVzdGluYXRpb24pIHtcbiAgICAgICAgLy8gVXBwZXIgYm91bmRzIGZvciBzaG9ydGVzdCBwYXRoIHdlaWdodHMgZnJvbSBzb3VyY2UuXG4gICAgICAgIHZhciBkID0ge307XG4gICAgICAgIC8vIFByZWRlY2Vzc29ycy5cbiAgICAgICAgdmFyIHAgPSB7fTtcbiAgICAgICAgLy8gUG9vciBtYW4ncyBwcmlvcml0eSBxdWV1ZSwga2V5ZWQgb24gZC5cbiAgICAgICAgdmFyIHEgPSB7fTtcbiAgICAgICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNpbmdsZVNvdXJjZSgpIHtcbiAgICAgICAgICAgIG5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGRbbm9kZV0gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGRbc291cmNlXSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb3VyY2Ugbm9kZSBpcyBub3QgaW4gdGhlIGdyYXBoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRbZGVzdGluYXRpb25dICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlc3RpbmF0aW9uIG5vZGUgaXMgbm90IGluIHRoZSBncmFwaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRbc291cmNlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkcyBlbnRyaWVzIGluIHEgZm9yIGFsbCBub2Rlcy5cbiAgICAgICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVByaW9yaXR5UXVldWUoKSB7XG4gICAgICAgICAgICBub2RlcygpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBxW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybnMgdHJ1ZSBpZiBxIGlzIGVtcHR5LlxuICAgICAgICBmdW5jdGlvbiBwcmlvcml0eVF1ZXVlRW1wdHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocSkubGVuZ3RoID09PSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIExpbmVhciBzZWFyY2ggdG8gZXh0cmFjdCAoZmluZCBhbmQgcmVtb3ZlKSBtaW4gZnJvbSBxLlxuICAgICAgICBmdW5jdGlvbiBleHRyYWN0TWluKCkge1xuICAgICAgICAgICAgdmFyIG1pbiA9IEluZmluaXR5O1xuICAgICAgICAgICAgdmFyIG1pbk5vZGU7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhxKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRbbm9kZV0gPCBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gZFtub2RlXTtcbiAgICAgICAgICAgICAgICAgICAgbWluTm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobWluTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2ggaGVyZSwgdGhlcmUncyBhIGRpc2Nvbm5lY3RlZCBzdWJncmFwaCwgYW5kIHdlJ3JlIGRvbmUuXG4gICAgICAgICAgICAgICAgcSA9IHt9O1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIHFbbWluTm9kZV07XG4gICAgICAgICAgICByZXR1cm4gbWluTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZWxheCh1LCB2KSB7XG4gICAgICAgICAgICB2YXIgdyA9IGdldEVkZ2VXZWlnaHQodSwgdik7XG4gICAgICAgICAgICBpZiAoZFt2XSA+IGRbdV0gKyB3KSB7XG4gICAgICAgICAgICAgICAgZFt2XSA9IGRbdV0gKyB3O1xuICAgICAgICAgICAgICAgIHBbdl0gPSB1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRpamtzdHJhKCkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZVNpbmdsZVNvdXJjZSgpO1xuICAgICAgICAgICAgaW5pdGlhbGl6ZVByaW9yaXR5UXVldWUoKTtcbiAgICAgICAgICAgIHdoaWxlICghcHJpb3JpdHlRdWV1ZUVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdSA9IGV4dHJhY3RNaW4oKTtcbiAgICAgICAgICAgICAgICBpZiAodSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGFkamFjZW50KHUpLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVsYXgodSwgdik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXNzZW1ibGVzIHRoZSBzaG9ydGVzdCBwYXRoIGJ5IHRyYXZlcnNpbmcgdGhlXG4gICAgICAgIC8vIHByZWRlY2Vzc29yIHN1YmdyYXBoIGZyb20gZGVzdGluYXRpb24gdG8gc291cmNlLlxuICAgICAgICBmdW5jdGlvbiBwYXRoKCkge1xuICAgICAgICAgICAgdmFyIG5vZGVMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgd2VpZ2h0ID0gMDtcbiAgICAgICAgICAgIHZhciBub2RlID0gZGVzdGluYXRpb247XG4gICAgICAgICAgICB3aGlsZSAocFtub2RlXSkge1xuICAgICAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ICs9IGdldEVkZ2VXZWlnaHQocFtub2RlXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZSA9IHBbbm9kZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gcGF0aCBmb3VuZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICBub2RlTGlzdC5yZXZlcnNlKCk7XG4gICAgICAgICAgICBub2RlTGlzdC53ZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgICAgICByZXR1cm4gbm9kZUxpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZGlqa3N0cmEoKTtcbiAgICAgICAgcmV0dXJuIHBhdGgoKTtcbiAgICB9XG4gICAgLy8gU2VyaWFsaXplcyB0aGUgZ3JhcGguXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplKCkge1xuICAgICAgICB2YXIgc2VyaWFsaXplZCA9IHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcygpLm1hcChmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWQgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbGlua3M6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHNlcmlhbGl6ZWQubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGUuaWQ7XG4gICAgICAgICAgICBhZGphY2VudChzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWQubGlua3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiBnZXRFZGdlV2VpZ2h0KHNvdXJjZSwgdGFyZ2V0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZDtcbiAgICB9XG4gICAgLy8gRGVzZXJpYWxpemVzIHRoZSBnaXZlbiBzZXJpYWxpemVkIGdyYXBoLlxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplKHNlcmlhbGl6ZWQpIHtcbiAgICAgICAgc2VyaWFsaXplZC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBhZGROb2RlKG5vZGUuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VyaWFsaXplZC5saW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG4gICAgICAgICAgICBhZGRFZGdlKGxpbmsuc291cmNlLCBsaW5rLnRhcmdldCwgbGluay53ZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBUaGUgcmV0dXJuZWQgZ3JhcGggaW5zdGFuY2UuXG4gICAgcmV0dXJuIGdyYXBoO1xufVxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcbiJdfQ==
