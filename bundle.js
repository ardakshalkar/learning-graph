(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function showInformation(id){
    let details = document.querySelector("#details");
    details.innerHTML = graphData[id].title+"<br/>"+graphData[id].description;
}
function initializeSVG(){
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
}

let width = 960,height = 500, depth_limit = 10, lane_limit = 5;
var Graph = require("graph-data-structure");
let graphData = {
    "CSS 101":{title:"Create Phonebook",description:"Create Phonebook, where data is stored in file"},
    "CSS 102":{title:"String class",description:"Implement String class, without using standard Java String"},
    "CSS 103":{title:"Bank cashier", description:"Implement Bank cashier"},
    "CSS 104":{title:"Chess",description:"Chess game"},
    "CSS 105":{title:"Landing page",description:"Implement landing page"},
    "CSS 106":{title:"Create E-commerse store",description:"You should create e-commerce page where users can buy items"}
};
let graph = Graph();
graph.addNode("CSS 101").addNode("CSS 102").addNode("CSS 103")
        .addNode("CSS 104").addNode("CSS 105").addNode("CSS 106");
graph.addEdge("CSS 101","CSS 102");
graph.addEdge("CSS 101","CSS 103");
graph.addEdge("CSS 102","CSS 104");
graph.addEdge("CSS 102","CSS 105");
graph.addEdge("CSS 103","CSS 105");
graph.addEdge("CSS 102","CSS 106");
graph.addEdge("CSS 104","CSS 106");
let root = "CSS 101";
var radius = 40;
window.states = [];

for (let node of graph.nodes()){
    newNode = {index:0,x:0,y:0,label:node,transitions:[]};
    graphData[node].windowState = newNode;
    window.states.push(newNode);
}

let nodes = [root];
for (let depth=0;depth<depth_limit;depth++){
    let x = width/(depth_limit*2)*(depth*2+1);
    let adjacentNodes = [];
    for (let i=0;i<nodes.length;i++){
        let node = nodes[i];
        y = height / (lane_limit*2)* (i*2+1)
        newNode = {index:0,x:x,y:y,label:node,transitions:[]};
        graphData[node].windowState = newNode;
        window.states.push(newNode);
        //console.log(graph.adjacent(node));
        adjacentNodes = adjacentNodes.concat(graph.adjacent(node));
        //console.log(adjacentNodes);
    }
    //console.log(adjacentNodes);
    nodes = [...new Set(adjacentNodes)];
}
for (let i=0;i<window.states.length;i++){
    let nodeState = window.states[i];
    //console.log(node);
    let adjNodes = graph.adjacent(nodeState.label);
    //console.log(adjNodes);
    for (let adjNode of adjNodes){
        console.log(adjNode);
        //nodeState.transitions.push({label:'whoo',target:window.states[adjNode]});
        nodeState.transitions.push({label:'whoo',target:graphData[adjNode].windowState});
    }
}


/*
let x = width/(depth*2), y = height/(lane_limit*2);
let newNode = {index:0,x:x,y:y,label:root,transitions:[]};
graphData[root].windowState = newNode;
window.states.push(newNode);

let adjacentNodes = graph.adjacent(root);
x = width/(depth*2)*3, y = height/(lane_limit*2);
console.log(adjacentNodes);
for (let i=0;i<adjacentNodes.length;i++){
    let node = adjacentNodes[i];
    y = height/(lane_limit*2)*(i*2+1);
    newNode = {index:0,x:x,y:y,label:node,transitions:[]};
    graphData[node].windowState = newNode;
    window.states.push(newNode);
}*/

/*let x = 40;let y=40;let index= 0;
let nodes = graph.nodes();
for (let i=0;i<nodes.length;i++){
    let node = nodes[i];
    let newNode = {index:index,x:x,y:y,label:node,transitions:[]};
    graphData[node].windowState = newNode;
    //window.states[node] = newNode;
    window.states.push(newNode);
    x = x+100; y = y+100; index = index+1;
}
for (let i=0;i<window.states.length;i++){
    let nodeState = window.states[i];
    //console.log(node);
    let adjNodes = graph.adjacent(nodeState.label);
    //console.log(adjNodes);
    for (let adjNode of adjNodes){
        console.log(adjNode);
        //nodeState.transitions.push({label:'whoo',target:window.states[adjNode]});
        nodeState.transitions.push({label:'whoo',target:graphData[adjNode].windowState});
    }
}*/
console.log("Hello World");
initializeSVG();



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
    //drag_line.classed('hidden', true).style('marker-end', '');

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
    svg.append( "rect").attr({ rx: 6, ry: 6, class: "selection", x: p[0], y: p[1], width: 0, height: 0 })
})
.on( "mousemove", function() {
    var p = d3.mouse( this), s = svg.select("rect.selection");

    if( !s.empty()) {
        var d = { x:parseInt(s.attr("x"),10),y:parseInt(s.attr("y"),10),
                    width:parseInt(s.attr("width"),10),height:parseInt(s.attr( "height"), 10)},
        move = {x : p[0] - d.x, y : p[1] - d.y};
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
            if(!d3.select( this).classed( "selected") && 
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
        .attr({ "transform" : function( d) { return "translate("+ [d.x,d.y] + ")";
            },'class': 'state','data-id':function(d){
                //console.log(d);
                return d.label;
            } 
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
        console.log(this.parentNode.dataset.id);
        showInformation(this.parentNode.dataset.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJub2RlX21vZHVsZXMvZ3JhcGgtZGF0YS1zdHJ1Y3R1cmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIHNob3dJbmZvcm1hdGlvbihpZCl7XG4gICAgbGV0IGRldGFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RldGFpbHNcIik7XG4gICAgZGV0YWlscy5pbm5lckhUTUwgPSBncmFwaERhdGFbaWRdLnRpdGxlK1wiPGJyLz5cIitncmFwaERhdGFbaWRdLmRlc2NyaXB0aW9uO1xufVxuZnVuY3Rpb24gaW5pdGlhbGl6ZVNWRygpe1xuICAgIHdpbmRvdy5zdmcgPSBkMy5zZWxlY3QoJ2JvZHknKVxuICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAvLy5hdHRyKFwidmlld0JveFwiLCBcIjAgMCBcIiArIDEwMDAgKyBcIiBcIiArIDEwMDAgKVxuICAgIC8vLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pbllNaW5cIilcbiAgICAuYXR0cihcIndpZHRoXCIsIFwiOTYwcHhcIilcbiAgICAuYXR0cihcImhlaWdodFwiLCBcIjUwMHB4XCIpOyAgICBcbiAgICBcbiAgICAgICAgLy8gZGVmaW5lIGFycm93IG1hcmtlcnMgZm9yIGdyYXBoIGxpbmtzXG4gICAgc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKS5hcHBlbmQoJ3N2ZzptYXJrZXInKVxuICAgICAgICAuYXR0cignaWQnLCAnZW5kLWFycm93JylcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAtNSAxMCAxMCcpXG4gICAgICAgIC5hdHRyKCdyZWZYJywgMylcbiAgICAgICAgLmF0dHIoJ21hcmtlcldpZHRoJywgOClcbiAgICAgICAgLmF0dHIoJ21hcmtlckhlaWdodCcsIDgpXG4gICAgICAgIC5hdHRyKCdvcmllbnQnLCAnYXV0bycpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZzpwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsLTVMMTAsMEwwLDUnKVxuICAgICAgICAuYXR0cignZmlsbCcsICcjMDAwJyk7XG4gICAgXG4gICAgc3ZnLmFwcGVuZCgnc3ZnOmRlZnMnKS5hcHBlbmQoJ3N2ZzptYXJrZXInKVxuICAgICAgICAuYXR0cignaWQnLCAnc3RhcnQtYXJyb3cnKVxuICAgICAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAgICAgLmF0dHIoJ3JlZlgnLCA0KVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnLCA4KVxuICAgICAgICAuYXR0cignbWFya2VySGVpZ2h0JywgOClcbiAgICAgICAgLmF0dHIoJ29yaWVudCcsICdhdXRvJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignZCcsICdNMTAsLTVMMCwwTDEwLDUnKVxuICAgICAgICAuYXR0cignZmlsbCcsICcjMDAwJyk7XG4gICAgXG4gICAgICAgIC8vIGxpbmUgZGlzcGxheWVkIHdoZW4gZHJhZ2dpbmcgbmV3IG5vZGVzXG4gICAgdmFyIGRyYWdfbGluZSA9IHN2Zy5hcHBlbmQoJ3N2ZzpwYXRoJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RyYWdsaW5lIGhpZGRlbicpXG4gICAgICAgIC5hdHRyKCdkJywgJ00wLDBMMCwwJylcbiAgICA7XG59XG5cbmxldCB3aWR0aCA9IDk2MCxoZWlnaHQgPSA1MDAsIGRlcHRoX2xpbWl0ID0gMTAsIGxhbmVfbGltaXQgPSA1O1xudmFyIEdyYXBoID0gcmVxdWlyZShcImdyYXBoLWRhdGEtc3RydWN0dXJlXCIpO1xubGV0IGdyYXBoRGF0YSA9IHtcbiAgICBcIkNTUyAxMDFcIjp7dGl0bGU6XCJDcmVhdGUgUGhvbmVib29rXCIsZGVzY3JpcHRpb246XCJDcmVhdGUgUGhvbmVib29rLCB3aGVyZSBkYXRhIGlzIHN0b3JlZCBpbiBmaWxlXCJ9LFxuICAgIFwiQ1NTIDEwMlwiOnt0aXRsZTpcIlN0cmluZyBjbGFzc1wiLGRlc2NyaXB0aW9uOlwiSW1wbGVtZW50IFN0cmluZyBjbGFzcywgd2l0aG91dCB1c2luZyBzdGFuZGFyZCBKYXZhIFN0cmluZ1wifSxcbiAgICBcIkNTUyAxMDNcIjp7dGl0bGU6XCJCYW5rIGNhc2hpZXJcIiwgZGVzY3JpcHRpb246XCJJbXBsZW1lbnQgQmFuayBjYXNoaWVyXCJ9LFxuICAgIFwiQ1NTIDEwNFwiOnt0aXRsZTpcIkNoZXNzXCIsZGVzY3JpcHRpb246XCJDaGVzcyBnYW1lXCJ9LFxuICAgIFwiQ1NTIDEwNVwiOnt0aXRsZTpcIkxhbmRpbmcgcGFnZVwiLGRlc2NyaXB0aW9uOlwiSW1wbGVtZW50IGxhbmRpbmcgcGFnZVwifSxcbiAgICBcIkNTUyAxMDZcIjp7dGl0bGU6XCJDcmVhdGUgRS1jb21tZXJzZSBzdG9yZVwiLGRlc2NyaXB0aW9uOlwiWW91IHNob3VsZCBjcmVhdGUgZS1jb21tZXJjZSBwYWdlIHdoZXJlIHVzZXJzIGNhbiBidXkgaXRlbXNcIn1cbn07XG5sZXQgZ3JhcGggPSBHcmFwaCgpO1xuZ3JhcGguYWRkTm9kZShcIkNTUyAxMDFcIikuYWRkTm9kZShcIkNTUyAxMDJcIikuYWRkTm9kZShcIkNTUyAxMDNcIilcbiAgICAgICAgLmFkZE5vZGUoXCJDU1MgMTA0XCIpLmFkZE5vZGUoXCJDU1MgMTA1XCIpLmFkZE5vZGUoXCJDU1MgMTA2XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDFcIixcIkNTUyAxMDJcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMVwiLFwiQ1NTIDEwM1wiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAyXCIsXCJDU1MgMTA0XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDJcIixcIkNTUyAxMDVcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwM1wiLFwiQ1NTIDEwNVwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAyXCIsXCJDU1MgMTA2XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDRcIixcIkNTUyAxMDZcIik7XG5sZXQgcm9vdCA9IFwiQ1NTIDEwMVwiO1xudmFyIHJhZGl1cyA9IDQwO1xud2luZG93LnN0YXRlcyA9IFtdO1xuXG5mb3IgKGxldCBub2RlIG9mIGdyYXBoLm5vZGVzKCkpe1xuICAgIG5ld05vZGUgPSB7aW5kZXg6MCx4OjAseTowLGxhYmVsOm5vZGUsdHJhbnNpdGlvbnM6W119O1xuICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZSA9IG5ld05vZGU7XG4gICAgd2luZG93LnN0YXRlcy5wdXNoKG5ld05vZGUpO1xufVxuXG5sZXQgbm9kZXMgPSBbcm9vdF07XG5mb3IgKGxldCBkZXB0aD0wO2RlcHRoPGRlcHRoX2xpbWl0O2RlcHRoKyspe1xuICAgIGxldCB4ID0gd2lkdGgvKGRlcHRoX2xpbWl0KjIpKihkZXB0aCoyKzEpO1xuICAgIGxldCBhZGphY2VudE5vZGVzID0gW107XG4gICAgZm9yIChsZXQgaT0wO2k8bm9kZXMubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHkgPSBoZWlnaHQgLyAobGFuZV9saW1pdCoyKSogKGkqMisxKVxuICAgICAgICBuZXdOb2RlID0ge2luZGV4OjAseDp4LHk6eSxsYWJlbDpub2RlLHRyYW5zaXRpb25zOltdfTtcbiAgICAgICAgZ3JhcGhEYXRhW25vZGVdLndpbmRvd1N0YXRlID0gbmV3Tm9kZTtcbiAgICAgICAgd2luZG93LnN0YXRlcy5wdXNoKG5ld05vZGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGdyYXBoLmFkamFjZW50KG5vZGUpKTtcbiAgICAgICAgYWRqYWNlbnROb2RlcyA9IGFkamFjZW50Tm9kZXMuY29uY2F0KGdyYXBoLmFkamFjZW50KG5vZGUpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhhZGphY2VudE5vZGVzKTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhhZGphY2VudE5vZGVzKTtcbiAgICBub2RlcyA9IFsuLi5uZXcgU2V0KGFkamFjZW50Tm9kZXMpXTtcbn1cbmZvciAobGV0IGk9MDtpPHdpbmRvdy5zdGF0ZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGVTdGF0ZSA9IHdpbmRvdy5zdGF0ZXNbaV07XG4gICAgLy9jb25zb2xlLmxvZyhub2RlKTtcbiAgICBsZXQgYWRqTm9kZXMgPSBncmFwaC5hZGphY2VudChub2RlU3RhdGUubGFiZWwpO1xuICAgIC8vY29uc29sZS5sb2coYWRqTm9kZXMpO1xuICAgIGZvciAobGV0IGFkak5vZGUgb2YgYWRqTm9kZXMpe1xuICAgICAgICBjb25zb2xlLmxvZyhhZGpOb2RlKTtcbiAgICAgICAgLy9ub2RlU3RhdGUudHJhbnNpdGlvbnMucHVzaCh7bGFiZWw6J3dob28nLHRhcmdldDp3aW5kb3cuc3RhdGVzW2Fkak5vZGVdfSk7XG4gICAgICAgIG5vZGVTdGF0ZS50cmFuc2l0aW9ucy5wdXNoKHtsYWJlbDond2hvbycsdGFyZ2V0OmdyYXBoRGF0YVthZGpOb2RlXS53aW5kb3dTdGF0ZX0pO1xuICAgIH1cbn1cblxuXG4vKlxubGV0IHggPSB3aWR0aC8oZGVwdGgqMiksIHkgPSBoZWlnaHQvKGxhbmVfbGltaXQqMik7XG5sZXQgbmV3Tm9kZSA9IHtpbmRleDowLHg6eCx5OnksbGFiZWw6cm9vdCx0cmFuc2l0aW9uczpbXX07XG5ncmFwaERhdGFbcm9vdF0ud2luZG93U3RhdGUgPSBuZXdOb2RlO1xud2luZG93LnN0YXRlcy5wdXNoKG5ld05vZGUpO1xuXG5sZXQgYWRqYWNlbnROb2RlcyA9IGdyYXBoLmFkamFjZW50KHJvb3QpO1xueCA9IHdpZHRoLyhkZXB0aCoyKSozLCB5ID0gaGVpZ2h0LyhsYW5lX2xpbWl0KjIpO1xuY29uc29sZS5sb2coYWRqYWNlbnROb2Rlcyk7XG5mb3IgKGxldCBpPTA7aTxhZGphY2VudE5vZGVzLmxlbmd0aDtpKyspe1xuICAgIGxldCBub2RlID0gYWRqYWNlbnROb2Rlc1tpXTtcbiAgICB5ID0gaGVpZ2h0LyhsYW5lX2xpbWl0KjIpKihpKjIrMSk7XG4gICAgbmV3Tm9kZSA9IHtpbmRleDowLHg6eCx5OnksbGFiZWw6bm9kZSx0cmFuc2l0aW9uczpbXX07XG4gICAgZ3JhcGhEYXRhW25vZGVdLndpbmRvd1N0YXRlID0gbmV3Tm9kZTtcbiAgICB3aW5kb3cuc3RhdGVzLnB1c2gobmV3Tm9kZSk7XG59Ki9cblxuLypsZXQgeCA9IDQwO2xldCB5PTQwO2xldCBpbmRleD0gMDtcbmxldCBub2RlcyA9IGdyYXBoLm5vZGVzKCk7XG5mb3IgKGxldCBpPTA7aTxub2Rlcy5sZW5ndGg7aSsrKXtcbiAgICBsZXQgbm9kZSA9IG5vZGVzW2ldO1xuICAgIGxldCBuZXdOb2RlID0ge2luZGV4OmluZGV4LHg6eCx5OnksbGFiZWw6bm9kZSx0cmFuc2l0aW9uczpbXX07XG4gICAgZ3JhcGhEYXRhW25vZGVdLndpbmRvd1N0YXRlID0gbmV3Tm9kZTtcbiAgICAvL3dpbmRvdy5zdGF0ZXNbbm9kZV0gPSBuZXdOb2RlO1xuICAgIHdpbmRvdy5zdGF0ZXMucHVzaChuZXdOb2RlKTtcbiAgICB4ID0geCsxMDA7IHkgPSB5KzEwMDsgaW5kZXggPSBpbmRleCsxO1xufVxuZm9yIChsZXQgaT0wO2k8d2luZG93LnN0YXRlcy5sZW5ndGg7aSsrKXtcbiAgICBsZXQgbm9kZVN0YXRlID0gd2luZG93LnN0YXRlc1tpXTtcbiAgICAvL2NvbnNvbGUubG9nKG5vZGUpO1xuICAgIGxldCBhZGpOb2RlcyA9IGdyYXBoLmFkamFjZW50KG5vZGVTdGF0ZS5sYWJlbCk7XG4gICAgLy9jb25zb2xlLmxvZyhhZGpOb2Rlcyk7XG4gICAgZm9yIChsZXQgYWRqTm9kZSBvZiBhZGpOb2Rlcyl7XG4gICAgICAgIGNvbnNvbGUubG9nKGFkak5vZGUpO1xuICAgICAgICAvL25vZGVTdGF0ZS50cmFuc2l0aW9ucy5wdXNoKHtsYWJlbDond2hvbycsdGFyZ2V0OndpbmRvdy5zdGF0ZXNbYWRqTm9kZV19KTtcbiAgICAgICAgbm9kZVN0YXRlLnRyYW5zaXRpb25zLnB1c2goe2xhYmVsOid3aG9vJyx0YXJnZXQ6Z3JhcGhEYXRhW2Fkak5vZGVdLndpbmRvd1N0YXRlfSk7XG4gICAgfVxufSovXG5jb25zb2xlLmxvZyhcIkhlbGxvIFdvcmxkXCIpO1xuaW5pdGlhbGl6ZVNWRygpO1xuXG5cblxudmFyIGdTdGF0ZXMgPSBzdmcuc2VsZWN0QWxsKFwiZy5zdGF0ZVwiKS5kYXRhKHN0YXRlcyk7XG5cbnZhciB0cmFuc2l0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdGF0ZXMucmVkdWNlKCBmdW5jdGlvbiggaW5pdGlhbCwgc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGluaXRpYWwuY29uY2F0KCBcbiAgICAgICAgICAgIHN0YXRlLnRyYW5zaXRpb25zLm1hcCggZnVuY3Rpb24oIHRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzb3VyY2UgOiBzdGF0ZSwgdGFyZ2V0IDogdHJhbnNpdGlvbi50YXJnZXR9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9LCBbXSk7XG59O1xuICAgIC8vIGh0dHA6Ly93d3cuZGFzaGluZ2QzanMuY29tL3N2Zy1wYXRocy1hbmQtZDNqc1xudmFyIGNvbXB1dGVUcmFuc2l0aW9uUGF0aCA9IC8qZDMuc3ZnLmRpYWdvbmFsLnJhZGlhbCgpKi9mdW5jdGlvbiggZCkge1xuICAgIHZhciBkZWx0YVggPSBkLnRhcmdldC54IC0gZC5zb3VyY2UueCxcbiAgICBkZWx0YVkgPSBkLnRhcmdldC55IC0gZC5zb3VyY2UueSxcbiAgICBkaXN0ID0gTWF0aC5zcXJ0KGRlbHRhWCAqIGRlbHRhWCArIGRlbHRhWSAqIGRlbHRhWSksXG4gICAgbm9ybVggPSBkZWx0YVggLyBkaXN0LFxuICAgIG5vcm1ZID0gZGVsdGFZIC8gZGlzdCxcbiAgICBzb3VyY2VQYWRkaW5nID0gcmFkaXVzICsgMjsvL2QubGVmdCA/IDE3IDogMTIsXG4gICAgdGFyZ2V0UGFkZGluZyA9IHJhZGl1cyArIDY7Ly9kLnJpZ2h0ID8gMTcgOiAxMixcbiAgICBzb3VyY2VYID0gZC5zb3VyY2UueCArIChzb3VyY2VQYWRkaW5nICogbm9ybVgpLFxuICAgIHNvdXJjZVkgPSBkLnNvdXJjZS55ICsgKHNvdXJjZVBhZGRpbmcgKiBub3JtWSksXG4gICAgdGFyZ2V0WCA9IGQudGFyZ2V0LnggLSAodGFyZ2V0UGFkZGluZyAqIG5vcm1YKSxcbiAgICB0YXJnZXRZID0gZC50YXJnZXQueSAtICh0YXJnZXRQYWRkaW5nICogbm9ybVkpO1xuICAgIHJldHVybiAnTScgKyBzb3VyY2VYICsgJywnICsgc291cmNlWSArICdMJyArIHRhcmdldFggKyAnLCcgKyB0YXJnZXRZO1xufTtcblxudmFyIGdUcmFuc2l0aW9ucyA9IHN2Zy5hcHBlbmQoICdnJykuc2VsZWN0QWxsKCBcInBhdGgudHJhbnNpdGlvblwiKS5kYXRhKHRyYW5zaXRpb25zKTtcblxudmFyIHN0YXJ0U3RhdGUsIGVuZFN0YXRlOyAgICBcbnZhciBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG4ub24oXCJkcmFnXCIsIGZ1bmN0aW9uKCBkLCBpKSB7XG4gICAgaWYoIHN0YXJ0U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uID0gZDMuc2VsZWN0QWxsKCAnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiggc2VsZWN0aW9uWzBdLmluZGV4T2YoIHRoaXMpPT0tMSkge1xuICAgICAgICBzZWxlY3Rpb24uY2xhc3NlZCggXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgICAgIHNlbGVjdGlvbiA9IGQzLnNlbGVjdCggdGhpcyk7XG4gICAgICAgIHNlbGVjdGlvbi5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgIH0gXG5cbiAgICBzZWxlY3Rpb24uYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiggZCwgaSkge1xuICAgICAgICBkLnggKz0gZDMuZXZlbnQuZHg7XG4gICAgICAgIGQueSArPSBkMy5ldmVudC5keTtcbiAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgWyBkLngsZC55IF0gKyBcIilcIlxuICAgIH0pXG4gICAgICAgIC8vIHJlYXBwZW5kIGRyYWdnZWQgZWxlbWVudCBhcyBsYXN0IFxuICAgICAgICAvLyBzbyB0aGF0IGl0cyBzdGF5cyBvbiB0b3AgXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCB0aGlzKTtcblxuICAgIGdUcmFuc2l0aW9ucy5hdHRyKCAnZCcsIGNvbXB1dGVUcmFuc2l0aW9uUGF0aCk7XG4gICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59KVxuLm9uKCBcImRyYWdlbmRcIiwgZnVuY3Rpb24oIGQpIHtcbiAgICAvLyBUT0RPIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDY2NzQwMS9jbGljay1ldmVudC1ub3QtZmlyaW5nLWFmdGVyLWRyYWctc29tZXRpbWVzLWluLWQzLWpzXG5cbiAgICAvLyBuZWVkZWQgYnkgRkZcbiAgICAvL2RyYWdfbGluZS5jbGFzc2VkKCdoaWRkZW4nLCB0cnVlKS5zdHlsZSgnbWFya2VyLWVuZCcsICcnKTtcblxuICAgIGlmKCBzdGFydFN0YXRlICYmIGVuZFN0YXRlKSB7XG4gICAgICAgIHN0YXJ0U3RhdGUudHJhbnNpdGlvbnMucHVzaCggeyBsYWJlbCA6IFwidHJhbnNpdGlvbiBsYWJlbCAxXCIsIHRhcmdldCA6IGVuZFN0YXRlfSk7XG4gICAgICAgIHJlc3RhcnQoKTtcbiAgICB9XG5cbiAgICBzdGFydFN0YXRlID0gdW5kZWZpbmVkO1xuICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xufSk7XG5cbnN2Zy5vbiggXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oKSB7XG4gICAgaWYoICFkMy5ldmVudC5jdHJsS2V5KSB7XG4gICAgICAgIGQzLnNlbGVjdEFsbCggJ2cuc2VsZWN0ZWQnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IGQzLm1vdXNlKHRoaXMpO1xuICAgIC8vY29uc29sZS5sb2coXCJNb3VzZSBEb3duXCIpO1xuICAgIHN2Zy5hcHBlbmQoIFwicmVjdFwiKS5hdHRyKHsgcng6IDYsIHJ5OiA2LCBjbGFzczogXCJzZWxlY3Rpb25cIiwgeDogcFswXSwgeTogcFsxXSwgd2lkdGg6IDAsIGhlaWdodDogMCB9KVxufSlcbi5vbiggXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHAgPSBkMy5tb3VzZSggdGhpcyksIHMgPSBzdmcuc2VsZWN0KFwicmVjdC5zZWxlY3Rpb25cIik7XG5cbiAgICBpZiggIXMuZW1wdHkoKSkge1xuICAgICAgICB2YXIgZCA9IHsgeDpwYXJzZUludChzLmF0dHIoXCJ4XCIpLDEwKSx5OnBhcnNlSW50KHMuYXR0cihcInlcIiksMTApLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDpwYXJzZUludChzLmF0dHIoXCJ3aWR0aFwiKSwxMCksaGVpZ2h0OnBhcnNlSW50KHMuYXR0ciggXCJoZWlnaHRcIiksIDEwKX0sXG4gICAgICAgIG1vdmUgPSB7eCA6IHBbMF0gLSBkLngsIHkgOiBwWzFdIC0gZC55fTtcbiAgICAgICAgaWYoIG1vdmUueCA8IDEgfHwgKG1vdmUueCoyPGQud2lkdGgpKSB7XG4gICAgICAgICAgICBkLnggPSBwWzBdO1xuICAgICAgICAgICAgZC53aWR0aCAtPSBtb3ZlLng7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkLndpZHRoID0gbW92ZS54OyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBtb3ZlLnkgPCAxIHx8IChtb3ZlLnkqMjxkLmhlaWdodCkpIHtcbiAgICAgICAgICAgIGQueSA9IHBbMV07XG4gICAgICAgICAgICBkLmhlaWdodCAtPSBtb3ZlLnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkLmhlaWdodCA9IG1vdmUueTsgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcy5hdHRyKCBkKTtcbiAgICAgICAgICAgIC8vIGRlc2VsZWN0IGFsbCB0ZW1wb3Jhcnkgc2VsZWN0ZWQgc3RhdGUgb2JqZWN0c1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnN0YXRlLnNlbGVjdGlvbi5zZWxlY3RlZCcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnN0YXRlID5jaXJjbGUuaW5uZXInKS5lYWNoKCBmdW5jdGlvbiggc3RhdGVfZGF0YSwgaSkge1xuICAgICAgICAgICAgaWYoIWQzLnNlbGVjdCggdGhpcykuY2xhc3NlZCggXCJzZWxlY3RlZFwiKSAmJiBcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5uZXIgY2lyY2xlIGluc2lkZSBzZWxlY3Rpb24gZnJhbWVcbiAgICAgICAgICAgICAgICBzdGF0ZV9kYXRhLngtcmFkaXVzPj1kLnggJiYgc3RhdGVfZGF0YS54K3JhZGl1czw9ZC54K2Qud2lkdGggJiYgXG4gICAgICAgICAgICAgICAgc3RhdGVfZGF0YS55LXJhZGl1cz49ZC55ICYmIHN0YXRlX2RhdGEueStyYWRpdXM8PWQueStkLmhlaWdodFxuICAgICAgICAgICAgKSB7XG5cbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoIHRoaXMucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAuY2xhc3NlZCggXCJzZWxlY3Rpb25cIiwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAuY2xhc3NlZCggXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmKCBzdGFydFN0YXRlKSB7XG4gICAgICAgICAgICAvLyB1cGRhdGUgZHJhZyBsaW5lXG4gICAgICAgIGRyYWdfbGluZS5hdHRyKCdkJywgJ00nICsgc3RhcnRTdGF0ZS54ICsgJywnICsgc3RhcnRTdGF0ZS55ICsgJ0wnICsgcFswXSArICcsJyArIHBbMV0pO1xuICAgICAgICB2YXIgc3RhdGUgPSBkMy5zZWxlY3QoICdnLnN0YXRlLmhvdmVyJyk7XG4gICAgICAgIGVuZFN0YXRlID0gKCFzdGF0ZS5lbXB0eSgpICYmIHN0YXRlLmRhdGEoKVswXSkgfHwgdW5kZWZpbmVkO1xuICAgIH1cbn0pXG4ub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgIC8vIHJlbW92ZSBzZWxlY3Rpb24gZnJhbWVcbiAgICBzdmcuc2VsZWN0QWxsKCBcInJlY3Quc2VsZWN0aW9uXCIpLnJlbW92ZSgpO1xuICAgIC8vIHJlbW92ZSB0ZW1wb3Jhcnkgc2VsZWN0aW9uIG1hcmtlciBjbGFzc1xuICAgIGQzLnNlbGVjdEFsbCggJ2cuc3RhdGUuc2VsZWN0aW9uJykuY2xhc3NlZCggXCJzZWxlY3Rpb25cIiwgZmFsc2UpO1xufSlcbi5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgIGlmKCBkMy5ldmVudC5yZWxhdGVkVGFyZ2V0LnRhZ05hbWU9PSdIVE1MJykge1xuICAgICAgICAvLyByZW1vdmUgc2VsZWN0aW9uIGZyYW1lXG4gICAgICAgIHN2Zy5zZWxlY3RBbGwoIFwicmVjdC5zZWxlY3Rpb25cIikucmVtb3ZlKCk7XG4gICAgICAgIC8vIHJlbW92ZSB0ZW1wb3Jhcnkgc2VsZWN0aW9uIG1hcmtlciBjbGFzc1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnN0YXRlLnNlbGVjdGlvbicpLmNsYXNzZWQoIFwic2VsZWN0aW9uXCIsIGZhbHNlKTtcbiAgICB9XG59KTtcbnJlc3RhcnQoKTtcbmZ1bmN0aW9uIHJlc3RhcnQoKSB7XG4gICAgY29uc29sZS5sb2coXCJSRVNUQVJUXCIpO1xuICAgIFxuICAgIGdTdGF0ZXMgPSBnU3RhdGVzLmRhdGEoc3RhdGVzKTtcbiAgICB2YXIgZ1N0YXRlID0gZ1N0YXRlcy5lbnRlcigpLmFwcGVuZCggXCJnXCIpXG4gICAgICAgIC5hdHRyKHsgXCJ0cmFuc2Zvcm1cIiA6IGZ1bmN0aW9uKCBkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIisgW2QueCxkLnldICsgXCIpXCI7XG4gICAgICAgICAgICB9LCdjbGFzcyc6ICdzdGF0ZScsJ2RhdGEtaWQnOmZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KS5jYWxsKCBkcmFnKTtcbiAgICAvKmdTdGF0ZS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgLy9yeDogNSx3aWR0aDo4MCxoZWlnaHQ6ODBcbiAgICAgICAgICAgIHIgICAgICAgOiByYWRpdXMgKyAxMDAsXG4gICAgICAgICAgICBjbGFzcyAgIDogJ291dGVyJ1xuICAgICAgICB9KVxuICAgICAgICAub24oIFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCBkKSB7XG4gICAgICAgICAgICBzdGFydFN0YXRlID0gZCwgZW5kU3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAvLyByZXBvc2l0aW9uIGRyYWcgbGluZVxuICAgICAgICAgICAgZHJhZ19saW5lXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdtYXJrZXItZW5kJywgJ3VybCgjZW5kLWFycm93KScpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoJ2hpZGRlbicsIGZhbHNlKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgJ00nICsgZC54ICsgJywnICsgZC55ICsgJ0wnICsgZC54ICsgJywnICsgZC55KVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAgICAgLy8gZm9yY2UgZWxlbWVudCB0byBiZSBhbiB0b3BcbiAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCB0aGlzLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coIFwibW91c2Vkb3duXCIsIHN0YXJ0U3RhdGUpO1xuICAgICAgICB9KTsqL1xuICAgIGdTdGF0ZS5hcHBlbmQoJ2NpcmNsZScpLmF0dHIoe3I6NDAsY2xhc3M6J2lubmVyJ30pXG4gICAgLm9uKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZCxpKXtcbiAgICAgICAgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpLmNsYXNzZWQoIFwiaG92ZXJcIiwgdHJ1ZSk7fSlcbiAgICAub24oXCJjbGlja1wiLGZ1bmN0aW9uKGQsaSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ0xJQ0tFRFwiKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wYXJlbnROb2RlLmRhdGFzZXQuaWQpO1xuICAgICAgICBzaG93SW5mb3JtYXRpb24odGhpcy5wYXJlbnROb2RlLmRhdGFzZXQuaWQpO1xuICAgIH0pO1xuICAgIC8vZ1N0YXRlLmFwcGVuZCgncmVjdCcpLmF0dHIoe30pO1xuICAgIC8qZ1N0YXRlLmFwcGVuZCggXCJjaXJjbGVcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgLy9yeDogNSx3aWR0aDo4MCxoZWlnaHQ6ODAsXG4gICAgICAgICAgICByICAgICAgIDogcmFkaXVzLFxuICAgICAgICAgICAgY2xhc3MgICA6ICdpbm5lcidcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCBkLCBpKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGQzLmV2ZW50LFxuICAgICAgICAgICAgICAgIGcgPSB0aGlzLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgaXNTZWxlY3RlZCA9IGQzLnNlbGVjdCggZykuY2xhc3NlZCggXCJzZWxlY3RlZFwiKTtcblxuICAgICAgICAgICAgaWYoICFlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnNlbGVjdGVkJykuY2xhc3NlZCggXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkMy5zZWxlY3QoIGcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgIWlzU2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIC8vIHJlYXBwZW5kIGRyYWdnZWQgZWxlbWVudCBhcyBsYXN0IFxuICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgaXRzIHN0YXlzIG9uIHRvcCBcbiAgICAgICAgICAgIGcucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCggZyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpLmNsYXNzZWQoIFwiaG92ZXJcIiwgdHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIGQzLnNlbGVjdCggdGhpcy5wYXJlbnROb2RlKS5jbGFzc2VkKCBcImhvdmVyXCIsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgOyovXG5cbiAgICBnU3RhdGUuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAndGV4dC1hbmNob3InICAgOiAnbWlkZGxlJyxcbiAgICAgICAgICAgIHkgICAgICAgICAgICAgICA6IDQsXG4gICAgICAgICAgICBjbGFzcyAgICAgICAgICAgOiAndGl0bGUnXG4gICAgICAgIH0pXG4gICAgICAgIC50ZXh0KCBmdW5jdGlvbiggZCkge1xuICAgICAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgICAgIH0pXG4gICAgO1xuICAgIGdTdGF0ZS5hcHBlbmQoIFwidGl0bGVcIikudGV4dCggZnVuY3Rpb24oIGQpIHtcbiAgICAgICAgcmV0dXJuIGQubGFiZWw7XG4gICAgfSk7XG4gICAgZ1N0YXRlcy5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICBnVHJhbnNpdGlvbnMgPSBnVHJhbnNpdGlvbnMuZGF0YSggdHJhbnNpdGlvbnMpO1xuICAgIGdUcmFuc2l0aW9ucy5lbnRlcigpLmFwcGVuZCggJ3BhdGgnKVxuICAgICAgICAuYXR0ciggJ2NsYXNzJywgJ3RyYW5zaXRpb24nKVxuICAgICAgICAuYXR0ciggJ2QnLCBjb21wdXRlVHJhbnNpdGlvblBhdGgpXG4gICAgOyAgIFxuICAgIGdUcmFuc2l0aW9ucy5leGl0KCkucmVtb3ZlKCk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQSBncmFwaCBkYXRhIHN0cnVjdHVyZSB3aXRoIGRlcHRoLWZpcnN0IHNlYXJjaCBhbmQgdG9wb2xvZ2ljYWwgc29ydC5cbmZ1bmN0aW9uIEdyYXBoKHNlcmlhbGl6ZWQpIHtcbiAgICAvLyBSZXR1cm5lZCBncmFwaCBpbnN0YW5jZVxuICAgIHZhciBncmFwaCA9IHtcbiAgICAgICAgYWRkTm9kZTogYWRkTm9kZSxcbiAgICAgICAgcmVtb3ZlTm9kZTogcmVtb3ZlTm9kZSxcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBhZGphY2VudDogYWRqYWNlbnQsXG4gICAgICAgIGFkZEVkZ2U6IGFkZEVkZ2UsXG4gICAgICAgIHJlbW92ZUVkZ2U6IHJlbW92ZUVkZ2UsXG4gICAgICAgIHNldEVkZ2VXZWlnaHQ6IHNldEVkZ2VXZWlnaHQsXG4gICAgICAgIGdldEVkZ2VXZWlnaHQ6IGdldEVkZ2VXZWlnaHQsXG4gICAgICAgIGluZGVncmVlOiBpbmRlZ3JlZSxcbiAgICAgICAgb3V0ZGVncmVlOiBvdXRkZWdyZWUsXG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2g6IGRlcHRoRmlyc3RTZWFyY2gsXG4gICAgICAgIGxvd2VzdENvbW1vbkFuY2VzdG9yczogbG93ZXN0Q29tbW9uQW5jZXN0b3JzLFxuICAgICAgICB0b3BvbG9naWNhbFNvcnQ6IHRvcG9sb2dpY2FsU29ydCxcbiAgICAgICAgc2hvcnRlc3RQYXRoOiBzaG9ydGVzdFBhdGgsXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVcbiAgICB9O1xuICAgIC8vIFRoZSBhZGphY2VuY3kgbGlzdCBvZiB0aGUgZ3JhcGguXG4gICAgLy8gS2V5cyBhcmUgbm9kZSBpZHMuXG4gICAgLy8gVmFsdWVzIGFyZSBhZGphY2VudCBub2RlIGlkIGFycmF5cy5cbiAgICB2YXIgZWRnZXMgPSB7fTtcbiAgICAvLyBUaGUgd2VpZ2h0cyBvZiBlZGdlcy5cbiAgICAvLyBLZXlzIGFyZSBzdHJpbmcgZW5jb2RpbmdzIG9mIGVkZ2VzLlxuICAgIC8vIFZhbHVlcyBhcmUgd2VpZ2h0cyAobnVtYmVycykuXG4gICAgdmFyIGVkZ2VXZWlnaHRzID0ge307XG4gICAgLy8gSWYgYSBzZXJpYWxpemVkIGdyYXBoIHdhcyBwYXNzZWQgaW50byB0aGUgY29uc3RydWN0b3IsIGRlc2VyaWFsaXplIGl0LlxuICAgIGlmIChzZXJpYWxpemVkKSB7XG4gICAgICAgIGRlc2VyaWFsaXplKHNlcmlhbGl6ZWQpO1xuICAgIH1cbiAgICAvLyBBZGRzIGEgbm9kZSB0byB0aGUgZ3JhcGguXG4gICAgLy8gSWYgbm9kZSB3YXMgYWxyZWFkeSBhZGRlZCwgdGhpcyBmdW5jdGlvbiBkb2VzIG5vdGhpbmcuXG4gICAgLy8gSWYgbm9kZSB3YXMgbm90IGFscmVhZHkgYWRkZWQsIHRoaXMgZnVuY3Rpb24gc2V0cyB1cCBhbiBlbXB0eSBhZGphY2VuY3kgbGlzdC5cbiAgICBmdW5jdGlvbiBhZGROb2RlKG5vZGUpIHtcbiAgICAgICAgZWRnZXNbbm9kZV0gPSBhZGphY2VudChub2RlKTtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBSZW1vdmVzIGEgbm9kZSBmcm9tIHRoZSBncmFwaC5cbiAgICAvLyBBbHNvIHJlbW92ZXMgaW5jb21pbmcgYW5kIG91dGdvaW5nIGVkZ2VzLlxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICAvLyBSZW1vdmUgaW5jb21pbmcgZWRnZXMuXG4gICAgICAgIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICBlZGdlc1t1XS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYgPT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRWRnZSh1LCB2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlbW92ZSBvdXRnb2luZyBlZGdlcyAoYW5kIHNpZ25hbCB0aGF0IHRoZSBub2RlIG5vIGxvbmdlciBleGlzdHMpLlxuICAgICAgICBkZWxldGUgZWRnZXNbbm9kZV07XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gR2V0cyB0aGUgbGlzdCBvZiBub2RlcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgZ3JhcGguXG4gICAgZnVuY3Rpb24gbm9kZXMoKSB7XG4gICAgICAgIC8vIFRPRE86IEJldHRlciBpbXBsZW1lbnRhdGlvbiB3aXRoIHNldCBkYXRhIHN0cnVjdHVyZVxuICAgICAgICB2YXIgbm9kZVNldCA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgbm9kZVNldFt1XSA9IHRydWU7XG4gICAgICAgICAgICBlZGdlc1t1XS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgbm9kZVNldFt2XSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhub2RlU2V0KTtcbiAgICB9XG4gICAgLy8gR2V0cyB0aGUgYWRqYWNlbnQgbm9kZSBsaXN0IGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgICAvLyBSZXR1cm5zIGFuIGVtcHR5IGFycmF5IGZvciB1bmtub3duIG5vZGVzLlxuICAgIGZ1bmN0aW9uIGFkamFjZW50KG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGVkZ2VzW25vZGVdIHx8IFtdO1xuICAgIH1cbiAgICAvLyBDb21wdXRlcyBhIHN0cmluZyBlbmNvZGluZyBvZiBhbiBlZGdlLFxuICAgIC8vIGZvciB1c2UgYXMgYSBrZXkgaW4gYW4gb2JqZWN0LlxuICAgIGZ1bmN0aW9uIGVuY29kZUVkZ2UodSwgdikge1xuICAgICAgICByZXR1cm4gdSArIFwifFwiICsgdjtcbiAgICB9XG4gICAgLy8gU2V0cyB0aGUgd2VpZ2h0IG9mIHRoZSBnaXZlbiBlZGdlLlxuICAgIGZ1bmN0aW9uIHNldEVkZ2VXZWlnaHQodSwgdiwgd2VpZ2h0KSB7XG4gICAgICAgIGVkZ2VXZWlnaHRzW2VuY29kZUVkZ2UodSwgdildID0gd2VpZ2h0O1xuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIEdldHMgdGhlIHdlaWdodCBvZiB0aGUgZ2l2ZW4gZWRnZS5cbiAgICAvLyBSZXR1cm5zIDEgaWYgbm8gd2VpZ2h0IHdhcyBwcmV2aW91c2x5IHNldC5cbiAgICBmdW5jdGlvbiBnZXRFZGdlV2VpZ2h0KHUsIHYpIHtcbiAgICAgICAgdmFyIHdlaWdodCA9IGVkZ2VXZWlnaHRzW2VuY29kZUVkZ2UodSwgdildO1xuICAgICAgICByZXR1cm4gd2VpZ2h0ID09PSB1bmRlZmluZWQgPyAxIDogd2VpZ2h0O1xuICAgIH1cbiAgICAvLyBBZGRzIGFuIGVkZ2UgZnJvbSBub2RlIHUgdG8gbm9kZSB2LlxuICAgIC8vIEltcGxpY2l0bHkgYWRkcyB0aGUgbm9kZXMgaWYgdGhleSB3ZXJlIG5vdCBhbHJlYWR5IGFkZGVkLlxuICAgIGZ1bmN0aW9uIGFkZEVkZ2UodSwgdiwgd2VpZ2h0KSB7XG4gICAgICAgIGFkZE5vZGUodSk7XG4gICAgICAgIGFkZE5vZGUodik7XG4gICAgICAgIGFkamFjZW50KHUpLnB1c2godik7XG4gICAgICAgIGlmICh3ZWlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0RWRnZVdlaWdodCh1LCB2LCB3ZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gUmVtb3ZlcyB0aGUgZWRnZSBmcm9tIG5vZGUgdSB0byBub2RlIHYuXG4gICAgLy8gRG9lcyBub3QgcmVtb3ZlIHRoZSBub2Rlcy5cbiAgICAvLyBEb2VzIG5vdGhpbmcgaWYgdGhlIGVkZ2UgZG9lcyBub3QgZXhpc3QuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRWRnZSh1LCB2KSB7XG4gICAgICAgIGlmIChlZGdlc1t1XSkge1xuICAgICAgICAgICAgZWRnZXNbdV0gPSBhZGphY2VudCh1KS5maWx0ZXIoZnVuY3Rpb24gKF92KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF92ICE9PSB2O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBDb21wdXRlcyB0aGUgaW5kZWdyZWUgZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIC8vIE5vdCB2ZXJ5IGVmZmljaWVudCwgY29zdHMgTyhFKSB3aGVyZSBFID0gbnVtYmVyIG9mIGVkZ2VzLlxuICAgIGZ1bmN0aW9uIGluZGVncmVlKG5vZGUpIHtcbiAgICAgICAgdmFyIGRlZ3JlZSA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrKHYpIHtcbiAgICAgICAgICAgIGlmICh2ID09PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgZGVncmVlKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIGVkZ2VzW3VdLmZvckVhY2goY2hlY2spO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZTtcbiAgICB9XG4gICAgLy8gQ29tcHV0ZXMgdGhlIG91dGRlZ3JlZSBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgZnVuY3Rpb24gb3V0ZGVncmVlKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgaW4gZWRnZXMgPyBlZGdlc1tub2RlXS5sZW5ndGggOiAwO1xuICAgIH1cbiAgICAvLyBEZXB0aCBGaXJzdCBTZWFyY2ggYWxnb3JpdGhtLCBpbnNwaXJlZCBieVxuICAgIC8vIENvcm1lbiBldCBhbC4gXCJJbnRyb2R1Y3Rpb24gdG8gQWxnb3JpdGhtc1wiIDNyZCBFZC4gcC4gNjA0XG4gICAgLy8gVGhpcyB2YXJpYW50IGluY2x1ZGVzIGFuIGFkZGl0aW9uYWwgb3B0aW9uXG4gICAgLy8gYGluY2x1ZGVTb3VyY2VOb2Rlc2AgdG8gc3BlY2lmeSB3aGV0aGVyIHRvIGluY2x1ZGUgb3JcbiAgICAvLyBleGNsdWRlIHRoZSBzb3VyY2Ugbm9kZXMgZnJvbSB0aGUgcmVzdWx0ICh0cnVlIGJ5IGRlZmF1bHQpLlxuICAgIC8vIElmIGBzb3VyY2VOb2Rlc2AgaXMgbm90IHNwZWNpZmllZCwgYWxsIG5vZGVzIGluIHRoZSBncmFwaFxuICAgIC8vIGFyZSB1c2VkIGFzIHNvdXJjZSBub2Rlcy5cbiAgICBmdW5jdGlvbiBkZXB0aEZpcnN0U2VhcmNoKHNvdXJjZU5vZGVzLCBpbmNsdWRlU291cmNlTm9kZXMpIHtcbiAgICAgICAgaWYgKGluY2x1ZGVTb3VyY2VOb2RlcyA9PT0gdm9pZCAwKSB7IGluY2x1ZGVTb3VyY2VOb2RlcyA9IHRydWU7IH1cbiAgICAgICAgaWYgKCFzb3VyY2VOb2Rlcykge1xuICAgICAgICAgICAgc291cmNlTm9kZXMgPSBub2RlcygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaW5jbHVkZVNvdXJjZU5vZGVzICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgaW5jbHVkZVNvdXJjZU5vZGVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmlzaXRlZCA9IHt9O1xuICAgICAgICB2YXIgbm9kZUxpc3QgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gREZTVmlzaXQobm9kZSkge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW25vZGVdKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICAgICAgICAgICAgbm9kZUxpc3QucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5jbHVkZVNvdXJjZU5vZGVzKSB7XG4gICAgICAgICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc291cmNlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGFkamFjZW50KG5vZGUpLmZvckVhY2goREZTVmlzaXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVMaXN0O1xuICAgIH1cbiAgICAvLyBMZWFzdCBDb21tb24gQW5jZXN0b3JzXG4gICAgLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL3JlbGF4ZWR3cy9sY2EvYmxvYi9tYXN0ZXIvc3JjL0xvd2VzdENvbW1vbkFuY2VzdG9yLnBocCBjb2RlXG4gICAgLy8gYnV0IHVzZXMgZGVwdGggc2VhcmNoIGluc3RlYWQgb2YgYnJlYWR0aC4gQWxzbyB1c2VzIHNvbWUgb3B0aW1pemF0aW9uc1xuICAgIGZ1bmN0aW9uIGxvd2VzdENvbW1vbkFuY2VzdG9ycyhub2RlMSwgbm9kZTIpIHtcbiAgICAgICAgdmFyIG5vZGUxQW5jZXN0b3JzID0gW107XG4gICAgICAgIHZhciBsY2FzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIENBMVZpc2l0KHZpc2l0ZWQsIG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghdmlzaXRlZFtub2RlXSkge1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5vZGUxQW5jZXN0b3JzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbm9kZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGNhcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGZvdW5kIC0gc2hvcnRjdXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50KG5vZGUpLmV2ZXJ5KGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBDQTFWaXNpdCh2aXNpdGVkLCBub2RlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIENBMlZpc2l0KHZpc2l0ZWQsIG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghdmlzaXRlZFtub2RlXSkge1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChub2RlMUFuY2VzdG9ycy5pbmRleE9mKG5vZGUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGNhcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsY2FzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW50KG5vZGUpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENBMlZpc2l0KHZpc2l0ZWQsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKENBMVZpc2l0KHt9LCBub2RlMSkpIHtcbiAgICAgICAgICAgIC8vIE5vIHNob3J0Y3V0IHdvcmtlZFxuICAgICAgICAgICAgQ0EyVmlzaXQoe30sIG5vZGUyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGNhcztcbiAgICB9XG4gICAgLy8gVGhlIHRvcG9sb2dpY2FsIHNvcnQgYWxnb3JpdGhtIHlpZWxkcyBhIGxpc3Qgb2YgdmlzaXRlZCBub2Rlc1xuICAgIC8vIHN1Y2ggdGhhdCBmb3IgZWFjaCB2aXNpdGVkIGVkZ2UgKHUsIHYpLCB1IGNvbWVzIGJlZm9yZSB2IGluIHRoZSBsaXN0LlxuICAgIC8vIEFtYXppbmdseSwgdGhpcyBjb21lcyBmcm9tIGp1c3QgcmV2ZXJzaW5nIHRoZSByZXN1bHQgZnJvbSBkZXB0aCBmaXJzdCBzZWFyY2guXG4gICAgLy8gQ29ybWVuIGV0IGFsLiBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIgM3JkIEVkLiBwLiA2MTNcbiAgICBmdW5jdGlvbiB0b3BvbG9naWNhbFNvcnQoc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2Rlcykge1xuICAgICAgICBpZiAoaW5jbHVkZVNvdXJjZU5vZGVzID09PSB2b2lkIDApIHsgaW5jbHVkZVNvdXJjZU5vZGVzID0gdHJ1ZTsgfVxuICAgICAgICByZXR1cm4gZGVwdGhGaXJzdFNlYXJjaChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKS5yZXZlcnNlKCk7XG4gICAgfVxuICAgIC8vIERpamtzdHJhJ3MgU2hvcnRlc3QgUGF0aCBBbGdvcml0aG0uXG4gICAgLy8gQ29ybWVuIGV0IGFsLiBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIgM3JkIEVkLiBwLiA2NThcbiAgICAvLyBWYXJpYWJsZSBhbmQgZnVuY3Rpb24gbmFtZXMgY29ycmVzcG9uZCB0byBuYW1lcyBpbiB0aGUgYm9vay5cbiAgICBmdW5jdGlvbiBzaG9ydGVzdFBhdGgoc291cmNlLCBkZXN0aW5hdGlvbikge1xuICAgICAgICAvLyBVcHBlciBib3VuZHMgZm9yIHNob3J0ZXN0IHBhdGggd2VpZ2h0cyBmcm9tIHNvdXJjZS5cbiAgICAgICAgdmFyIGQgPSB7fTtcbiAgICAgICAgLy8gUHJlZGVjZXNzb3JzLlxuICAgICAgICB2YXIgcCA9IHt9O1xuICAgICAgICAvLyBQb29yIG1hbidzIHByaW9yaXR5IHF1ZXVlLCBrZXllZCBvbiBkLlxuICAgICAgICB2YXIgcSA9IHt9O1xuICAgICAgICBmdW5jdGlvbiBpbml0aWFsaXplU2luZ2xlU291cmNlKCkge1xuICAgICAgICAgICAgbm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgZFtub2RlXSA9IEluZmluaXR5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZFtzb3VyY2VdICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvdXJjZSBub2RlIGlzIG5vdCBpbiB0aGUgZ3JhcGhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZFtkZXN0aW5hdGlvbl0gIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVzdGluYXRpb24gbm9kZSBpcyBub3QgaW4gdGhlIGdyYXBoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZFtzb3VyY2VdID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGRzIGVudHJpZXMgaW4gcSBmb3IgYWxsIG5vZGVzLlxuICAgICAgICBmdW5jdGlvbiBpbml0aWFsaXplUHJpb3JpdHlRdWV1ZSgpIHtcbiAgICAgICAgICAgIG5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHFbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJucyB0cnVlIGlmIHEgaXMgZW1wdHkuXG4gICAgICAgIGZ1bmN0aW9uIHByaW9yaXR5UXVldWVFbXB0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhxKS5sZW5ndGggPT09IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGluZWFyIHNlYXJjaCB0byBleHRyYWN0IChmaW5kIGFuZCByZW1vdmUpIG1pbiBmcm9tIHEuXG4gICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RNaW4oKSB7XG4gICAgICAgICAgICB2YXIgbWluID0gSW5maW5pdHk7XG4gICAgICAgICAgICB2YXIgbWluTm9kZTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHEpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZFtub2RlXSA8IG1pbikge1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSBkW25vZGVdO1xuICAgICAgICAgICAgICAgICAgICBtaW5Ob2RlID0gbm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChtaW5Ob2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSByZWFjaCBoZXJlLCB0aGVyZSdzIGEgZGlzY29ubmVjdGVkIHN1YmdyYXBoLCBhbmQgd2UncmUgZG9uZS5cbiAgICAgICAgICAgICAgICBxID0ge307XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgcVttaW5Ob2RlXTtcbiAgICAgICAgICAgIHJldHVybiBtaW5Ob2RlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbGF4KHUsIHYpIHtcbiAgICAgICAgICAgIHZhciB3ID0gZ2V0RWRnZVdlaWdodCh1LCB2KTtcbiAgICAgICAgICAgIGlmIChkW3ZdID4gZFt1XSArIHcpIHtcbiAgICAgICAgICAgICAgICBkW3ZdID0gZFt1XSArIHc7XG4gICAgICAgICAgICAgICAgcFt2XSA9IHU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGlqa3N0cmEoKSB7XG4gICAgICAgICAgICBpbml0aWFsaXplU2luZ2xlU291cmNlKCk7XG4gICAgICAgICAgICBpbml0aWFsaXplUHJpb3JpdHlRdWV1ZSgpO1xuICAgICAgICAgICAgd2hpbGUgKCFwcmlvcml0eVF1ZXVlRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHZhciB1ID0gZXh0cmFjdE1pbigpO1xuICAgICAgICAgICAgICAgIGlmICh1ID09PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgYWRqYWNlbnQodSkuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICByZWxheCh1LCB2KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBBc3NlbWJsZXMgdGhlIHNob3J0ZXN0IHBhdGggYnkgdHJhdmVyc2luZyB0aGVcbiAgICAgICAgLy8gcHJlZGVjZXNzb3Igc3ViZ3JhcGggZnJvbSBkZXN0aW5hdGlvbiB0byBzb3VyY2UuXG4gICAgICAgIGZ1bmN0aW9uIHBhdGgoKSB7XG4gICAgICAgICAgICB2YXIgbm9kZUxpc3QgPSBbXTtcbiAgICAgICAgICAgIHZhciB3ZWlnaHQgPSAwO1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIHdoaWxlIChwW25vZGVdKSB7XG4gICAgICAgICAgICAgICAgbm9kZUxpc3QucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB3ZWlnaHQgKz0gZ2V0RWRnZVdlaWdodChwW25vZGVdLCBub2RlKTtcbiAgICAgICAgICAgICAgICBub2RlID0gcFtub2RlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBwYXRoIGZvdW5kXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZUxpc3QucHVzaChub2RlKTtcbiAgICAgICAgICAgIG5vZGVMaXN0LnJldmVyc2UoKTtcbiAgICAgICAgICAgIG5vZGVMaXN0LndlaWdodCA9IHdlaWdodDtcbiAgICAgICAgICAgIHJldHVybiBub2RlTGlzdDtcbiAgICAgICAgfVxuICAgICAgICBkaWprc3RyYSgpO1xuICAgICAgICByZXR1cm4gcGF0aCgpO1xuICAgIH1cbiAgICAvLyBTZXJpYWxpemVzIHRoZSBncmFwaC5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemUoKSB7XG4gICAgICAgIHZhciBzZXJpYWxpemVkID0ge1xuICAgICAgICAgICAgbm9kZXM6IG5vZGVzKCkubWFwKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZCB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBsaW5rczogW11cbiAgICAgICAgfTtcbiAgICAgICAgc2VyaWFsaXplZC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gbm9kZS5pZDtcbiAgICAgICAgICAgIGFkamFjZW50KHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZC5saW5rcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IGdldEVkZ2VXZWlnaHQoc291cmNlLCB0YXJnZXQpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkO1xuICAgIH1cbiAgICAvLyBEZXNlcmlhbGl6ZXMgdGhlIGdpdmVuIHNlcmlhbGl6ZWQgZ3JhcGguXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemUoc2VyaWFsaXplZCkge1xuICAgICAgICBzZXJpYWxpemVkLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGFkZE5vZGUobm9kZS5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZXJpYWxpemVkLmxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcbiAgICAgICAgICAgIGFkZEVkZ2UobGluay5zb3VyY2UsIGxpbmsudGFyZ2V0LCBsaW5rLndlaWdodCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIFRoZSByZXR1cm5lZCBncmFwaCBpbnN0YW5jZS5cbiAgICByZXR1cm4gZ3JhcGg7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xuIl19
