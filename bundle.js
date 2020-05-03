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

let nodesIterate = graph.nodes();
for (let i=0;i<nodesIterate.length;i++){
    let node = nodesIterate[i];
    newNode = {index:i,x:0,y:0,label:node,transitions:[]};
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
        graphData[node].windowState.x = x;
        graphData[node].windowState.y = y;
        //newNode = {index:0,x:x,y:y,label:node,transitions:[]};
        //graphData[node].windowState = newNode;
        //window.states.push(newNode);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJub2RlX21vZHVsZXMvZ3JhcGgtZGF0YS1zdHJ1Y3R1cmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gc2hvd0luZm9ybWF0aW9uKGlkKXtcbiAgICBsZXQgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGV0YWlsc1wiKTtcbiAgICBkZXRhaWxzLmlubmVySFRNTCA9IGdyYXBoRGF0YVtpZF0udGl0bGUrXCI8YnIvPlwiK2dyYXBoRGF0YVtpZF0uZGVzY3JpcHRpb247XG59XG5mdW5jdGlvbiBpbml0aWFsaXplU1ZHKCl7XG4gICAgd2luZG93LnN2ZyA9IGQzLnNlbGVjdCgnYm9keScpXG4gICAgLmFwcGVuZChcInN2Z1wiKVxuICAgIC8vLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgMTAwMCArIFwiIFwiICsgMTAwMCApXG4gICAgLy8uYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWluWU1pblwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCI5NjBweFwiKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiNTAwcHhcIik7ICAgIFxuICAgIFxuICAgICAgICAvLyBkZWZpbmUgYXJyb3cgbWFya2VycyBmb3IgZ3JhcGggbGlua3NcbiAgICBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdlbmQtYXJyb3cnKVxuICAgICAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAgICAgLmF0dHIoJ3JlZlgnLCAzKVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnLCA4KVxuICAgICAgICAuYXR0cignbWFya2VySGVpZ2h0JywgOClcbiAgICAgICAgLmF0dHIoJ29yaWVudCcsICdhdXRvJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignZCcsICdNMCwtNUwxMCwwTDAsNScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcbiAgICBcbiAgICBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdzdGFydC1hcnJvdycpXG4gICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgLTUgMTAgMTAnKVxuICAgICAgICAuYXR0cigncmVmWCcsIDQpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJXaWR0aCcsIDgpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJIZWlnaHQnLCA4KVxuICAgICAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxuICAgICAgICAuYXBwZW5kKCdzdmc6cGF0aCcpXG4gICAgICAgIC5hdHRyKCdkJywgJ00xMCwtNUwwLDBMMTAsNScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcbiAgICBcbiAgICAgICAgLy8gbGluZSBkaXNwbGF5ZWQgd2hlbiBkcmFnZ2luZyBuZXcgbm9kZXNcbiAgICB2YXIgZHJhZ19saW5lID0gc3ZnLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZHJhZ2xpbmUgaGlkZGVuJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsMEwwLDAnKVxuICAgIDtcbn1cblxubGV0IHdpZHRoID0gOTYwLGhlaWdodCA9IDUwMCwgZGVwdGhfbGltaXQgPSAxMCwgbGFuZV9saW1pdCA9IDU7XG52YXIgR3JhcGggPSByZXF1aXJlKFwiZ3JhcGgtZGF0YS1zdHJ1Y3R1cmVcIik7XG5sZXQgZ3JhcGhEYXRhID0ge1xuICAgIFwiQ1NTIDEwMVwiOnt0aXRsZTpcIkNyZWF0ZSBQaG9uZWJvb2tcIixkZXNjcmlwdGlvbjpcIkNyZWF0ZSBQaG9uZWJvb2ssIHdoZXJlIGRhdGEgaXMgc3RvcmVkIGluIGZpbGVcIn0sXG4gICAgXCJDU1MgMTAyXCI6e3RpdGxlOlwiU3RyaW5nIGNsYXNzXCIsZGVzY3JpcHRpb246XCJJbXBsZW1lbnQgU3RyaW5nIGNsYXNzLCB3aXRob3V0IHVzaW5nIHN0YW5kYXJkIEphdmEgU3RyaW5nXCJ9LFxuICAgIFwiQ1NTIDEwM1wiOnt0aXRsZTpcIkJhbmsgY2FzaGllclwiLCBkZXNjcmlwdGlvbjpcIkltcGxlbWVudCBCYW5rIGNhc2hpZXJcIn0sXG4gICAgXCJDU1MgMTA0XCI6e3RpdGxlOlwiQ2hlc3NcIixkZXNjcmlwdGlvbjpcIkNoZXNzIGdhbWVcIn0sXG4gICAgXCJDU1MgMTA1XCI6e3RpdGxlOlwiTGFuZGluZyBwYWdlXCIsZGVzY3JpcHRpb246XCJJbXBsZW1lbnQgbGFuZGluZyBwYWdlXCJ9LFxuICAgIFwiQ1NTIDEwNlwiOnt0aXRsZTpcIkNyZWF0ZSBFLWNvbW1lcnNlIHN0b3JlXCIsZGVzY3JpcHRpb246XCJZb3Ugc2hvdWxkIGNyZWF0ZSBlLWNvbW1lcmNlIHBhZ2Ugd2hlcmUgdXNlcnMgY2FuIGJ1eSBpdGVtc1wifVxufTtcbmxldCBncmFwaCA9IEdyYXBoKCk7XG5ncmFwaC5hZGROb2RlKFwiQ1NTIDEwMVwiKS5hZGROb2RlKFwiQ1NTIDEwMlwiKS5hZGROb2RlKFwiQ1NTIDEwM1wiKVxuICAgICAgICAuYWRkTm9kZShcIkNTUyAxMDRcIikuYWRkTm9kZShcIkNTUyAxMDVcIikuYWRkTm9kZShcIkNTUyAxMDZcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMVwiLFwiQ1NTIDEwMlwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAxXCIsXCJDU1MgMTAzXCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDJcIixcIkNTUyAxMDRcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMlwiLFwiQ1NTIDEwNVwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAzXCIsXCJDU1MgMTA1XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDJcIixcIkNTUyAxMDZcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwNFwiLFwiQ1NTIDEwNlwiKTtcbmxldCByb290ID0gXCJDU1MgMTAxXCI7XG52YXIgcmFkaXVzID0gNDA7XG53aW5kb3cuc3RhdGVzID0gW107XG5cbmxldCBub2Rlc0l0ZXJhdGUgPSBncmFwaC5ub2RlcygpO1xuZm9yIChsZXQgaT0wO2k8bm9kZXNJdGVyYXRlLmxlbmd0aDtpKyspe1xuICAgIGxldCBub2RlID0gbm9kZXNJdGVyYXRlW2ldO1xuICAgIG5ld05vZGUgPSB7aW5kZXg6aSx4OjAseTowLGxhYmVsOm5vZGUsdHJhbnNpdGlvbnM6W119O1xuICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZSA9IG5ld05vZGU7XG4gICAgd2luZG93LnN0YXRlcy5wdXNoKG5ld05vZGUpO1xufVxuXG5sZXQgbm9kZXMgPSBbcm9vdF07XG5mb3IgKGxldCBkZXB0aD0wO2RlcHRoPGRlcHRoX2xpbWl0O2RlcHRoKyspe1xuICAgIGxldCB4ID0gd2lkdGgvKGRlcHRoX2xpbWl0KjIpKihkZXB0aCoyKzEpO1xuICAgIGxldCBhZGphY2VudE5vZGVzID0gW107XG4gICAgZm9yIChsZXQgaT0wO2k8bm9kZXMubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHkgPSBoZWlnaHQgLyAobGFuZV9saW1pdCoyKSogKGkqMisxKVxuICAgICAgICBncmFwaERhdGFbbm9kZV0ud2luZG93U3RhdGUueCA9IHg7XG4gICAgICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZS55ID0geTtcbiAgICAgICAgLy9uZXdOb2RlID0ge2luZGV4OjAseDp4LHk6eSxsYWJlbDpub2RlLHRyYW5zaXRpb25zOltdfTtcbiAgICAgICAgLy9ncmFwaERhdGFbbm9kZV0ud2luZG93U3RhdGUgPSBuZXdOb2RlO1xuICAgICAgICAvL3dpbmRvdy5zdGF0ZXMucHVzaChuZXdOb2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhncmFwaC5hZGphY2VudChub2RlKSk7XG4gICAgICAgIGFkamFjZW50Tm9kZXMgPSBhZGphY2VudE5vZGVzLmNvbmNhdChncmFwaC5hZGphY2VudChub2RlKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coYWRqYWNlbnROb2Rlcyk7XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coYWRqYWNlbnROb2Rlcyk7XG4gICAgbm9kZXMgPSBbLi4ubmV3IFNldChhZGphY2VudE5vZGVzKV07XG59XG5mb3IgKGxldCBpPTA7aTx3aW5kb3cuc3RhdGVzLmxlbmd0aDtpKyspe1xuICAgIGxldCBub2RlU3RhdGUgPSB3aW5kb3cuc3RhdGVzW2ldO1xuICAgIC8vY29uc29sZS5sb2cobm9kZSk7XG4gICAgbGV0IGFkak5vZGVzID0gZ3JhcGguYWRqYWNlbnQobm9kZVN0YXRlLmxhYmVsKTtcbiAgICAvL2NvbnNvbGUubG9nKGFkak5vZGVzKTtcbiAgICBmb3IgKGxldCBhZGpOb2RlIG9mIGFkak5vZGVzKXtcbiAgICAgICAgY29uc29sZS5sb2coYWRqTm9kZSk7XG4gICAgICAgIC8vbm9kZVN0YXRlLnRyYW5zaXRpb25zLnB1c2goe2xhYmVsOid3aG9vJyx0YXJnZXQ6d2luZG93LnN0YXRlc1thZGpOb2RlXX0pO1xuICAgICAgICBub2RlU3RhdGUudHJhbnNpdGlvbnMucHVzaCh7bGFiZWw6J3dob28nLHRhcmdldDpncmFwaERhdGFbYWRqTm9kZV0ud2luZG93U3RhdGV9KTtcbiAgICB9XG59XG5cblxuLypcbmxldCB4ID0gd2lkdGgvKGRlcHRoKjIpLCB5ID0gaGVpZ2h0LyhsYW5lX2xpbWl0KjIpO1xubGV0IG5ld05vZGUgPSB7aW5kZXg6MCx4OngseTp5LGxhYmVsOnJvb3QsdHJhbnNpdGlvbnM6W119O1xuZ3JhcGhEYXRhW3Jvb3RdLndpbmRvd1N0YXRlID0gbmV3Tm9kZTtcbndpbmRvdy5zdGF0ZXMucHVzaChuZXdOb2RlKTtcblxubGV0IGFkamFjZW50Tm9kZXMgPSBncmFwaC5hZGphY2VudChyb290KTtcbnggPSB3aWR0aC8oZGVwdGgqMikqMywgeSA9IGhlaWdodC8obGFuZV9saW1pdCoyKTtcbmNvbnNvbGUubG9nKGFkamFjZW50Tm9kZXMpO1xuZm9yIChsZXQgaT0wO2k8YWRqYWNlbnROb2Rlcy5sZW5ndGg7aSsrKXtcbiAgICBsZXQgbm9kZSA9IGFkamFjZW50Tm9kZXNbaV07XG4gICAgeSA9IGhlaWdodC8obGFuZV9saW1pdCoyKSooaSoyKzEpO1xuICAgIG5ld05vZGUgPSB7aW5kZXg6MCx4OngseTp5LGxhYmVsOm5vZGUsdHJhbnNpdGlvbnM6W119O1xuICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZSA9IG5ld05vZGU7XG4gICAgd2luZG93LnN0YXRlcy5wdXNoKG5ld05vZGUpO1xufSovXG5cbi8qbGV0IHggPSA0MDtsZXQgeT00MDtsZXQgaW5kZXg9IDA7XG5sZXQgbm9kZXMgPSBncmFwaC5ub2RlcygpO1xuZm9yIChsZXQgaT0wO2k8bm9kZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICBsZXQgbmV3Tm9kZSA9IHtpbmRleDppbmRleCx4OngseTp5LGxhYmVsOm5vZGUsdHJhbnNpdGlvbnM6W119O1xuICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZSA9IG5ld05vZGU7XG4gICAgLy93aW5kb3cuc3RhdGVzW25vZGVdID0gbmV3Tm9kZTtcbiAgICB3aW5kb3cuc3RhdGVzLnB1c2gobmV3Tm9kZSk7XG4gICAgeCA9IHgrMTAwOyB5ID0geSsxMDA7IGluZGV4ID0gaW5kZXgrMTtcbn1cbmZvciAobGV0IGk9MDtpPHdpbmRvdy5zdGF0ZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGVTdGF0ZSA9IHdpbmRvdy5zdGF0ZXNbaV07XG4gICAgLy9jb25zb2xlLmxvZyhub2RlKTtcbiAgICBsZXQgYWRqTm9kZXMgPSBncmFwaC5hZGphY2VudChub2RlU3RhdGUubGFiZWwpO1xuICAgIC8vY29uc29sZS5sb2coYWRqTm9kZXMpO1xuICAgIGZvciAobGV0IGFkak5vZGUgb2YgYWRqTm9kZXMpe1xuICAgICAgICBjb25zb2xlLmxvZyhhZGpOb2RlKTtcbiAgICAgICAgLy9ub2RlU3RhdGUudHJhbnNpdGlvbnMucHVzaCh7bGFiZWw6J3dob28nLHRhcmdldDp3aW5kb3cuc3RhdGVzW2Fkak5vZGVdfSk7XG4gICAgICAgIG5vZGVTdGF0ZS50cmFuc2l0aW9ucy5wdXNoKHtsYWJlbDond2hvbycsdGFyZ2V0OmdyYXBoRGF0YVthZGpOb2RlXS53aW5kb3dTdGF0ZX0pO1xuICAgIH1cbn0qL1xuY29uc29sZS5sb2coXCJIZWxsbyBXb3JsZFwiKTtcbmluaXRpYWxpemVTVkcoKTtcblxuXG5cbnZhciBnU3RhdGVzID0gc3ZnLnNlbGVjdEFsbChcImcuc3RhdGVcIikuZGF0YShzdGF0ZXMpO1xuXG52YXIgdHJhbnNpdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3RhdGVzLnJlZHVjZSggZnVuY3Rpb24oIGluaXRpYWwsIHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbml0aWFsLmNvbmNhdCggXG4gICAgICAgICAgICBzdGF0ZS50cmFuc2l0aW9ucy5tYXAoIGZ1bmN0aW9uKCB0cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc291cmNlIDogc3RhdGUsIHRhcmdldCA6IHRyYW5zaXRpb24udGFyZ2V0fTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfSwgW10pO1xufTtcbiAgICAvLyBodHRwOi8vd3d3LmRhc2hpbmdkM2pzLmNvbS9zdmctcGF0aHMtYW5kLWQzanNcbnZhciBjb21wdXRlVHJhbnNpdGlvblBhdGggPSAvKmQzLnN2Zy5kaWFnb25hbC5yYWRpYWwoKSovZnVuY3Rpb24oIGQpIHtcbiAgICB2YXIgZGVsdGFYID0gZC50YXJnZXQueCAtIGQuc291cmNlLngsXG4gICAgZGVsdGFZID0gZC50YXJnZXQueSAtIGQuc291cmNlLnksXG4gICAgZGlzdCA9IE1hdGguc3FydChkZWx0YVggKiBkZWx0YVggKyBkZWx0YVkgKiBkZWx0YVkpLFxuICAgIG5vcm1YID0gZGVsdGFYIC8gZGlzdCxcbiAgICBub3JtWSA9IGRlbHRhWSAvIGRpc3QsXG4gICAgc291cmNlUGFkZGluZyA9IHJhZGl1cyArIDI7Ly9kLmxlZnQgPyAxNyA6IDEyLFxuICAgIHRhcmdldFBhZGRpbmcgPSByYWRpdXMgKyA2Oy8vZC5yaWdodCA/IDE3IDogMTIsXG4gICAgc291cmNlWCA9IGQuc291cmNlLnggKyAoc291cmNlUGFkZGluZyAqIG5vcm1YKSxcbiAgICBzb3VyY2VZID0gZC5zb3VyY2UueSArIChzb3VyY2VQYWRkaW5nICogbm9ybVkpLFxuICAgIHRhcmdldFggPSBkLnRhcmdldC54IC0gKHRhcmdldFBhZGRpbmcgKiBub3JtWCksXG4gICAgdGFyZ2V0WSA9IGQudGFyZ2V0LnkgLSAodGFyZ2V0UGFkZGluZyAqIG5vcm1ZKTtcbiAgICByZXR1cm4gJ00nICsgc291cmNlWCArICcsJyArIHNvdXJjZVkgKyAnTCcgKyB0YXJnZXRYICsgJywnICsgdGFyZ2V0WTtcbn07XG5cbnZhciBnVHJhbnNpdGlvbnMgPSBzdmcuYXBwZW5kKCAnZycpLnNlbGVjdEFsbCggXCJwYXRoLnRyYW5zaXRpb25cIikuZGF0YSh0cmFuc2l0aW9ucyk7XG5cbnZhciBzdGFydFN0YXRlLCBlbmRTdGF0ZTsgICAgXG52YXIgZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuLm9uKFwiZHJhZ1wiLCBmdW5jdGlvbiggZCwgaSkge1xuICAgIGlmKCBzdGFydFN0YXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbiA9IGQzLnNlbGVjdEFsbCggJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYoIHNlbGVjdGlvblswXS5pbmRleE9mKCB0aGlzKT09LTEpIHtcbiAgICAgICAgc2VsZWN0aW9uLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICBzZWxlY3Rpb24gPSBkMy5zZWxlY3QoIHRoaXMpO1xuICAgICAgICBzZWxlY3Rpb24uY2xhc3NlZCggXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICB9IFxuXG4gICAgc2VsZWN0aW9uLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oIGQsIGkpIHtcbiAgICAgICAgZC54ICs9IGQzLmV2ZW50LmR4O1xuICAgICAgICBkLnkgKz0gZDMuZXZlbnQuZHk7XG4gICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIFsgZC54LGQueSBdICsgXCIpXCJcbiAgICB9KVxuICAgICAgICAvLyByZWFwcGVuZCBkcmFnZ2VkIGVsZW1lbnQgYXMgbGFzdCBcbiAgICAgICAgLy8gc28gdGhhdCBpdHMgc3RheXMgb24gdG9wIFxuICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCggdGhpcyk7XG5cbiAgICBnVHJhbnNpdGlvbnMuYXR0ciggJ2QnLCBjb21wdXRlVHJhbnNpdGlvblBhdGgpO1xuICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xufSlcbi5vbiggXCJkcmFnZW5kXCIsIGZ1bmN0aW9uKCBkKSB7XG4gICAgLy8gVE9ETyA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQ2Njc0MDEvY2xpY2stZXZlbnQtbm90LWZpcmluZy1hZnRlci1kcmFnLXNvbWV0aW1lcy1pbi1kMy1qc1xuXG4gICAgLy8gbmVlZGVkIGJ5IEZGXG4gICAgLy9kcmFnX2xpbmUuY2xhc3NlZCgnaGlkZGVuJywgdHJ1ZSkuc3R5bGUoJ21hcmtlci1lbmQnLCAnJyk7XG5cbiAgICBpZiggc3RhcnRTdGF0ZSAmJiBlbmRTdGF0ZSkge1xuICAgICAgICBzdGFydFN0YXRlLnRyYW5zaXRpb25zLnB1c2goIHsgbGFiZWwgOiBcInRyYW5zaXRpb24gbGFiZWwgMVwiLCB0YXJnZXQgOiBlbmRTdGF0ZX0pO1xuICAgICAgICByZXN0YXJ0KCk7XG4gICAgfVxuXG4gICAgc3RhcnRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbn0pO1xuXG5zdmcub24oIFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xuICAgIGlmKCAhZDMuZXZlbnQuY3RybEtleSkge1xuICAgICAgICBkMy5zZWxlY3RBbGwoICdnLnNlbGVjdGVkJykuY2xhc3NlZCggXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHAgPSBkMy5tb3VzZSh0aGlzKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiTW91c2UgRG93blwiKTtcbiAgICBzdmcuYXBwZW5kKCBcInJlY3RcIikuYXR0cih7IHJ4OiA2LCByeTogNiwgY2xhc3M6IFwic2VsZWN0aW9uXCIsIHg6IHBbMF0sIHk6IHBbMV0sIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfSlcbn0pXG4ub24oIFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBwID0gZDMubW91c2UoIHRoaXMpLCBzID0gc3ZnLnNlbGVjdChcInJlY3Quc2VsZWN0aW9uXCIpO1xuXG4gICAgaWYoICFzLmVtcHR5KCkpIHtcbiAgICAgICAgdmFyIGQgPSB7IHg6cGFyc2VJbnQocy5hdHRyKFwieFwiKSwxMCkseTpwYXJzZUludChzLmF0dHIoXCJ5XCIpLDEwKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6cGFyc2VJbnQocy5hdHRyKFwid2lkdGhcIiksMTApLGhlaWdodDpwYXJzZUludChzLmF0dHIoIFwiaGVpZ2h0XCIpLCAxMCl9LFxuICAgICAgICBtb3ZlID0ge3ggOiBwWzBdIC0gZC54LCB5IDogcFsxXSAtIGQueX07XG4gICAgICAgIGlmKCBtb3ZlLnggPCAxIHx8IChtb3ZlLngqMjxkLndpZHRoKSkge1xuICAgICAgICAgICAgZC54ID0gcFswXTtcbiAgICAgICAgICAgIGQud2lkdGggLT0gbW92ZS54O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZC53aWR0aCA9IG1vdmUueDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBpZiggbW92ZS55IDwgMSB8fCAobW92ZS55KjI8ZC5oZWlnaHQpKSB7XG4gICAgICAgICAgICBkLnkgPSBwWzFdO1xuICAgICAgICAgICAgZC5oZWlnaHQgLT0gbW92ZS55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZC5oZWlnaHQgPSBtb3ZlLnk7ICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHMuYXR0ciggZCk7XG4gICAgICAgICAgICAvLyBkZXNlbGVjdCBhbGwgdGVtcG9yYXJ5IHNlbGVjdGVkIHN0YXRlIG9iamVjdHNcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24uc2VsZWN0ZWQnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZSA+Y2lyY2xlLmlubmVyJykuZWFjaCggZnVuY3Rpb24oIHN0YXRlX2RhdGEsIGkpIHtcbiAgICAgICAgICAgIGlmKCFkMy5zZWxlY3QoIHRoaXMpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIikgJiYgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlubmVyIGNpcmNsZSBpbnNpZGUgc2VsZWN0aW9uIGZyYW1lXG4gICAgICAgICAgICAgICAgc3RhdGVfZGF0YS54LXJhZGl1cz49ZC54ICYmIHN0YXRlX2RhdGEueCtyYWRpdXM8PWQueCtkLndpZHRoICYmIFxuICAgICAgICAgICAgICAgIHN0YXRlX2RhdGEueS1yYWRpdXM+PWQueSAmJiBzdGF0ZV9kYXRhLnkrcmFkaXVzPD1kLnkrZC5oZWlnaHRcbiAgICAgICAgICAgICkge1xuXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoIFwic2VsZWN0aW9uXCIsIHRydWUpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiggc3RhcnRTdGF0ZSkge1xuICAgICAgICAgICAgLy8gdXBkYXRlIGRyYWcgbGluZVxuICAgICAgICBkcmFnX2xpbmUuYXR0cignZCcsICdNJyArIHN0YXJ0U3RhdGUueCArICcsJyArIHN0YXJ0U3RhdGUueSArICdMJyArIHBbMF0gKyAnLCcgKyBwWzFdKTtcbiAgICAgICAgdmFyIHN0YXRlID0gZDMuc2VsZWN0KCAnZy5zdGF0ZS5ob3ZlcicpO1xuICAgICAgICBlbmRTdGF0ZSA9ICghc3RhdGUuZW1wdHkoKSAmJiBzdGF0ZS5kYXRhKClbMF0pIHx8IHVuZGVmaW5lZDtcbiAgICB9XG59KVxuLm9uKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAvLyByZW1vdmUgc2VsZWN0aW9uIGZyYW1lXG4gICAgc3ZnLnNlbGVjdEFsbCggXCJyZWN0LnNlbGVjdGlvblwiKS5yZW1vdmUoKTtcbiAgICAvLyByZW1vdmUgdGVtcG9yYXJ5IHNlbGVjdGlvbiBtYXJrZXIgY2xhc3NcbiAgICBkMy5zZWxlY3RBbGwoICdnLnN0YXRlLnNlbGVjdGlvbicpLmNsYXNzZWQoIFwic2VsZWN0aW9uXCIsIGZhbHNlKTtcbn0pXG4ub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcbiAgICBpZiggZDMuZXZlbnQucmVsYXRlZFRhcmdldC50YWdOYW1lPT0nSFRNTCcpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBmcmFtZVxuICAgICAgICBzdmcuc2VsZWN0QWxsKCBcInJlY3Quc2VsZWN0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICAvLyByZW1vdmUgdGVtcG9yYXJ5IHNlbGVjdGlvbiBtYXJrZXIgY2xhc3NcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24nKS5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCBmYWxzZSk7XG4gICAgfVxufSk7XG5yZXN0YXJ0KCk7XG5mdW5jdGlvbiByZXN0YXJ0KCkge1xuICAgIGNvbnNvbGUubG9nKFwiUkVTVEFSVFwiKTtcbiAgICBcbiAgICBnU3RhdGVzID0gZ1N0YXRlcy5kYXRhKHN0YXRlcyk7XG4gICAgdmFyIGdTdGF0ZSA9IGdTdGF0ZXMuZW50ZXIoKS5hcHBlbmQoIFwiZ1wiKVxuICAgICAgICAuYXR0cih7IFwidHJhbnNmb3JtXCIgOiBmdW5jdGlvbiggZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIrIFtkLngsZC55XSArIFwiKVwiO1xuICAgICAgICAgICAgfSwnY2xhc3MnOiAnc3RhdGUnLCdkYXRhLWlkJzpmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfSkuY2FsbCggZHJhZyk7XG4gICAgLypnU3RhdGUuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIC8vcng6IDUsd2lkdGg6ODAsaGVpZ2h0OjgwXG4gICAgICAgICAgICByICAgICAgIDogcmFkaXVzICsgMTAwLFxuICAgICAgICAgICAgY2xhc3MgICA6ICdvdXRlcidcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCBcIm1vdXNlZG93blwiLCBmdW5jdGlvbiggZCkge1xuICAgICAgICAgICAgc3RhcnRTdGF0ZSA9IGQsIGVuZFN0YXRlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVwb3NpdGlvbiBkcmFnIGxpbmVcbiAgICAgICAgICAgIGRyYWdfbGluZVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnbWFya2VyLWVuZCcsICd1cmwoI2VuZC1hcnJvdyknKVxuICAgICAgICAgICAgICAgIC5jbGFzc2VkKCdoaWRkZW4nLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAuYXR0cignZCcsICdNJyArIGQueCArICcsJyArIGQueSArICdMJyArIGQueCArICcsJyArIGQueSlcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIGVsZW1lbnQgdG8gYmUgYW4gdG9wXG4gICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCggdGhpcy5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm1vdXNlZG93blwiLCBzdGFydFN0YXRlKTtcbiAgICAgICAgfSk7Ki9cbiAgICBnU3RhdGUuYXBwZW5kKCdjaXJjbGUnKS5hdHRyKHtyOjQwLGNsYXNzOidpbm5lcid9KVxuICAgIC5vbihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGQsaSl7XG4gICAgICAgIGQzLnNlbGVjdCggdGhpcy5wYXJlbnROb2RlKS5jbGFzc2VkKCBcImhvdmVyXCIsIHRydWUpO30pXG4gICAgLm9uKFwiY2xpY2tcIixmdW5jdGlvbihkLGkpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNMSUNLRURcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGFyZW50Tm9kZS5kYXRhc2V0LmlkKTtcbiAgICAgICAgc2hvd0luZm9ybWF0aW9uKHRoaXMucGFyZW50Tm9kZS5kYXRhc2V0LmlkKTtcbiAgICB9KTtcbiAgICAvL2dTdGF0ZS5hcHBlbmQoJ3JlY3QnKS5hdHRyKHt9KTtcbiAgICAvKmdTdGF0ZS5hcHBlbmQoIFwiY2lyY2xlXCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgIC8vcng6IDUsd2lkdGg6ODAsaGVpZ2h0OjgwLFxuICAgICAgICAgICAgciAgICAgICA6IHJhZGl1cyxcbiAgICAgICAgICAgIGNsYXNzICAgOiAnaW5uZXInXG4gICAgICAgIH0pXG4gICAgICAgIC5vbiggXCJjbGlja1wiLCBmdW5jdGlvbiggZCwgaSkge1xuICAgICAgICAgICAgdmFyIGUgPSBkMy5ldmVudCxcbiAgICAgICAgICAgICAgICBnID0gdGhpcy5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQgPSBkMy5zZWxlY3QoIGcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIik7XG5cbiAgICAgICAgICAgIGlmKCAhZS5jdHJsS2V5KSB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zZWxlY3RlZCcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZDMuc2VsZWN0KCBnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIsICFpc1NlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAvLyByZWFwcGVuZCBkcmFnZ2VkIGVsZW1lbnQgYXMgbGFzdCBcbiAgICAgICAgICAgICAgICAvLyBzbyB0aGF0IGl0cyBzdGF5cyBvbiB0b3AgXG4gICAgICAgICAgICBnLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIGcpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGQzLnNlbGVjdCggdGhpcy5wYXJlbnROb2RlKS5jbGFzc2VkKCBcImhvdmVyXCIsIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICBkMy5zZWxlY3QoIHRoaXMucGFyZW50Tm9kZSkuY2xhc3NlZCggXCJob3ZlclwiLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIDsqL1xuXG4gICAgZ1N0YXRlLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgJ3RleHQtYW5jaG9yJyAgIDogJ21pZGRsZScsXG4gICAgICAgICAgICB5ICAgICAgICAgICAgICAgOiA0LFxuICAgICAgICAgICAgY2xhc3MgICAgICAgICAgIDogJ3RpdGxlJ1xuICAgICAgICB9KVxuICAgICAgICAudGV4dCggZnVuY3Rpb24oIGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICB9KVxuICAgIDtcbiAgICBnU3RhdGUuYXBwZW5kKCBcInRpdGxlXCIpLnRleHQoIGZ1bmN0aW9uKCBkKSB7XG4gICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgIH0pO1xuICAgIGdTdGF0ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgZ1RyYW5zaXRpb25zID0gZ1RyYW5zaXRpb25zLmRhdGEoIHRyYW5zaXRpb25zKTtcbiAgICBnVHJhbnNpdGlvbnMuZW50ZXIoKS5hcHBlbmQoICdwYXRoJylcbiAgICAgICAgLmF0dHIoICdjbGFzcycsICd0cmFuc2l0aW9uJylcbiAgICAgICAgLmF0dHIoICdkJywgY29tcHV0ZVRyYW5zaXRpb25QYXRoKVxuICAgIDsgICBcbiAgICBnVHJhbnNpdGlvbnMuZXhpdCgpLnJlbW92ZSgpO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEEgZ3JhcGggZGF0YSBzdHJ1Y3R1cmUgd2l0aCBkZXB0aC1maXJzdCBzZWFyY2ggYW5kIHRvcG9sb2dpY2FsIHNvcnQuXG5mdW5jdGlvbiBHcmFwaChzZXJpYWxpemVkKSB7XG4gICAgLy8gUmV0dXJuZWQgZ3JhcGggaW5zdGFuY2VcbiAgICB2YXIgZ3JhcGggPSB7XG4gICAgICAgIGFkZE5vZGU6IGFkZE5vZGUsXG4gICAgICAgIHJlbW92ZU5vZGU6IHJlbW92ZU5vZGUsXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgYWRqYWNlbnQ6IGFkamFjZW50LFxuICAgICAgICBhZGRFZGdlOiBhZGRFZGdlLFxuICAgICAgICByZW1vdmVFZGdlOiByZW1vdmVFZGdlLFxuICAgICAgICBzZXRFZGdlV2VpZ2h0OiBzZXRFZGdlV2VpZ2h0LFxuICAgICAgICBnZXRFZGdlV2VpZ2h0OiBnZXRFZGdlV2VpZ2h0LFxuICAgICAgICBpbmRlZ3JlZTogaW5kZWdyZWUsXG4gICAgICAgIG91dGRlZ3JlZTogb3V0ZGVncmVlLFxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoOiBkZXB0aEZpcnN0U2VhcmNoLFxuICAgICAgICBsb3dlc3RDb21tb25BbmNlc3RvcnM6IGxvd2VzdENvbW1vbkFuY2VzdG9ycyxcbiAgICAgICAgdG9wb2xvZ2ljYWxTb3J0OiB0b3BvbG9naWNhbFNvcnQsXG4gICAgICAgIHNob3J0ZXN0UGF0aDogc2hvcnRlc3RQYXRoLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplXG4gICAgfTtcbiAgICAvLyBUaGUgYWRqYWNlbmN5IGxpc3Qgb2YgdGhlIGdyYXBoLlxuICAgIC8vIEtleXMgYXJlIG5vZGUgaWRzLlxuICAgIC8vIFZhbHVlcyBhcmUgYWRqYWNlbnQgbm9kZSBpZCBhcnJheXMuXG4gICAgdmFyIGVkZ2VzID0ge307XG4gICAgLy8gVGhlIHdlaWdodHMgb2YgZWRnZXMuXG4gICAgLy8gS2V5cyBhcmUgc3RyaW5nIGVuY29kaW5ncyBvZiBlZGdlcy5cbiAgICAvLyBWYWx1ZXMgYXJlIHdlaWdodHMgKG51bWJlcnMpLlxuICAgIHZhciBlZGdlV2VpZ2h0cyA9IHt9O1xuICAgIC8vIElmIGEgc2VyaWFsaXplZCBncmFwaCB3YXMgcGFzc2VkIGludG8gdGhlIGNvbnN0cnVjdG9yLCBkZXNlcmlhbGl6ZSBpdC5cbiAgICBpZiAoc2VyaWFsaXplZCkge1xuICAgICAgICBkZXNlcmlhbGl6ZShzZXJpYWxpemVkKTtcbiAgICB9XG4gICAgLy8gQWRkcyBhIG5vZGUgdG8gdGhlIGdyYXBoLlxuICAgIC8vIElmIG5vZGUgd2FzIGFscmVhZHkgYWRkZWQsIHRoaXMgZnVuY3Rpb24gZG9lcyBub3RoaW5nLlxuICAgIC8vIElmIG5vZGUgd2FzIG5vdCBhbHJlYWR5IGFkZGVkLCB0aGlzIGZ1bmN0aW9uIHNldHMgdXAgYW4gZW1wdHkgYWRqYWNlbmN5IGxpc3QuXG4gICAgZnVuY3Rpb24gYWRkTm9kZShub2RlKSB7XG4gICAgICAgIGVkZ2VzW25vZGVdID0gYWRqYWNlbnQobm9kZSk7XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gUmVtb3ZlcyBhIG5vZGUgZnJvbSB0aGUgZ3JhcGguXG4gICAgLy8gQWxzbyByZW1vdmVzIGluY29taW5nIGFuZCBvdXRnb2luZyBlZGdlcy5cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGluY29taW5nIGVkZ2VzLlxuICAgICAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgZWRnZXNbdV0uZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICh2ID09PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUVkZ2UodSwgdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZW1vdmUgb3V0Z29pbmcgZWRnZXMgKGFuZCBzaWduYWwgdGhhdCB0aGUgbm9kZSBubyBsb25nZXIgZXhpc3RzKS5cbiAgICAgICAgZGVsZXRlIGVkZ2VzW25vZGVdO1xuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIEdldHMgdGhlIGxpc3Qgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGdyYXBoLlxuICAgIGZ1bmN0aW9uIG5vZGVzKCkge1xuICAgICAgICAvLyBUT0RPOiBCZXR0ZXIgaW1wbGVtZW50YXRpb24gd2l0aCBzZXQgZGF0YSBzdHJ1Y3R1cmVcbiAgICAgICAgdmFyIG5vZGVTZXQgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIG5vZGVTZXRbdV0gPSB0cnVlO1xuICAgICAgICAgICAgZWRnZXNbdV0uZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIG5vZGVTZXRbdl0gPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobm9kZVNldCk7XG4gICAgfVxuICAgIC8vIEdldHMgdGhlIGFkamFjZW50IG5vZGUgbGlzdCBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgLy8gUmV0dXJucyBhbiBlbXB0eSBhcnJheSBmb3IgdW5rbm93biBub2Rlcy5cbiAgICBmdW5jdGlvbiBhZGphY2VudChub2RlKSB7XG4gICAgICAgIHJldHVybiBlZGdlc1tub2RlXSB8fCBbXTtcbiAgICB9XG4gICAgLy8gQ29tcHV0ZXMgYSBzdHJpbmcgZW5jb2Rpbmcgb2YgYW4gZWRnZSxcbiAgICAvLyBmb3IgdXNlIGFzIGEga2V5IGluIGFuIG9iamVjdC5cbiAgICBmdW5jdGlvbiBlbmNvZGVFZGdlKHUsIHYpIHtcbiAgICAgICAgcmV0dXJuIHUgKyBcInxcIiArIHY7XG4gICAgfVxuICAgIC8vIFNldHMgdGhlIHdlaWdodCBvZiB0aGUgZ2l2ZW4gZWRnZS5cbiAgICBmdW5jdGlvbiBzZXRFZGdlV2VpZ2h0KHUsIHYsIHdlaWdodCkge1xuICAgICAgICBlZGdlV2VpZ2h0c1tlbmNvZGVFZGdlKHUsIHYpXSA9IHdlaWdodDtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBHZXRzIHRoZSB3ZWlnaHQgb2YgdGhlIGdpdmVuIGVkZ2UuXG4gICAgLy8gUmV0dXJucyAxIGlmIG5vIHdlaWdodCB3YXMgcHJldmlvdXNseSBzZXQuXG4gICAgZnVuY3Rpb24gZ2V0RWRnZVdlaWdodCh1LCB2KSB7XG4gICAgICAgIHZhciB3ZWlnaHQgPSBlZGdlV2VpZ2h0c1tlbmNvZGVFZGdlKHUsIHYpXTtcbiAgICAgICAgcmV0dXJuIHdlaWdodCA9PT0gdW5kZWZpbmVkID8gMSA6IHdlaWdodDtcbiAgICB9XG4gICAgLy8gQWRkcyBhbiBlZGdlIGZyb20gbm9kZSB1IHRvIG5vZGUgdi5cbiAgICAvLyBJbXBsaWNpdGx5IGFkZHMgdGhlIG5vZGVzIGlmIHRoZXkgd2VyZSBub3QgYWxyZWFkeSBhZGRlZC5cbiAgICBmdW5jdGlvbiBhZGRFZGdlKHUsIHYsIHdlaWdodCkge1xuICAgICAgICBhZGROb2RlKHUpO1xuICAgICAgICBhZGROb2RlKHYpO1xuICAgICAgICBhZGphY2VudCh1KS5wdXNoKHYpO1xuICAgICAgICBpZiAod2VpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldEVkZ2VXZWlnaHQodSwgdiwgd2VpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIFJlbW92ZXMgdGhlIGVkZ2UgZnJvbSBub2RlIHUgdG8gbm9kZSB2LlxuICAgIC8vIERvZXMgbm90IHJlbW92ZSB0aGUgbm9kZXMuXG4gICAgLy8gRG9lcyBub3RoaW5nIGlmIHRoZSBlZGdlIGRvZXMgbm90IGV4aXN0LlxuICAgIGZ1bmN0aW9uIHJlbW92ZUVkZ2UodSwgdikge1xuICAgICAgICBpZiAoZWRnZXNbdV0pIHtcbiAgICAgICAgICAgIGVkZ2VzW3VdID0gYWRqYWNlbnQodSkuZmlsdGVyKGZ1bmN0aW9uIChfdikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdiAhPT0gdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gQ29tcHV0ZXMgdGhlIGluZGVncmVlIGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgICAvLyBOb3QgdmVyeSBlZmZpY2llbnQsIGNvc3RzIE8oRSkgd2hlcmUgRSA9IG51bWJlciBvZiBlZGdlcy5cbiAgICBmdW5jdGlvbiBpbmRlZ3JlZShub2RlKSB7XG4gICAgICAgIHZhciBkZWdyZWUgPSAwO1xuICAgICAgICBmdW5jdGlvbiBjaGVjayh2KSB7XG4gICAgICAgICAgICBpZiAodiA9PT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIGRlZ3JlZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICBlZGdlc1t1XS5mb3JFYWNoKGNoZWNrKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWdyZWU7XG4gICAgfVxuICAgIC8vIENvbXB1dGVzIHRoZSBvdXRkZWdyZWUgZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIGZ1bmN0aW9uIG91dGRlZ3JlZShub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlIGluIGVkZ2VzID8gZWRnZXNbbm9kZV0ubGVuZ3RoIDogMDtcbiAgICB9XG4gICAgLy8gRGVwdGggRmlyc3QgU2VhcmNoIGFsZ29yaXRobSwgaW5zcGlyZWQgYnlcbiAgICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDYwNFxuICAgIC8vIFRoaXMgdmFyaWFudCBpbmNsdWRlcyBhbiBhZGRpdGlvbmFsIG9wdGlvblxuICAgIC8vIGBpbmNsdWRlU291cmNlTm9kZXNgIHRvIHNwZWNpZnkgd2hldGhlciB0byBpbmNsdWRlIG9yXG4gICAgLy8gZXhjbHVkZSB0aGUgc291cmNlIG5vZGVzIGZyb20gdGhlIHJlc3VsdCAodHJ1ZSBieSBkZWZhdWx0KS5cbiAgICAvLyBJZiBgc291cmNlTm9kZXNgIGlzIG5vdCBzcGVjaWZpZWQsIGFsbCBub2RlcyBpbiB0aGUgZ3JhcGhcbiAgICAvLyBhcmUgdXNlZCBhcyBzb3VyY2Ugbm9kZXMuXG4gICAgZnVuY3Rpb24gZGVwdGhGaXJzdFNlYXJjaChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKSB7XG4gICAgICAgIGlmIChpbmNsdWRlU291cmNlTm9kZXMgPT09IHZvaWQgMCkgeyBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlOyB9XG4gICAgICAgIGlmICghc291cmNlTm9kZXMpIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzID0gbm9kZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGluY2x1ZGVTb3VyY2VOb2RlcyAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIGluY2x1ZGVTb3VyY2VOb2RlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZpc2l0ZWQgPSB7fTtcbiAgICAgICAgdmFyIG5vZGVMaXN0ID0gW107XG4gICAgICAgIGZ1bmN0aW9uIERGU1Zpc2l0KG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghdmlzaXRlZFtub2RlXSkge1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFkamFjZW50KG5vZGUpLmZvckVhY2goREZTVmlzaXQpO1xuICAgICAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluY2x1ZGVTb3VyY2VOb2Rlcykge1xuICAgICAgICAgICAgc291cmNlTm9kZXMuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlTGlzdDtcbiAgICB9XG4gICAgLy8gTGVhc3QgQ29tbW9uIEFuY2VzdG9yc1xuICAgIC8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9yZWxheGVkd3MvbGNhL2Jsb2IvbWFzdGVyL3NyYy9Mb3dlc3RDb21tb25BbmNlc3Rvci5waHAgY29kZVxuICAgIC8vIGJ1dCB1c2VzIGRlcHRoIHNlYXJjaCBpbnN0ZWFkIG9mIGJyZWFkdGguIEFsc28gdXNlcyBzb21lIG9wdGltaXphdGlvbnNcbiAgICBmdW5jdGlvbiBsb3dlc3RDb21tb25BbmNlc3RvcnMobm9kZTEsIG5vZGUyKSB7XG4gICAgICAgIHZhciBub2RlMUFuY2VzdG9ycyA9IFtdO1xuICAgICAgICB2YXIgbGNhcyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBDQTFWaXNpdCh2aXNpdGVkLCBub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWRbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBub2RlMUFuY2VzdG9ycy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG5vZGUyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxjYXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBmb3VuZCAtIHNob3J0Y3V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhZGphY2VudChub2RlKS5ldmVyeShmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ0ExVmlzaXQodmlzaXRlZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBDQTJWaXNpdCh2aXNpdGVkLCBub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWRbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZTFBbmNlc3RvcnMuaW5kZXhPZihub2RlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxjYXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGNhcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDQTJWaXNpdCh2aXNpdGVkLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChDQTFWaXNpdCh7fSwgbm9kZTEpKSB7XG4gICAgICAgICAgICAvLyBObyBzaG9ydGN1dCB3b3JrZWRcbiAgICAgICAgICAgIENBMlZpc2l0KHt9LCBub2RlMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxjYXM7XG4gICAgfVxuICAgIC8vIFRoZSB0b3BvbG9naWNhbCBzb3J0IGFsZ29yaXRobSB5aWVsZHMgYSBsaXN0IG9mIHZpc2l0ZWQgbm9kZXNcbiAgICAvLyBzdWNoIHRoYXQgZm9yIGVhY2ggdmlzaXRlZCBlZGdlICh1LCB2KSwgdSBjb21lcyBiZWZvcmUgdiBpbiB0aGUgbGlzdC5cbiAgICAvLyBBbWF6aW5nbHksIHRoaXMgY29tZXMgZnJvbSBqdXN0IHJldmVyc2luZyB0aGUgcmVzdWx0IGZyb20gZGVwdGggZmlyc3Qgc2VhcmNoLlxuICAgIC8vIENvcm1lbiBldCBhbC4gXCJJbnRyb2R1Y3Rpb24gdG8gQWxnb3JpdGhtc1wiIDNyZCBFZC4gcC4gNjEzXG4gICAgZnVuY3Rpb24gdG9wb2xvZ2ljYWxTb3J0KHNvdXJjZU5vZGVzLCBpbmNsdWRlU291cmNlTm9kZXMpIHtcbiAgICAgICAgaWYgKGluY2x1ZGVTb3VyY2VOb2RlcyA9PT0gdm9pZCAwKSB7IGluY2x1ZGVTb3VyY2VOb2RlcyA9IHRydWU7IH1cbiAgICAgICAgcmV0dXJuIGRlcHRoRmlyc3RTZWFyY2goc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2RlcykucmV2ZXJzZSgpO1xuICAgIH1cbiAgICAvLyBEaWprc3RyYSdzIFNob3J0ZXN0IFBhdGggQWxnb3JpdGhtLlxuICAgIC8vIENvcm1lbiBldCBhbC4gXCJJbnRyb2R1Y3Rpb24gdG8gQWxnb3JpdGhtc1wiIDNyZCBFZC4gcC4gNjU4XG4gICAgLy8gVmFyaWFibGUgYW5kIGZ1bmN0aW9uIG5hbWVzIGNvcnJlc3BvbmQgdG8gbmFtZXMgaW4gdGhlIGJvb2suXG4gICAgZnVuY3Rpb24gc2hvcnRlc3RQYXRoKHNvdXJjZSwgZGVzdGluYXRpb24pIHtcbiAgICAgICAgLy8gVXBwZXIgYm91bmRzIGZvciBzaG9ydGVzdCBwYXRoIHdlaWdodHMgZnJvbSBzb3VyY2UuXG4gICAgICAgIHZhciBkID0ge307XG4gICAgICAgIC8vIFByZWRlY2Vzc29ycy5cbiAgICAgICAgdmFyIHAgPSB7fTtcbiAgICAgICAgLy8gUG9vciBtYW4ncyBwcmlvcml0eSBxdWV1ZSwga2V5ZWQgb24gZC5cbiAgICAgICAgdmFyIHEgPSB7fTtcbiAgICAgICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNpbmdsZVNvdXJjZSgpIHtcbiAgICAgICAgICAgIG5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGRbbm9kZV0gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGRbc291cmNlXSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb3VyY2Ugbm9kZSBpcyBub3QgaW4gdGhlIGdyYXBoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRbZGVzdGluYXRpb25dICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlc3RpbmF0aW9uIG5vZGUgaXMgbm90IGluIHRoZSBncmFwaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRbc291cmNlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkcyBlbnRyaWVzIGluIHEgZm9yIGFsbCBub2Rlcy5cbiAgICAgICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVByaW9yaXR5UXVldWUoKSB7XG4gICAgICAgICAgICBub2RlcygpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBxW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybnMgdHJ1ZSBpZiBxIGlzIGVtcHR5LlxuICAgICAgICBmdW5jdGlvbiBwcmlvcml0eVF1ZXVlRW1wdHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocSkubGVuZ3RoID09PSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIExpbmVhciBzZWFyY2ggdG8gZXh0cmFjdCAoZmluZCBhbmQgcmVtb3ZlKSBtaW4gZnJvbSBxLlxuICAgICAgICBmdW5jdGlvbiBleHRyYWN0TWluKCkge1xuICAgICAgICAgICAgdmFyIG1pbiA9IEluZmluaXR5O1xuICAgICAgICAgICAgdmFyIG1pbk5vZGU7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhxKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRbbm9kZV0gPCBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gZFtub2RlXTtcbiAgICAgICAgICAgICAgICAgICAgbWluTm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobWluTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2ggaGVyZSwgdGhlcmUncyBhIGRpc2Nvbm5lY3RlZCBzdWJncmFwaCwgYW5kIHdlJ3JlIGRvbmUuXG4gICAgICAgICAgICAgICAgcSA9IHt9O1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIHFbbWluTm9kZV07XG4gICAgICAgICAgICByZXR1cm4gbWluTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZWxheCh1LCB2KSB7XG4gICAgICAgICAgICB2YXIgdyA9IGdldEVkZ2VXZWlnaHQodSwgdik7XG4gICAgICAgICAgICBpZiAoZFt2XSA+IGRbdV0gKyB3KSB7XG4gICAgICAgICAgICAgICAgZFt2XSA9IGRbdV0gKyB3O1xuICAgICAgICAgICAgICAgIHBbdl0gPSB1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRpamtzdHJhKCkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZVNpbmdsZVNvdXJjZSgpO1xuICAgICAgICAgICAgaW5pdGlhbGl6ZVByaW9yaXR5UXVldWUoKTtcbiAgICAgICAgICAgIHdoaWxlICghcHJpb3JpdHlRdWV1ZUVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdSA9IGV4dHJhY3RNaW4oKTtcbiAgICAgICAgICAgICAgICBpZiAodSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGFkamFjZW50KHUpLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVsYXgodSwgdik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXNzZW1ibGVzIHRoZSBzaG9ydGVzdCBwYXRoIGJ5IHRyYXZlcnNpbmcgdGhlXG4gICAgICAgIC8vIHByZWRlY2Vzc29yIHN1YmdyYXBoIGZyb20gZGVzdGluYXRpb24gdG8gc291cmNlLlxuICAgICAgICBmdW5jdGlvbiBwYXRoKCkge1xuICAgICAgICAgICAgdmFyIG5vZGVMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgd2VpZ2h0ID0gMDtcbiAgICAgICAgICAgIHZhciBub2RlID0gZGVzdGluYXRpb247XG4gICAgICAgICAgICB3aGlsZSAocFtub2RlXSkge1xuICAgICAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ICs9IGdldEVkZ2VXZWlnaHQocFtub2RlXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZSA9IHBbbm9kZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gcGF0aCBmb3VuZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICBub2RlTGlzdC5yZXZlcnNlKCk7XG4gICAgICAgICAgICBub2RlTGlzdC53ZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgICAgICByZXR1cm4gbm9kZUxpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZGlqa3N0cmEoKTtcbiAgICAgICAgcmV0dXJuIHBhdGgoKTtcbiAgICB9XG4gICAgLy8gU2VyaWFsaXplcyB0aGUgZ3JhcGguXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplKCkge1xuICAgICAgICB2YXIgc2VyaWFsaXplZCA9IHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcygpLm1hcChmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWQgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbGlua3M6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHNlcmlhbGl6ZWQubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGUuaWQ7XG4gICAgICAgICAgICBhZGphY2VudChzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWQubGlua3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiBnZXRFZGdlV2VpZ2h0KHNvdXJjZSwgdGFyZ2V0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplZDtcbiAgICB9XG4gICAgLy8gRGVzZXJpYWxpemVzIHRoZSBnaXZlbiBzZXJpYWxpemVkIGdyYXBoLlxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplKHNlcmlhbGl6ZWQpIHtcbiAgICAgICAgc2VyaWFsaXplZC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBhZGROb2RlKG5vZGUuaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VyaWFsaXplZC5saW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG4gICAgICAgICAgICBhZGRFZGdlKGxpbmsuc291cmNlLCBsaW5rLnRhcmdldCwgbGluay53ZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBUaGUgcmV0dXJuZWQgZ3JhcGggaW5zdGFuY2UuXG4gICAgcmV0dXJuIGdyYXBoO1xufVxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcbiJdfQ==
