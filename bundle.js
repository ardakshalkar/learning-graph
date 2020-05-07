(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var firebaseConfig = {
    apiKey: "AIzaSyDxqsVGn147Elynzocvw7CSuqBfqlJ5dao",
    authDomain: "learninggraph-56737.firebaseapp.com",
    databaseURL: "https://learninggraph-56737.firebaseio.com",
    projectId: "learninggraph-56737",
    storageBucket: "learninggraph-56737.appspot.com",
    messagingSenderId: "177449874026",
    appId: "1:177449874026:web:51073e529f890685b5d013",
    measurementId: "G-WVNZ1PSGC8"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
console.log(firebase);
console.log(firebase.database());
firebase.database().ref('graph').once('value').then(function(snapshot){
    let data = snapshot.val();
    console.log(data);
});


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
function locateCard(level,index,items_amount){
    let x = width/(depth_limit*2)*(level*2+1);
    //let y = height / (lane_limit*2)* (index*2+1);
    let y = height/(items_amount+1)*(index+1);
    return {"x":x,"y":y};
}


let width = 960,height = 500, depth_limit = 5, lane_limit = 5;
let cardWidth = 150, cardHeight = 30;

let textSettings = {'text-anchor':'middle',y : 4,class:'title'};
let cardSettings = {x:-(cardWidth/2),y:-(cardHeight/2),width:cardWidth,height:cardHeight,rx:5,style:"fill:wheat;stroke:black"};
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
        y = height / (lane_limit*2)* (i*2+1);
        let coords = locateCard(depth,i,nodes.length);
        graphData[node].windowState.x = coords.x;
        graphData[node].windowState.y = coords.y;
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
    console.log(d);
    let deltaX = d.target.x - d.source.x, deltaY = d.target.y - d.source.y;

    sourceX = Math.floor(d.source.x+cardWidth/2),
    sourceY = Math.floor(d.source.y),
    targetX = Math.floor(d.target.x-cardWidth/2)-5,
    targetY = Math.floor(d.target.y);
    let bezier1X = 0, bezier1Y =0, bezier2X = 0, bezier2Y = 0;
    bezier1X = sourceX; bezier2X = targetX;
    bezier1Y = targetY; bezier2Y = sourceY;

    console.log('M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY);
    return 'M '+sourceX+' '+sourceY+' C '+bezier2X+' '+bezier2Y+','+bezier1X+' '+bezier1Y+','+targetX+' '+targetY;
    //return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
};

var gTransitions = svg.append( 'g').selectAll("path.transition").data(transitions);

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
    svg.append("rect").attr({ rx: 6, ry: 6, class: "selection", x: p[0], y: p[1], width: 0, height: 0 })
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
        svg.selectAll("rect.selection").remove();
        // remove temporary selection marker class
        d3.selectAll('g.state.selection').classed( "selection", false);
    }
});
restart();
function restart() {
    gStates = gStates.data(states);
    var gState = gStates.enter().append( "g")
        .attr({ "transform" : function( d) { return "translate("+ [d.x,d.y] + ")";
            },'class': 'state','data-id':function(d){
                //console.log(d);
                return d.label;
            } 
        }).call( drag);
    gState.append('rect').attr(cardSettings)
        .on("mouseover",function(d,i){ d3.select( this.parentNode).classed( "hover", true);})
        .on("click",function(d,i){ showInformation(this.parentNode.dataset.id); });

    gState.append("text").attr(textSettings).text( function( d) { return d.label; });
    gState.append("title").text( function( d) {return d.label; });
    gStates.exit().remove();

    gTransitions = gTransitions.data( transitions);
    gTransitions.enter().append( 'path')
        .attr('class', 'transition')
        .attr('d', computeTransitionPath)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJub2RlX21vZHVsZXMvZ3JhcGgtZGF0YS1zdHJ1Y3R1cmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgZmlyZWJhc2VDb25maWcgPSB7XG4gICAgYXBpS2V5OiBcIkFJemFTeUR4cXNWR24xNDdFbHluem9jdnc3Q1N1cUJmcWxKNWRhb1wiLFxuICAgIGF1dGhEb21haW46IFwibGVhcm5pbmdncmFwaC01NjczNy5maXJlYmFzZWFwcC5jb21cIixcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL2xlYXJuaW5nZ3JhcGgtNTY3MzcuZmlyZWJhc2Vpby5jb21cIixcbiAgICBwcm9qZWN0SWQ6IFwibGVhcm5pbmdncmFwaC01NjczN1wiLFxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwibGVhcm5pbmdncmFwaC01NjczNy5hcHBzcG90LmNvbVwiLFxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjE3NzQ0OTg3NDAyNlwiLFxuICAgIGFwcElkOiBcIjE6MTc3NDQ5ODc0MDI2OndlYjo1MTA3M2U1MjlmODkwNjg1YjVkMDEzXCIsXG4gICAgbWVhc3VyZW1lbnRJZDogXCJHLVdWTloxUFNHQzhcIlxuICB9O1xuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG5maXJlYmFzZS5hbmFseXRpY3MoKTtcbmNvbnNvbGUubG9nKGZpcmViYXNlKTtcbmNvbnNvbGUubG9nKGZpcmViYXNlLmRhdGFiYXNlKCkpO1xuZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoJ2dyYXBoJykub25jZSgndmFsdWUnKS50aGVuKGZ1bmN0aW9uKHNuYXBzaG90KXtcbiAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xufSk7XG5cblxuZnVuY3Rpb24gc2hvd0luZm9ybWF0aW9uKGlkKXtcbiAgICBsZXQgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGV0YWlsc1wiKTtcbiAgICBkZXRhaWxzLmlubmVySFRNTCA9IGdyYXBoRGF0YVtpZF0udGl0bGUrXCI8YnIvPlwiK2dyYXBoRGF0YVtpZF0uZGVzY3JpcHRpb247XG59XG5mdW5jdGlvbiBpbml0aWFsaXplU1ZHKCl7XG4gICAgd2luZG93LnN2ZyA9IGQzLnNlbGVjdCgnYm9keScpXG4gICAgLmFwcGVuZChcInN2Z1wiKVxuICAgIC8vLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgMTAwMCArIFwiIFwiICsgMTAwMCApXG4gICAgLy8uYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWluWU1pblwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCI5NjBweFwiKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiNTAwcHhcIik7ICAgIFxuICAgIFxuICAgICAgICAvLyBkZWZpbmUgYXJyb3cgbWFya2VycyBmb3IgZ3JhcGggbGlua3NcbiAgICBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdlbmQtYXJyb3cnKVxuICAgICAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAgICAgLmF0dHIoJ3JlZlgnLCAzKVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnLCA4KVxuICAgICAgICAuYXR0cignbWFya2VySGVpZ2h0JywgOClcbiAgICAgICAgLmF0dHIoJ29yaWVudCcsICdhdXRvJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignZCcsICdNMCwtNUwxMCwwTDAsNScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcbiAgICBcbiAgICBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdzdGFydC1hcnJvdycpXG4gICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgLTUgMTAgMTAnKVxuICAgICAgICAuYXR0cigncmVmWCcsIDQpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJXaWR0aCcsIDgpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJIZWlnaHQnLCA4KVxuICAgICAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxuICAgICAgICAuYXBwZW5kKCdzdmc6cGF0aCcpXG4gICAgICAgIC5hdHRyKCdkJywgJ00xMCwtNUwwLDBMMTAsNScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcbiAgICBcbiAgICAgICAgLy8gbGluZSBkaXNwbGF5ZWQgd2hlbiBkcmFnZ2luZyBuZXcgbm9kZXNcbiAgICB2YXIgZHJhZ19saW5lID0gc3ZnLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZHJhZ2xpbmUgaGlkZGVuJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsMEwwLDAnKVxuICAgIDtcbn1cbmZ1bmN0aW9uIGxvY2F0ZUNhcmQobGV2ZWwsaW5kZXgsaXRlbXNfYW1vdW50KXtcbiAgICBsZXQgeCA9IHdpZHRoLyhkZXB0aF9saW1pdCoyKSoobGV2ZWwqMisxKTtcbiAgICAvL2xldCB5ID0gaGVpZ2h0IC8gKGxhbmVfbGltaXQqMikqIChpbmRleCoyKzEpO1xuICAgIGxldCB5ID0gaGVpZ2h0LyhpdGVtc19hbW91bnQrMSkqKGluZGV4KzEpO1xuICAgIHJldHVybiB7XCJ4XCI6eCxcInlcIjp5fTtcbn1cblxuXG5sZXQgd2lkdGggPSA5NjAsaGVpZ2h0ID0gNTAwLCBkZXB0aF9saW1pdCA9IDUsIGxhbmVfbGltaXQgPSA1O1xubGV0IGNhcmRXaWR0aCA9IDE1MCwgY2FyZEhlaWdodCA9IDMwO1xuXG5sZXQgdGV4dFNldHRpbmdzID0geyd0ZXh0LWFuY2hvcic6J21pZGRsZScseSA6IDQsY2xhc3M6J3RpdGxlJ307XG5sZXQgY2FyZFNldHRpbmdzID0ge3g6LShjYXJkV2lkdGgvMikseTotKGNhcmRIZWlnaHQvMiksd2lkdGg6Y2FyZFdpZHRoLGhlaWdodDpjYXJkSGVpZ2h0LHJ4OjUsc3R5bGU6XCJmaWxsOndoZWF0O3N0cm9rZTpibGFja1wifTtcbnZhciBHcmFwaCA9IHJlcXVpcmUoXCJncmFwaC1kYXRhLXN0cnVjdHVyZVwiKTtcbmxldCBncmFwaERhdGEgPSB7XG4gICAgXCJDU1MgMTAxXCI6e3RpdGxlOlwiQ3JlYXRlIFBob25lYm9va1wiLGRlc2NyaXB0aW9uOlwiQ3JlYXRlIFBob25lYm9vaywgd2hlcmUgZGF0YSBpcyBzdG9yZWQgaW4gZmlsZVwifSxcbiAgICBcIkNTUyAxMDJcIjp7dGl0bGU6XCJTdHJpbmcgY2xhc3NcIixkZXNjcmlwdGlvbjpcIkltcGxlbWVudCBTdHJpbmcgY2xhc3MsIHdpdGhvdXQgdXNpbmcgc3RhbmRhcmQgSmF2YSBTdHJpbmdcIn0sXG4gICAgXCJDU1MgMTAzXCI6e3RpdGxlOlwiQmFuayBjYXNoaWVyXCIsIGRlc2NyaXB0aW9uOlwiSW1wbGVtZW50IEJhbmsgY2FzaGllclwifSxcbiAgICBcIkNTUyAxMDRcIjp7dGl0bGU6XCJDaGVzc1wiLGRlc2NyaXB0aW9uOlwiQ2hlc3MgZ2FtZVwifSxcbiAgICBcIkNTUyAxMDVcIjp7dGl0bGU6XCJMYW5kaW5nIHBhZ2VcIixkZXNjcmlwdGlvbjpcIkltcGxlbWVudCBsYW5kaW5nIHBhZ2VcIn0sXG4gICAgXCJDU1MgMTA2XCI6e3RpdGxlOlwiQ3JlYXRlIEUtY29tbWVyc2Ugc3RvcmVcIixkZXNjcmlwdGlvbjpcIllvdSBzaG91bGQgY3JlYXRlIGUtY29tbWVyY2UgcGFnZSB3aGVyZSB1c2VycyBjYW4gYnV5IGl0ZW1zXCJ9XG59O1xubGV0IGdyYXBoID0gR3JhcGgoKTtcbmdyYXBoLmFkZE5vZGUoXCJDU1MgMTAxXCIpLmFkZE5vZGUoXCJDU1MgMTAyXCIpLmFkZE5vZGUoXCJDU1MgMTAzXCIpXG4gICAgICAgIC5hZGROb2RlKFwiQ1NTIDEwNFwiKS5hZGROb2RlKFwiQ1NTIDEwNVwiKS5hZGROb2RlKFwiQ1NTIDEwNlwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAxXCIsXCJDU1MgMTAyXCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDFcIixcIkNTUyAxMDNcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMlwiLFwiQ1NTIDEwNFwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAyXCIsXCJDU1MgMTA1XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDNcIixcIkNTUyAxMDVcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMlwiLFwiQ1NTIDEwNlwiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTA0XCIsXCJDU1MgMTA2XCIpO1xubGV0IHJvb3QgPSBcIkNTUyAxMDFcIjtcbnZhciByYWRpdXMgPSA0MDtcbndpbmRvdy5zdGF0ZXMgPSBbXTtcblxubGV0IG5vZGVzSXRlcmF0ZSA9IGdyYXBoLm5vZGVzKCk7XG5mb3IgKGxldCBpPTA7aTxub2Rlc0l0ZXJhdGUubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc0l0ZXJhdGVbaV07XG4gICAgbmV3Tm9kZSA9IHtpbmRleDppLHg6MCx5OjAsbGFiZWw6bm9kZSx0cmFuc2l0aW9uczpbXX07XG4gICAgZ3JhcGhEYXRhW25vZGVdLndpbmRvd1N0YXRlID0gbmV3Tm9kZTtcbiAgICB3aW5kb3cuc3RhdGVzLnB1c2gobmV3Tm9kZSk7XG59XG5cbmxldCBub2RlcyA9IFtyb290XTtcbmZvciAobGV0IGRlcHRoPTA7ZGVwdGg8ZGVwdGhfbGltaXQ7ZGVwdGgrKyl7XG4gICAgbGV0IHggPSB3aWR0aC8oZGVwdGhfbGltaXQqMikqKGRlcHRoKjIrMSk7XG4gICAgbGV0IGFkamFjZW50Tm9kZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpPTA7aTxub2Rlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgeSA9IGhlaWdodCAvIChsYW5lX2xpbWl0KjIpKiAoaSoyKzEpO1xuICAgICAgICBsZXQgY29vcmRzID0gbG9jYXRlQ2FyZChkZXB0aCxpLG5vZGVzLmxlbmd0aCk7XG4gICAgICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZS54ID0gY29vcmRzLng7XG4gICAgICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZS55ID0gY29vcmRzLnk7XG4gICAgICAgIGFkamFjZW50Tm9kZXMgPSBhZGphY2VudE5vZGVzLmNvbmNhdChncmFwaC5hZGphY2VudChub2RlKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coYWRqYWNlbnROb2Rlcyk7XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coYWRqYWNlbnROb2Rlcyk7XG4gICAgbm9kZXMgPSBbLi4ubmV3IFNldChhZGphY2VudE5vZGVzKV07XG59XG5mb3IgKGxldCBpPTA7aTx3aW5kb3cuc3RhdGVzLmxlbmd0aDtpKyspe1xuICAgIGxldCBub2RlU3RhdGUgPSB3aW5kb3cuc3RhdGVzW2ldO1xuICAgIC8vY29uc29sZS5sb2cobm9kZSk7XG4gICAgbGV0IGFkak5vZGVzID0gZ3JhcGguYWRqYWNlbnQobm9kZVN0YXRlLmxhYmVsKTtcbiAgICAvL2NvbnNvbGUubG9nKGFkak5vZGVzKTtcbiAgICBmb3IgKGxldCBhZGpOb2RlIG9mIGFkak5vZGVzKXtcbiAgICAgICAgY29uc29sZS5sb2coYWRqTm9kZSk7XG4gICAgICAgIC8vbm9kZVN0YXRlLnRyYW5zaXRpb25zLnB1c2goe2xhYmVsOid3aG9vJyx0YXJnZXQ6d2luZG93LnN0YXRlc1thZGpOb2RlXX0pO1xuICAgICAgICBub2RlU3RhdGUudHJhbnNpdGlvbnMucHVzaCh7bGFiZWw6J3dob28nLHRhcmdldDpncmFwaERhdGFbYWRqTm9kZV0ud2luZG93U3RhdGV9KTtcbiAgICB9XG59XG5cbmNvbnNvbGUubG9nKFwiSGVsbG8gV29ybGRcIik7XG5pbml0aWFsaXplU1ZHKCk7XG5cblxuXG52YXIgZ1N0YXRlcyA9IHN2Zy5zZWxlY3RBbGwoXCJnLnN0YXRlXCIpLmRhdGEoc3RhdGVzKTtcblxudmFyIHRyYW5zaXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0YXRlcy5yZWR1Y2UoIGZ1bmN0aW9uKCBpbml0aWFsLCBzdGF0ZSkge1xuICAgICAgICByZXR1cm4gaW5pdGlhbC5jb25jYXQoIFxuICAgICAgICAgICAgc3RhdGUudHJhbnNpdGlvbnMubWFwKCBmdW5jdGlvbiggdHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHNvdXJjZSA6IHN0YXRlLCB0YXJnZXQgOiB0cmFuc2l0aW9uLnRhcmdldH07XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH0sIFtdKTtcbn07XG4gICAgLy8gaHR0cDovL3d3dy5kYXNoaW5nZDNqcy5jb20vc3ZnLXBhdGhzLWFuZC1kM2pzXG52YXIgY29tcHV0ZVRyYW5zaXRpb25QYXRoID0gLypkMy5zdmcuZGlhZ29uYWwucmFkaWFsKCkqL2Z1bmN0aW9uKCBkKSB7XG4gICAgY29uc29sZS5sb2coZCk7XG4gICAgbGV0IGRlbHRhWCA9IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54LCBkZWx0YVkgPSBkLnRhcmdldC55IC0gZC5zb3VyY2UueTtcblxuICAgIHNvdXJjZVggPSBNYXRoLmZsb29yKGQuc291cmNlLngrY2FyZFdpZHRoLzIpLFxuICAgIHNvdXJjZVkgPSBNYXRoLmZsb29yKGQuc291cmNlLnkpLFxuICAgIHRhcmdldFggPSBNYXRoLmZsb29yKGQudGFyZ2V0LngtY2FyZFdpZHRoLzIpLTUsXG4gICAgdGFyZ2V0WSA9IE1hdGguZmxvb3IoZC50YXJnZXQueSk7XG4gICAgbGV0IGJlemllcjFYID0gMCwgYmV6aWVyMVkgPTAsIGJlemllcjJYID0gMCwgYmV6aWVyMlkgPSAwO1xuICAgIGJlemllcjFYID0gc291cmNlWDsgYmV6aWVyMlggPSB0YXJnZXRYO1xuICAgIGJlemllcjFZID0gdGFyZ2V0WTsgYmV6aWVyMlkgPSBzb3VyY2VZO1xuXG4gICAgY29uc29sZS5sb2coJ00nICsgc291cmNlWCArICcsJyArIHNvdXJjZVkgKyAnTCcgKyB0YXJnZXRYICsgJywnICsgdGFyZ2V0WSk7XG4gICAgcmV0dXJuICdNICcrc291cmNlWCsnICcrc291cmNlWSsnIEMgJytiZXppZXIyWCsnICcrYmV6aWVyMlkrJywnK2JlemllcjFYKycgJytiZXppZXIxWSsnLCcrdGFyZ2V0WCsnICcrdGFyZ2V0WTtcbiAgICAvL3JldHVybiAnTScgKyBzb3VyY2VYICsgJywnICsgc291cmNlWSArICdMJyArIHRhcmdldFggKyAnLCcgKyB0YXJnZXRZO1xufTtcblxudmFyIGdUcmFuc2l0aW9ucyA9IHN2Zy5hcHBlbmQoICdnJykuc2VsZWN0QWxsKFwicGF0aC50cmFuc2l0aW9uXCIpLmRhdGEodHJhbnNpdGlvbnMpO1xuXG52YXIgc3RhcnRTdGF0ZSwgZW5kU3RhdGU7ICAgIFxudmFyIGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcbi5vbihcImRyYWdcIiwgZnVuY3Rpb24oIGQsIGkpIHtcbiAgICBpZiggc3RhcnRTdGF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb24gPSBkMy5zZWxlY3RBbGwoICcuc2VsZWN0ZWQnKTtcblxuICAgIGlmKCBzZWxlY3Rpb25bMF0uaW5kZXhPZiggdGhpcyk9PS0xKSB7XG4gICAgICAgIHNlbGVjdGlvbi5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgc2VsZWN0aW9uID0gZDMuc2VsZWN0KCB0aGlzKTtcbiAgICAgICAgc2VsZWN0aW9uLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgfSBcblxuICAgIHNlbGVjdGlvbi5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCBkLCBpKSB7XG4gICAgICAgIGQueCArPSBkMy5ldmVudC5keDtcbiAgICAgICAgZC55ICs9IGQzLmV2ZW50LmR5O1xuICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBbIGQueCxkLnkgXSArIFwiKVwiXG4gICAgfSlcbiAgICAgICAgLy8gcmVhcHBlbmQgZHJhZ2dlZCBlbGVtZW50IGFzIGxhc3QgXG4gICAgICAgIC8vIHNvIHRoYXQgaXRzIHN0YXlzIG9uIHRvcCBcbiAgICB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHRoaXMpO1xuXG4gICAgZ1RyYW5zaXRpb25zLmF0dHIoICdkJywgY29tcHV0ZVRyYW5zaXRpb25QYXRoKTtcbiAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbn0pXG4ub24oIFwiZHJhZ2VuZFwiLCBmdW5jdGlvbiggZCkge1xuICAgIC8vIFRPRE8gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0NjY3NDAxL2NsaWNrLWV2ZW50LW5vdC1maXJpbmctYWZ0ZXItZHJhZy1zb21ldGltZXMtaW4tZDMtanNcblxuICAgIC8vIG5lZWRlZCBieSBGRlxuICAgIC8vZHJhZ19saW5lLmNsYXNzZWQoJ2hpZGRlbicsIHRydWUpLnN0eWxlKCdtYXJrZXItZW5kJywgJycpO1xuXG4gICAgaWYoIHN0YXJ0U3RhdGUgJiYgZW5kU3RhdGUpIHtcbiAgICAgICAgc3RhcnRTdGF0ZS50cmFuc2l0aW9ucy5wdXNoKCB7IGxhYmVsIDogXCJ0cmFuc2l0aW9uIGxhYmVsIDFcIiwgdGFyZ2V0IDogZW5kU3RhdGV9KTtcbiAgICAgICAgcmVzdGFydCgpO1xuICAgIH1cblxuICAgIHN0YXJ0U3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59KTtcblxuc3ZnLm9uKCBcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICBpZiggIWQzLmV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zZWxlY3RlZCcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIHZhciBwID0gZDMubW91c2UodGhpcyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk1vdXNlIERvd25cIik7XG4gICAgc3ZnLmFwcGVuZChcInJlY3RcIikuYXR0cih7IHJ4OiA2LCByeTogNiwgY2xhc3M6IFwic2VsZWN0aW9uXCIsIHg6IHBbMF0sIHk6IHBbMV0sIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfSlcbn0pXG4ub24oIFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBwID0gZDMubW91c2UoIHRoaXMpLCBzID0gc3ZnLnNlbGVjdChcInJlY3Quc2VsZWN0aW9uXCIpO1xuXG4gICAgaWYoICFzLmVtcHR5KCkpIHtcbiAgICAgICAgdmFyIGQgPSB7IHg6cGFyc2VJbnQocy5hdHRyKFwieFwiKSwxMCkseTpwYXJzZUludChzLmF0dHIoXCJ5XCIpLDEwKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6cGFyc2VJbnQocy5hdHRyKFwid2lkdGhcIiksMTApLGhlaWdodDpwYXJzZUludChzLmF0dHIoIFwiaGVpZ2h0XCIpLCAxMCl9LFxuICAgICAgICBtb3ZlID0ge3ggOiBwWzBdIC0gZC54LCB5IDogcFsxXSAtIGQueX07XG4gICAgICAgIGlmKCBtb3ZlLnggPCAxIHx8IChtb3ZlLngqMjxkLndpZHRoKSkge1xuICAgICAgICAgICAgZC54ID0gcFswXTtcbiAgICAgICAgICAgIGQud2lkdGggLT0gbW92ZS54O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZC53aWR0aCA9IG1vdmUueDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBpZiggbW92ZS55IDwgMSB8fCAobW92ZS55KjI8ZC5oZWlnaHQpKSB7XG4gICAgICAgICAgICBkLnkgPSBwWzFdO1xuICAgICAgICAgICAgZC5oZWlnaHQgLT0gbW92ZS55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZC5oZWlnaHQgPSBtb3ZlLnk7ICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHMuYXR0ciggZCk7XG4gICAgICAgICAgICAvLyBkZXNlbGVjdCBhbGwgdGVtcG9yYXJ5IHNlbGVjdGVkIHN0YXRlIG9iamVjdHNcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24uc2VsZWN0ZWQnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZSA+Y2lyY2xlLmlubmVyJykuZWFjaCggZnVuY3Rpb24oIHN0YXRlX2RhdGEsIGkpIHtcbiAgICAgICAgICAgIGlmKCFkMy5zZWxlY3QoIHRoaXMpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIikgJiYgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlubmVyIGNpcmNsZSBpbnNpZGUgc2VsZWN0aW9uIGZyYW1lXG4gICAgICAgICAgICAgICAgc3RhdGVfZGF0YS54LXJhZGl1cz49ZC54ICYmIHN0YXRlX2RhdGEueCtyYWRpdXM8PWQueCtkLndpZHRoICYmIFxuICAgICAgICAgICAgICAgIHN0YXRlX2RhdGEueS1yYWRpdXM+PWQueSAmJiBzdGF0ZV9kYXRhLnkrcmFkaXVzPD1kLnkrZC5oZWlnaHRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCggdGhpcy5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgIC5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCB0cnVlKVxuICAgICAgICAgICAgICAgIC5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYoIHN0YXJ0U3RhdGUpIHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBkcmFnIGxpbmVcbiAgICAgICAgZHJhZ19saW5lLmF0dHIoJ2QnLCAnTScgKyBzdGFydFN0YXRlLnggKyAnLCcgKyBzdGFydFN0YXRlLnkgKyAnTCcgKyBwWzBdICsgJywnICsgcFsxXSk7XG4gICAgICAgIHZhciBzdGF0ZSA9IGQzLnNlbGVjdCggJ2cuc3RhdGUuaG92ZXInKTtcbiAgICAgICAgZW5kU3RhdGUgPSAoIXN0YXRlLmVtcHR5KCkgJiYgc3RhdGUuZGF0YSgpWzBdKSB8fCB1bmRlZmluZWQ7XG4gICAgfVxufSlcbi5vbihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBmcmFtZVxuICAgIHN2Zy5zZWxlY3RBbGwoIFwicmVjdC5zZWxlY3Rpb25cIikucmVtb3ZlKCk7XG4gICAgLy8gcmVtb3ZlIHRlbXBvcmFyeSBzZWxlY3Rpb24gbWFya2VyIGNsYXNzXG4gICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24nKS5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCBmYWxzZSk7XG59KVxuLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgaWYoIGQzLmV2ZW50LnJlbGF0ZWRUYXJnZXQudGFnTmFtZT09J0hUTUwnKSB7XG4gICAgICAgIC8vIHJlbW92ZSBzZWxlY3Rpb24gZnJhbWVcbiAgICAgICAgc3ZnLnNlbGVjdEFsbChcInJlY3Quc2VsZWN0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICAvLyByZW1vdmUgdGVtcG9yYXJ5IHNlbGVjdGlvbiBtYXJrZXIgY2xhc3NcbiAgICAgICAgZDMuc2VsZWN0QWxsKCdnLnN0YXRlLnNlbGVjdGlvbicpLmNsYXNzZWQoIFwic2VsZWN0aW9uXCIsIGZhbHNlKTtcbiAgICB9XG59KTtcbnJlc3RhcnQoKTtcbmZ1bmN0aW9uIHJlc3RhcnQoKSB7XG4gICAgZ1N0YXRlcyA9IGdTdGF0ZXMuZGF0YShzdGF0ZXMpO1xuICAgIHZhciBnU3RhdGUgPSBnU3RhdGVzLmVudGVyKCkuYXBwZW5kKCBcImdcIilcbiAgICAgICAgLmF0dHIoeyBcInRyYW5zZm9ybVwiIDogZnVuY3Rpb24oIGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiKyBbZC54LGQueV0gKyBcIilcIjtcbiAgICAgICAgICAgIH0sJ2NsYXNzJzogJ3N0YXRlJywnZGF0YS1pZCc6ZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pLmNhbGwoIGRyYWcpO1xuICAgIGdTdGF0ZS5hcHBlbmQoJ3JlY3QnKS5hdHRyKGNhcmRTZXR0aW5ncylcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZCxpKXsgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpLmNsYXNzZWQoIFwiaG92ZXJcIiwgdHJ1ZSk7fSlcbiAgICAgICAgLm9uKFwiY2xpY2tcIixmdW5jdGlvbihkLGkpeyBzaG93SW5mb3JtYXRpb24odGhpcy5wYXJlbnROb2RlLmRhdGFzZXQuaWQpOyB9KTtcblxuICAgIGdTdGF0ZS5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIodGV4dFNldHRpbmdzKS50ZXh0KCBmdW5jdGlvbiggZCkgeyByZXR1cm4gZC5sYWJlbDsgfSk7XG4gICAgZ1N0YXRlLmFwcGVuZChcInRpdGxlXCIpLnRleHQoIGZ1bmN0aW9uKCBkKSB7cmV0dXJuIGQubGFiZWw7IH0pO1xuICAgIGdTdGF0ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgZ1RyYW5zaXRpb25zID0gZ1RyYW5zaXRpb25zLmRhdGEoIHRyYW5zaXRpb25zKTtcbiAgICBnVHJhbnNpdGlvbnMuZW50ZXIoKS5hcHBlbmQoICdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RyYW5zaXRpb24nKVxuICAgICAgICAuYXR0cignZCcsIGNvbXB1dGVUcmFuc2l0aW9uUGF0aClcbiAgICA7ICAgXG4gICAgZ1RyYW5zaXRpb25zLmV4aXQoKS5yZW1vdmUoKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBBIGdyYXBoIGRhdGEgc3RydWN0dXJlIHdpdGggZGVwdGgtZmlyc3Qgc2VhcmNoIGFuZCB0b3BvbG9naWNhbCBzb3J0LlxuZnVuY3Rpb24gR3JhcGgoc2VyaWFsaXplZCkge1xuICAgIC8vIFJldHVybmVkIGdyYXBoIGluc3RhbmNlXG4gICAgdmFyIGdyYXBoID0ge1xuICAgICAgICBhZGROb2RlOiBhZGROb2RlLFxuICAgICAgICByZW1vdmVOb2RlOiByZW1vdmVOb2RlLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGFkamFjZW50OiBhZGphY2VudCxcbiAgICAgICAgYWRkRWRnZTogYWRkRWRnZSxcbiAgICAgICAgcmVtb3ZlRWRnZTogcmVtb3ZlRWRnZSxcbiAgICAgICAgc2V0RWRnZVdlaWdodDogc2V0RWRnZVdlaWdodCxcbiAgICAgICAgZ2V0RWRnZVdlaWdodDogZ2V0RWRnZVdlaWdodCxcbiAgICAgICAgaW5kZWdyZWU6IGluZGVncmVlLFxuICAgICAgICBvdXRkZWdyZWU6IG91dGRlZ3JlZSxcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaDogZGVwdGhGaXJzdFNlYXJjaCxcbiAgICAgICAgbG93ZXN0Q29tbW9uQW5jZXN0b3JzOiBsb3dlc3RDb21tb25BbmNlc3RvcnMsXG4gICAgICAgIHRvcG9sb2dpY2FsU29ydDogdG9wb2xvZ2ljYWxTb3J0LFxuICAgICAgICBzaG9ydGVzdFBhdGg6IHNob3J0ZXN0UGF0aCxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemUsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVxuICAgIH07XG4gICAgLy8gVGhlIGFkamFjZW5jeSBsaXN0IG9mIHRoZSBncmFwaC5cbiAgICAvLyBLZXlzIGFyZSBub2RlIGlkcy5cbiAgICAvLyBWYWx1ZXMgYXJlIGFkamFjZW50IG5vZGUgaWQgYXJyYXlzLlxuICAgIHZhciBlZGdlcyA9IHt9O1xuICAgIC8vIFRoZSB3ZWlnaHRzIG9mIGVkZ2VzLlxuICAgIC8vIEtleXMgYXJlIHN0cmluZyBlbmNvZGluZ3Mgb2YgZWRnZXMuXG4gICAgLy8gVmFsdWVzIGFyZSB3ZWlnaHRzIChudW1iZXJzKS5cbiAgICB2YXIgZWRnZVdlaWdodHMgPSB7fTtcbiAgICAvLyBJZiBhIHNlcmlhbGl6ZWQgZ3JhcGggd2FzIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciwgZGVzZXJpYWxpemUgaXQuXG4gICAgaWYgKHNlcmlhbGl6ZWQpIHtcbiAgICAgICAgZGVzZXJpYWxpemUoc2VyaWFsaXplZCk7XG4gICAgfVxuICAgIC8vIEFkZHMgYSBub2RlIHRvIHRoZSBncmFwaC5cbiAgICAvLyBJZiBub2RlIHdhcyBhbHJlYWR5IGFkZGVkLCB0aGlzIGZ1bmN0aW9uIGRvZXMgbm90aGluZy5cbiAgICAvLyBJZiBub2RlIHdhcyBub3QgYWxyZWFkeSBhZGRlZCwgdGhpcyBmdW5jdGlvbiBzZXRzIHVwIGFuIGVtcHR5IGFkamFjZW5jeSBsaXN0LlxuICAgIGZ1bmN0aW9uIGFkZE5vZGUobm9kZSkge1xuICAgICAgICBlZGdlc1tub2RlXSA9IGFkamFjZW50KG5vZGUpO1xuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIFJlbW92ZXMgYSBub2RlIGZyb20gdGhlIGdyYXBoLlxuICAgIC8vIEFsc28gcmVtb3ZlcyBpbmNvbWluZyBhbmQgb3V0Z29pbmcgZWRnZXMuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIC8vIFJlbW92ZSBpbmNvbWluZyBlZGdlcy5cbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIGVkZ2VzW3VdLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodiA9PT0gbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVFZGdlKHUsIHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmVtb3ZlIG91dGdvaW5nIGVkZ2VzIChhbmQgc2lnbmFsIHRoYXQgdGhlIG5vZGUgbm8gbG9uZ2VyIGV4aXN0cykuXG4gICAgICAgIGRlbGV0ZSBlZGdlc1tub2RlXTtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBHZXRzIHRoZSBsaXN0IG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBncmFwaC5cbiAgICBmdW5jdGlvbiBub2RlcygpIHtcbiAgICAgICAgLy8gVE9ETzogQmV0dGVyIGltcGxlbWVudGF0aW9uIHdpdGggc2V0IGRhdGEgc3RydWN0dXJlXG4gICAgICAgIHZhciBub2RlU2V0ID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICBub2RlU2V0W3VdID0gdHJ1ZTtcbiAgICAgICAgICAgIGVkZ2VzW3VdLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBub2RlU2V0W3ZdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5vZGVTZXQpO1xuICAgIH1cbiAgICAvLyBHZXRzIHRoZSBhZGphY2VudCBub2RlIGxpc3QgZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIC8vIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgZm9yIHVua25vd24gbm9kZXMuXG4gICAgZnVuY3Rpb24gYWRqYWNlbnQobm9kZSkge1xuICAgICAgICByZXR1cm4gZWRnZXNbbm9kZV0gfHwgW107XG4gICAgfVxuICAgIC8vIENvbXB1dGVzIGEgc3RyaW5nIGVuY29kaW5nIG9mIGFuIGVkZ2UsXG4gICAgLy8gZm9yIHVzZSBhcyBhIGtleSBpbiBhbiBvYmplY3QuXG4gICAgZnVuY3Rpb24gZW5jb2RlRWRnZSh1LCB2KSB7XG4gICAgICAgIHJldHVybiB1ICsgXCJ8XCIgKyB2O1xuICAgIH1cbiAgICAvLyBTZXRzIHRoZSB3ZWlnaHQgb2YgdGhlIGdpdmVuIGVkZ2UuXG4gICAgZnVuY3Rpb24gc2V0RWRnZVdlaWdodCh1LCB2LCB3ZWlnaHQpIHtcbiAgICAgICAgZWRnZVdlaWdodHNbZW5jb2RlRWRnZSh1LCB2KV0gPSB3ZWlnaHQ7XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gR2V0cyB0aGUgd2VpZ2h0IG9mIHRoZSBnaXZlbiBlZGdlLlxuICAgIC8vIFJldHVybnMgMSBpZiBubyB3ZWlnaHQgd2FzIHByZXZpb3VzbHkgc2V0LlxuICAgIGZ1bmN0aW9uIGdldEVkZ2VXZWlnaHQodSwgdikge1xuICAgICAgICB2YXIgd2VpZ2h0ID0gZWRnZVdlaWdodHNbZW5jb2RlRWRnZSh1LCB2KV07XG4gICAgICAgIHJldHVybiB3ZWlnaHQgPT09IHVuZGVmaW5lZCA/IDEgOiB3ZWlnaHQ7XG4gICAgfVxuICAgIC8vIEFkZHMgYW4gZWRnZSBmcm9tIG5vZGUgdSB0byBub2RlIHYuXG4gICAgLy8gSW1wbGljaXRseSBhZGRzIHRoZSBub2RlcyBpZiB0aGV5IHdlcmUgbm90IGFscmVhZHkgYWRkZWQuXG4gICAgZnVuY3Rpb24gYWRkRWRnZSh1LCB2LCB3ZWlnaHQpIHtcbiAgICAgICAgYWRkTm9kZSh1KTtcbiAgICAgICAgYWRkTm9kZSh2KTtcbiAgICAgICAgYWRqYWNlbnQodSkucHVzaCh2KTtcbiAgICAgICAgaWYgKHdlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRFZGdlV2VpZ2h0KHUsIHYsIHdlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBSZW1vdmVzIHRoZSBlZGdlIGZyb20gbm9kZSB1IHRvIG5vZGUgdi5cbiAgICAvLyBEb2VzIG5vdCByZW1vdmUgdGhlIG5vZGVzLlxuICAgIC8vIERvZXMgbm90aGluZyBpZiB0aGUgZWRnZSBkb2VzIG5vdCBleGlzdC5cbiAgICBmdW5jdGlvbiByZW1vdmVFZGdlKHUsIHYpIHtcbiAgICAgICAgaWYgKGVkZ2VzW3VdKSB7XG4gICAgICAgICAgICBlZGdlc1t1XSA9IGFkamFjZW50KHUpLmZpbHRlcihmdW5jdGlvbiAoX3YpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3YgIT09IHY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIENvbXB1dGVzIHRoZSBpbmRlZ3JlZSBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgLy8gTm90IHZlcnkgZWZmaWNpZW50LCBjb3N0cyBPKEUpIHdoZXJlIEUgPSBudW1iZXIgb2YgZWRnZXMuXG4gICAgZnVuY3Rpb24gaW5kZWdyZWUobm9kZSkge1xuICAgICAgICB2YXIgZGVncmVlID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2sodikge1xuICAgICAgICAgICAgaWYgKHYgPT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkZWdyZWUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgZWRnZXNbdV0uZm9yRWFjaChjaGVjayk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVncmVlO1xuICAgIH1cbiAgICAvLyBDb21wdXRlcyB0aGUgb3V0ZGVncmVlIGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgICBmdW5jdGlvbiBvdXRkZWdyZWUobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZSBpbiBlZGdlcyA/IGVkZ2VzW25vZGVdLmxlbmd0aCA6IDA7XG4gICAgfVxuICAgIC8vIERlcHRoIEZpcnN0IFNlYXJjaCBhbGdvcml0aG0sIGluc3BpcmVkIGJ5XG4gICAgLy8gQ29ybWVuIGV0IGFsLiBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIgM3JkIEVkLiBwLiA2MDRcbiAgICAvLyBUaGlzIHZhcmlhbnQgaW5jbHVkZXMgYW4gYWRkaXRpb25hbCBvcHRpb25cbiAgICAvLyBgaW5jbHVkZVNvdXJjZU5vZGVzYCB0byBzcGVjaWZ5IHdoZXRoZXIgdG8gaW5jbHVkZSBvclxuICAgIC8vIGV4Y2x1ZGUgdGhlIHNvdXJjZSBub2RlcyBmcm9tIHRoZSByZXN1bHQgKHRydWUgYnkgZGVmYXVsdCkuXG4gICAgLy8gSWYgYHNvdXJjZU5vZGVzYCBpcyBub3Qgc3BlY2lmaWVkLCBhbGwgbm9kZXMgaW4gdGhlIGdyYXBoXG4gICAgLy8gYXJlIHVzZWQgYXMgc291cmNlIG5vZGVzLlxuICAgIGZ1bmN0aW9uIGRlcHRoRmlyc3RTZWFyY2goc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2Rlcykge1xuICAgICAgICBpZiAoaW5jbHVkZVNvdXJjZU5vZGVzID09PSB2b2lkIDApIHsgaW5jbHVkZVNvdXJjZU5vZGVzID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoIXNvdXJjZU5vZGVzKSB7XG4gICAgICAgICAgICBzb3VyY2VOb2RlcyA9IG5vZGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpbmNsdWRlU291cmNlTm9kZXMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2aXNpdGVkID0ge307XG4gICAgICAgIHZhciBub2RlTGlzdCA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBERlNWaXNpdChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWRbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICAgICAgICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmNsdWRlU291cmNlTm9kZXMpIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goREZTVmlzaXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc291cmNlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZUxpc3Q7XG4gICAgfVxuICAgIC8vIExlYXN0IENvbW1vbiBBbmNlc3RvcnNcbiAgICAvLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vcmVsYXhlZHdzL2xjYS9ibG9iL21hc3Rlci9zcmMvTG93ZXN0Q29tbW9uQW5jZXN0b3IucGhwIGNvZGVcbiAgICAvLyBidXQgdXNlcyBkZXB0aCBzZWFyY2ggaW5zdGVhZCBvZiBicmVhZHRoLiBBbHNvIHVzZXMgc29tZSBvcHRpbWl6YXRpb25zXG4gICAgZnVuY3Rpb24gbG93ZXN0Q29tbW9uQW5jZXN0b3JzKG5vZGUxLCBub2RlMikge1xuICAgICAgICB2YXIgbm9kZTFBbmNlc3RvcnMgPSBbXTtcbiAgICAgICAgdmFyIGxjYXMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gQ0ExVmlzaXQodmlzaXRlZCwgbm9kZSkge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW25vZGVdKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbm9kZTFBbmNlc3RvcnMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PSBub2RlMikge1xuICAgICAgICAgICAgICAgICAgICBsY2FzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gZm91bmQgLSBzaG9ydGN1dFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWRqYWNlbnQobm9kZSkuZXZlcnkoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENBMVZpc2l0KHZpc2l0ZWQsIG5vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gQ0EyVmlzaXQodmlzaXRlZCwgbm9kZSkge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW25vZGVdKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUxQW5jZXN0b3JzLmluZGV4T2Yobm9kZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsY2FzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxjYXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ0EyVmlzaXQodmlzaXRlZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0ExVmlzaXQoe30sIG5vZGUxKSkge1xuICAgICAgICAgICAgLy8gTm8gc2hvcnRjdXQgd29ya2VkXG4gICAgICAgICAgICBDQTJWaXNpdCh7fSwgbm9kZTIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsY2FzO1xuICAgIH1cbiAgICAvLyBUaGUgdG9wb2xvZ2ljYWwgc29ydCBhbGdvcml0aG0geWllbGRzIGEgbGlzdCBvZiB2aXNpdGVkIG5vZGVzXG4gICAgLy8gc3VjaCB0aGF0IGZvciBlYWNoIHZpc2l0ZWQgZWRnZSAodSwgdiksIHUgY29tZXMgYmVmb3JlIHYgaW4gdGhlIGxpc3QuXG4gICAgLy8gQW1hemluZ2x5LCB0aGlzIGNvbWVzIGZyb20ganVzdCByZXZlcnNpbmcgdGhlIHJlc3VsdCBmcm9tIGRlcHRoIGZpcnN0IHNlYXJjaC5cbiAgICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDYxM1xuICAgIGZ1bmN0aW9uIHRvcG9sb2dpY2FsU29ydChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKSB7XG4gICAgICAgIGlmIChpbmNsdWRlU291cmNlTm9kZXMgPT09IHZvaWQgMCkgeyBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlOyB9XG4gICAgICAgIHJldHVybiBkZXB0aEZpcnN0U2VhcmNoKHNvdXJjZU5vZGVzLCBpbmNsdWRlU291cmNlTm9kZXMpLnJldmVyc2UoKTtcbiAgICB9XG4gICAgLy8gRGlqa3N0cmEncyBTaG9ydGVzdCBQYXRoIEFsZ29yaXRobS5cbiAgICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDY1OFxuICAgIC8vIFZhcmlhYmxlIGFuZCBmdW5jdGlvbiBuYW1lcyBjb3JyZXNwb25kIHRvIG5hbWVzIGluIHRoZSBib29rLlxuICAgIGZ1bmN0aW9uIHNob3J0ZXN0UGF0aChzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XG4gICAgICAgIC8vIFVwcGVyIGJvdW5kcyBmb3Igc2hvcnRlc3QgcGF0aCB3ZWlnaHRzIGZyb20gc291cmNlLlxuICAgICAgICB2YXIgZCA9IHt9O1xuICAgICAgICAvLyBQcmVkZWNlc3NvcnMuXG4gICAgICAgIHZhciBwID0ge307XG4gICAgICAgIC8vIFBvb3IgbWFuJ3MgcHJpb3JpdHkgcXVldWUsIGtleWVkIG9uIGQuXG4gICAgICAgIHZhciBxID0ge307XG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVTaW5nbGVTb3VyY2UoKSB7XG4gICAgICAgICAgICBub2RlcygpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkW25vZGVdID0gSW5maW5pdHk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChkW3NvdXJjZV0gIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU291cmNlIG5vZGUgaXMgbm90IGluIHRoZSBncmFwaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkW2Rlc3RpbmF0aW9uXSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXN0aW5hdGlvbiBub2RlIGlzIG5vdCBpbiB0aGUgZ3JhcGhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkW3NvdXJjZV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZHMgZW50cmllcyBpbiBxIGZvciBhbGwgbm9kZXMuXG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVQcmlvcml0eVF1ZXVlKCkge1xuICAgICAgICAgICAgbm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgcVtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm5zIHRydWUgaWYgcSBpcyBlbXB0eS5cbiAgICAgICAgZnVuY3Rpb24gcHJpb3JpdHlRdWV1ZUVtcHR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHEpLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBMaW5lYXIgc2VhcmNoIHRvIGV4dHJhY3QgKGZpbmQgYW5kIHJlbW92ZSkgbWluIGZyb20gcS5cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdE1pbigpIHtcbiAgICAgICAgICAgIHZhciBtaW4gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIHZhciBtaW5Ob2RlO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocSkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChkW25vZGVdIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGRbbm9kZV07XG4gICAgICAgICAgICAgICAgICAgIG1pbk5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG1pbk5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoIGhlcmUsIHRoZXJlJ3MgYSBkaXNjb25uZWN0ZWQgc3ViZ3JhcGgsIGFuZCB3ZSdyZSBkb25lLlxuICAgICAgICAgICAgICAgIHEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBxW21pbk5vZGVdO1xuICAgICAgICAgICAgcmV0dXJuIG1pbk5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVsYXgodSwgdikge1xuICAgICAgICAgICAgdmFyIHcgPSBnZXRFZGdlV2VpZ2h0KHUsIHYpO1xuICAgICAgICAgICAgaWYgKGRbdl0gPiBkW3VdICsgdykge1xuICAgICAgICAgICAgICAgIGRbdl0gPSBkW3VdICsgdztcbiAgICAgICAgICAgICAgICBwW3ZdID0gdTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkaWprc3RyYSgpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVTaW5nbGVTb3VyY2UoKTtcbiAgICAgICAgICAgIGluaXRpYWxpemVQcmlvcml0eVF1ZXVlKCk7XG4gICAgICAgICAgICB3aGlsZSAoIXByaW9yaXR5UXVldWVFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHUgPSBleHRyYWN0TWluKCk7XG4gICAgICAgICAgICAgICAgaWYgKHUgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBhZGphY2VudCh1KS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbGF4KHUsIHYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFzc2VtYmxlcyB0aGUgc2hvcnRlc3QgcGF0aCBieSB0cmF2ZXJzaW5nIHRoZVxuICAgICAgICAvLyBwcmVkZWNlc3NvciBzdWJncmFwaCBmcm9tIGRlc3RpbmF0aW9uIHRvIHNvdXJjZS5cbiAgICAgICAgZnVuY3Rpb24gcGF0aCgpIHtcbiAgICAgICAgICAgIHZhciBub2RlTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHdlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgd2hpbGUgKHBbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIHdlaWdodCArPSBnZXRFZGdlV2VpZ2h0KHBbbm9kZV0sIG5vZGUpO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBwW25vZGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHBhdGggZm91bmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgbm9kZUxpc3QucmV2ZXJzZSgpO1xuICAgICAgICAgICAgbm9kZUxpc3Qud2VpZ2h0ID0gd2VpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVMaXN0O1xuICAgICAgICB9XG4gICAgICAgIGRpamtzdHJhKCk7XG4gICAgICAgIHJldHVybiBwYXRoKCk7XG4gICAgfVxuICAgIC8vIFNlcmlhbGl6ZXMgdGhlIGdyYXBoLlxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSB7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMoKS5tYXAoZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGxpbmtzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBzZXJpYWxpemVkLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBub2RlLmlkO1xuICAgICAgICAgICAgYWRqYWNlbnQoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkLmxpbmtzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodDogZ2V0RWRnZVdlaWdodChzb3VyY2UsIHRhcmdldClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG4gICAgfVxuICAgIC8vIERlc2VyaWFsaXplcyB0aGUgZ2l2ZW4gc2VyaWFsaXplZCBncmFwaC5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZShzZXJpYWxpemVkKSB7XG4gICAgICAgIHNlcmlhbGl6ZWQubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlcmlhbGl6ZWQubGlua3MuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuICAgICAgICAgICAgYWRkRWRnZShsaW5rLnNvdXJjZSwgbGluay50YXJnZXQsIGxpbmsud2VpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gVGhlIHJldHVybmVkIGdyYXBoIGluc3RhbmNlLlxuICAgIHJldHVybiBncmFwaDtcbn1cbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XG4iXX0=
