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


var Graph = require("graph-data-structure");
let graphData = {"CSS 101":{title:"Create Phonebook",description:"Create Phonebook, where data is stored in file"},
                "CSS 102":{title:"String class",description:"Implement String class, without using standard Java String"},
                "CSS 103":{title:"Bank cashier", description:"Implement Bank cashier"},
                "CSS 104":{title:"Chess",description:"Chess game"},
                "CSS 105":{title:"Landing page",description:"Implement landing page"}
            };
let graph = Graph();
graph.addNode("CSS 101").addNode("CSS 102").addNode("CSS 103").addNode("CSS 104").addNode("CSS 105");
graph.addEdge("CSS 101","CSS 102");
graph.addEdge("CSS 101","CSS 103");
graph.addEdge("CSS 102","CSS 104");
graph.addEdge("CSS 102","CSS 105");
graph.addEdge("CSS 103","CSS 105");
var radius = 40;

window.states = [];
let x = 40;let y=40;let index= 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJub2RlX21vZHVsZXMvZ3JhcGgtZGF0YS1zdHJ1Y3R1cmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gc2hvd0luZm9ybWF0aW9uKGlkKXtcbiAgICBsZXQgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGV0YWlsc1wiKTtcbiAgICBkZXRhaWxzLmlubmVySFRNTCA9IGdyYXBoRGF0YVtpZF0udGl0bGUrXCI8YnIvPlwiK2dyYXBoRGF0YVtpZF0uZGVzY3JpcHRpb247XG59XG5mdW5jdGlvbiBpbml0aWFsaXplU1ZHKCl7XG4gICAgd2luZG93LnN2ZyA9IGQzLnNlbGVjdCgnYm9keScpXG4gICAgLmFwcGVuZChcInN2Z1wiKVxuICAgIC8vLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgMTAwMCArIFwiIFwiICsgMTAwMCApXG4gICAgLy8uYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWluWU1pblwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCI5NjBweFwiKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiNTAwcHhcIik7ICAgIFxuICAgIFxuICAgICAgICAvLyBkZWZpbmUgYXJyb3cgbWFya2VycyBmb3IgZ3JhcGggbGlua3NcbiAgICBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdlbmQtYXJyb3cnKVxuICAgICAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAgICAgLmF0dHIoJ3JlZlgnLCAzKVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnLCA4KVxuICAgICAgICAuYXR0cignbWFya2VySGVpZ2h0JywgOClcbiAgICAgICAgLmF0dHIoJ29yaWVudCcsICdhdXRvJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignZCcsICdNMCwtNUwxMCwwTDAsNScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcbiAgICBcbiAgICBzdmcuYXBwZW5kKCdzdmc6ZGVmcycpLmFwcGVuZCgnc3ZnOm1hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdzdGFydC1hcnJvdycpXG4gICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgLTUgMTAgMTAnKVxuICAgICAgICAuYXR0cigncmVmWCcsIDQpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJXaWR0aCcsIDgpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJIZWlnaHQnLCA4KVxuICAgICAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxuICAgICAgICAuYXBwZW5kKCdzdmc6cGF0aCcpXG4gICAgICAgIC5hdHRyKCdkJywgJ00xMCwtNUwwLDBMMTAsNScpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJyMwMDAnKTtcbiAgICBcbiAgICAgICAgLy8gbGluZSBkaXNwbGF5ZWQgd2hlbiBkcmFnZ2luZyBuZXcgbm9kZXNcbiAgICB2YXIgZHJhZ19saW5lID0gc3ZnLmFwcGVuZCgnc3ZnOnBhdGgnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZHJhZ2xpbmUgaGlkZGVuJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsMEwwLDAnKVxuICAgIDtcbn1cblxuXG52YXIgR3JhcGggPSByZXF1aXJlKFwiZ3JhcGgtZGF0YS1zdHJ1Y3R1cmVcIik7XG5sZXQgZ3JhcGhEYXRhID0ge1wiQ1NTIDEwMVwiOnt0aXRsZTpcIkNyZWF0ZSBQaG9uZWJvb2tcIixkZXNjcmlwdGlvbjpcIkNyZWF0ZSBQaG9uZWJvb2ssIHdoZXJlIGRhdGEgaXMgc3RvcmVkIGluIGZpbGVcIn0sXG4gICAgICAgICAgICAgICAgXCJDU1MgMTAyXCI6e3RpdGxlOlwiU3RyaW5nIGNsYXNzXCIsZGVzY3JpcHRpb246XCJJbXBsZW1lbnQgU3RyaW5nIGNsYXNzLCB3aXRob3V0IHVzaW5nIHN0YW5kYXJkIEphdmEgU3RyaW5nXCJ9LFxuICAgICAgICAgICAgICAgIFwiQ1NTIDEwM1wiOnt0aXRsZTpcIkJhbmsgY2FzaGllclwiLCBkZXNjcmlwdGlvbjpcIkltcGxlbWVudCBCYW5rIGNhc2hpZXJcIn0sXG4gICAgICAgICAgICAgICAgXCJDU1MgMTA0XCI6e3RpdGxlOlwiQ2hlc3NcIixkZXNjcmlwdGlvbjpcIkNoZXNzIGdhbWVcIn0sXG4gICAgICAgICAgICAgICAgXCJDU1MgMTA1XCI6e3RpdGxlOlwiTGFuZGluZyBwYWdlXCIsZGVzY3JpcHRpb246XCJJbXBsZW1lbnQgbGFuZGluZyBwYWdlXCJ9XG4gICAgICAgICAgICB9O1xubGV0IGdyYXBoID0gR3JhcGgoKTtcbmdyYXBoLmFkZE5vZGUoXCJDU1MgMTAxXCIpLmFkZE5vZGUoXCJDU1MgMTAyXCIpLmFkZE5vZGUoXCJDU1MgMTAzXCIpLmFkZE5vZGUoXCJDU1MgMTA0XCIpLmFkZE5vZGUoXCJDU1MgMTA1XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDFcIixcIkNTUyAxMDJcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwMVwiLFwiQ1NTIDEwM1wiKTtcbmdyYXBoLmFkZEVkZ2UoXCJDU1MgMTAyXCIsXCJDU1MgMTA0XCIpO1xuZ3JhcGguYWRkRWRnZShcIkNTUyAxMDJcIixcIkNTUyAxMDVcIik7XG5ncmFwaC5hZGRFZGdlKFwiQ1NTIDEwM1wiLFwiQ1NTIDEwNVwiKTtcbnZhciByYWRpdXMgPSA0MDtcblxud2luZG93LnN0YXRlcyA9IFtdO1xubGV0IHggPSA0MDtsZXQgeT00MDtsZXQgaW5kZXg9IDA7XG5sZXQgbm9kZXMgPSBncmFwaC5ub2RlcygpO1xuZm9yIChsZXQgaT0wO2k8bm9kZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICBsZXQgbmV3Tm9kZSA9IHtpbmRleDppbmRleCx4OngseTp5LGxhYmVsOm5vZGUsdHJhbnNpdGlvbnM6W119O1xuICAgIGdyYXBoRGF0YVtub2RlXS53aW5kb3dTdGF0ZSA9IG5ld05vZGU7XG4gICAgLy93aW5kb3cuc3RhdGVzW25vZGVdID0gbmV3Tm9kZTtcbiAgICB3aW5kb3cuc3RhdGVzLnB1c2gobmV3Tm9kZSk7XG4gICAgeCA9IHgrMTAwOyB5ID0geSsxMDA7IGluZGV4ID0gaW5kZXgrMTtcbn1cbmZvciAobGV0IGk9MDtpPHdpbmRvdy5zdGF0ZXMubGVuZ3RoO2krKyl7XG4gICAgbGV0IG5vZGVTdGF0ZSA9IHdpbmRvdy5zdGF0ZXNbaV07XG4gICAgLy9jb25zb2xlLmxvZyhub2RlKTtcbiAgICBsZXQgYWRqTm9kZXMgPSBncmFwaC5hZGphY2VudChub2RlU3RhdGUubGFiZWwpO1xuICAgIC8vY29uc29sZS5sb2coYWRqTm9kZXMpO1xuICAgIGZvciAobGV0IGFkak5vZGUgb2YgYWRqTm9kZXMpe1xuICAgICAgICBjb25zb2xlLmxvZyhhZGpOb2RlKTtcbiAgICAgICAgLy9ub2RlU3RhdGUudHJhbnNpdGlvbnMucHVzaCh7bGFiZWw6J3dob28nLHRhcmdldDp3aW5kb3cuc3RhdGVzW2Fkak5vZGVdfSk7XG4gICAgICAgIG5vZGVTdGF0ZS50cmFuc2l0aW9ucy5wdXNoKHtsYWJlbDond2hvbycsdGFyZ2V0OmdyYXBoRGF0YVthZGpOb2RlXS53aW5kb3dTdGF0ZX0pO1xuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwiSGVsbG8gV29ybGRcIik7XG5pbml0aWFsaXplU1ZHKCk7XG5cblxuXG52YXIgZ1N0YXRlcyA9IHN2Zy5zZWxlY3RBbGwoXCJnLnN0YXRlXCIpLmRhdGEoc3RhdGVzKTtcblxudmFyIHRyYW5zaXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0YXRlcy5yZWR1Y2UoIGZ1bmN0aW9uKCBpbml0aWFsLCBzdGF0ZSkge1xuICAgICAgICByZXR1cm4gaW5pdGlhbC5jb25jYXQoIFxuICAgICAgICAgICAgc3RhdGUudHJhbnNpdGlvbnMubWFwKCBmdW5jdGlvbiggdHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHNvdXJjZSA6IHN0YXRlLCB0YXJnZXQgOiB0cmFuc2l0aW9uLnRhcmdldH07XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH0sIFtdKTtcbn07XG4gICAgLy8gaHR0cDovL3d3dy5kYXNoaW5nZDNqcy5jb20vc3ZnLXBhdGhzLWFuZC1kM2pzXG52YXIgY29tcHV0ZVRyYW5zaXRpb25QYXRoID0gLypkMy5zdmcuZGlhZ29uYWwucmFkaWFsKCkqL2Z1bmN0aW9uKCBkKSB7XG4gICAgdmFyIGRlbHRhWCA9IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54LFxuICAgIGRlbHRhWSA9IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55LFxuICAgIGRpc3QgPSBNYXRoLnNxcnQoZGVsdGFYICogZGVsdGFYICsgZGVsdGFZICogZGVsdGFZKSxcbiAgICBub3JtWCA9IGRlbHRhWCAvIGRpc3QsXG4gICAgbm9ybVkgPSBkZWx0YVkgLyBkaXN0LFxuICAgIHNvdXJjZVBhZGRpbmcgPSByYWRpdXMgKyAyOy8vZC5sZWZ0ID8gMTcgOiAxMixcbiAgICB0YXJnZXRQYWRkaW5nID0gcmFkaXVzICsgNjsvL2QucmlnaHQgPyAxNyA6IDEyLFxuICAgIHNvdXJjZVggPSBkLnNvdXJjZS54ICsgKHNvdXJjZVBhZGRpbmcgKiBub3JtWCksXG4gICAgc291cmNlWSA9IGQuc291cmNlLnkgKyAoc291cmNlUGFkZGluZyAqIG5vcm1ZKSxcbiAgICB0YXJnZXRYID0gZC50YXJnZXQueCAtICh0YXJnZXRQYWRkaW5nICogbm9ybVgpLFxuICAgIHRhcmdldFkgPSBkLnRhcmdldC55IC0gKHRhcmdldFBhZGRpbmcgKiBub3JtWSk7XG4gICAgcmV0dXJuICdNJyArIHNvdXJjZVggKyAnLCcgKyBzb3VyY2VZICsgJ0wnICsgdGFyZ2V0WCArICcsJyArIHRhcmdldFk7XG59O1xuXG52YXIgZ1RyYW5zaXRpb25zID0gc3ZnLmFwcGVuZCggJ2cnKS5zZWxlY3RBbGwoIFwicGF0aC50cmFuc2l0aW9uXCIpLmRhdGEodHJhbnNpdGlvbnMpO1xuXG52YXIgc3RhcnRTdGF0ZSwgZW5kU3RhdGU7ICAgIFxudmFyIGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcbi5vbihcImRyYWdcIiwgZnVuY3Rpb24oIGQsIGkpIHtcbiAgICBpZiggc3RhcnRTdGF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb24gPSBkMy5zZWxlY3RBbGwoICcuc2VsZWN0ZWQnKTtcblxuICAgIGlmKCBzZWxlY3Rpb25bMF0uaW5kZXhPZiggdGhpcyk9PS0xKSB7XG4gICAgICAgIHNlbGVjdGlvbi5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgc2VsZWN0aW9uID0gZDMuc2VsZWN0KCB0aGlzKTtcbiAgICAgICAgc2VsZWN0aW9uLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgfSBcblxuICAgIHNlbGVjdGlvbi5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCBkLCBpKSB7XG4gICAgICAgIGQueCArPSBkMy5ldmVudC5keDtcbiAgICAgICAgZC55ICs9IGQzLmV2ZW50LmR5O1xuICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBbIGQueCxkLnkgXSArIFwiKVwiXG4gICAgfSlcbiAgICAgICAgLy8gcmVhcHBlbmQgZHJhZ2dlZCBlbGVtZW50IGFzIGxhc3QgXG4gICAgICAgIC8vIHNvIHRoYXQgaXRzIHN0YXlzIG9uIHRvcCBcbiAgICB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHRoaXMpO1xuXG4gICAgZ1RyYW5zaXRpb25zLmF0dHIoICdkJywgY29tcHV0ZVRyYW5zaXRpb25QYXRoKTtcbiAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbn0pXG4ub24oIFwiZHJhZ2VuZFwiLCBmdW5jdGlvbiggZCkge1xuICAgIC8vIFRPRE8gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0NjY3NDAxL2NsaWNrLWV2ZW50LW5vdC1maXJpbmctYWZ0ZXItZHJhZy1zb21ldGltZXMtaW4tZDMtanNcblxuICAgIC8vIG5lZWRlZCBieSBGRlxuICAgIC8vZHJhZ19saW5lLmNsYXNzZWQoJ2hpZGRlbicsIHRydWUpLnN0eWxlKCdtYXJrZXItZW5kJywgJycpO1xuXG4gICAgaWYoIHN0YXJ0U3RhdGUgJiYgZW5kU3RhdGUpIHtcbiAgICAgICAgc3RhcnRTdGF0ZS50cmFuc2l0aW9ucy5wdXNoKCB7IGxhYmVsIDogXCJ0cmFuc2l0aW9uIGxhYmVsIDFcIiwgdGFyZ2V0IDogZW5kU3RhdGV9KTtcbiAgICAgICAgcmVzdGFydCgpO1xuICAgIH1cblxuICAgIHN0YXJ0U3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59KTtcblxuc3ZnLm9uKCBcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICBpZiggIWQzLmV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCAnZy5zZWxlY3RlZCcpLmNsYXNzZWQoIFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIHZhciBwID0gZDMubW91c2UodGhpcyk7XG4gICAgLy9jb25zb2xlLmxvZyhcIk1vdXNlIERvd25cIik7XG4gICAgc3ZnLmFwcGVuZCggXCJyZWN0XCIpLmF0dHIoeyByeDogNiwgcnk6IDYsIGNsYXNzOiBcInNlbGVjdGlvblwiLCB4OiBwWzBdLCB5OiBwWzFdLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH0pXG59KVxuLm9uKCBcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcCA9IGQzLm1vdXNlKCB0aGlzKSwgcyA9IHN2Zy5zZWxlY3QoXCJyZWN0LnNlbGVjdGlvblwiKTtcblxuICAgIGlmKCAhcy5lbXB0eSgpKSB7XG4gICAgICAgIHZhciBkID0geyB4OnBhcnNlSW50KHMuYXR0cihcInhcIiksMTApLHk6cGFyc2VJbnQocy5hdHRyKFwieVwiKSwxMCksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOnBhcnNlSW50KHMuYXR0cihcIndpZHRoXCIpLDEwKSxoZWlnaHQ6cGFyc2VJbnQocy5hdHRyKCBcImhlaWdodFwiKSwgMTApfSxcbiAgICAgICAgbW92ZSA9IHt4IDogcFswXSAtIGQueCwgeSA6IHBbMV0gLSBkLnl9O1xuICAgICAgICBpZiggbW92ZS54IDwgMSB8fCAobW92ZS54KjI8ZC53aWR0aCkpIHtcbiAgICAgICAgICAgIGQueCA9IHBbMF07XG4gICAgICAgICAgICBkLndpZHRoIC09IG1vdmUueDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGQud2lkdGggPSBtb3ZlLng7ICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIG1vdmUueSA8IDEgfHwgKG1vdmUueSoyPGQuaGVpZ2h0KSkge1xuICAgICAgICAgICAgZC55ID0gcFsxXTtcbiAgICAgICAgICAgIGQuaGVpZ2h0IC09IG1vdmUueTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGQuaGVpZ2h0ID0gbW92ZS55OyAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBzLmF0dHIoIGQpO1xuICAgICAgICAgICAgLy8gZGVzZWxlY3QgYWxsIHRlbXBvcmFyeSBzZWxlY3RlZCBzdGF0ZSBvYmplY3RzXG4gICAgICAgIGQzLnNlbGVjdEFsbCggJ2cuc3RhdGUuc2VsZWN0aW9uLnNlbGVjdGVkJykuY2xhc3NlZCggXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgICAgIGQzLnNlbGVjdEFsbCggJ2cuc3RhdGUgPmNpcmNsZS5pbm5lcicpLmVhY2goIGZ1bmN0aW9uKCBzdGF0ZV9kYXRhLCBpKSB7XG4gICAgICAgICAgICBpZighZDMuc2VsZWN0KCB0aGlzKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIpICYmIFxuICAgICAgICAgICAgICAgICAgICAvLyBpbm5lciBjaXJjbGUgaW5zaWRlIHNlbGVjdGlvbiBmcmFtZVxuICAgICAgICAgICAgICAgIHN0YXRlX2RhdGEueC1yYWRpdXM+PWQueCAmJiBzdGF0ZV9kYXRhLngrcmFkaXVzPD1kLngrZC53aWR0aCAmJiBcbiAgICAgICAgICAgICAgICBzdGF0ZV9kYXRhLnktcmFkaXVzPj1kLnkgJiYgc3RhdGVfZGF0YS55K3JhZGl1czw9ZC55K2QuaGVpZ2h0XG4gICAgICAgICAgICApIHtcblxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCggdGhpcy5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgIC5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCB0cnVlKVxuICAgICAgICAgICAgICAgIC5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYoIHN0YXJ0U3RhdGUpIHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBkcmFnIGxpbmVcbiAgICAgICAgZHJhZ19saW5lLmF0dHIoJ2QnLCAnTScgKyBzdGFydFN0YXRlLnggKyAnLCcgKyBzdGFydFN0YXRlLnkgKyAnTCcgKyBwWzBdICsgJywnICsgcFsxXSk7XG4gICAgICAgIHZhciBzdGF0ZSA9IGQzLnNlbGVjdCggJ2cuc3RhdGUuaG92ZXInKTtcbiAgICAgICAgZW5kU3RhdGUgPSAoIXN0YXRlLmVtcHR5KCkgJiYgc3RhdGUuZGF0YSgpWzBdKSB8fCB1bmRlZmluZWQ7XG4gICAgfVxufSlcbi5vbihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBmcmFtZVxuICAgIHN2Zy5zZWxlY3RBbGwoIFwicmVjdC5zZWxlY3Rpb25cIikucmVtb3ZlKCk7XG4gICAgLy8gcmVtb3ZlIHRlbXBvcmFyeSBzZWxlY3Rpb24gbWFya2VyIGNsYXNzXG4gICAgZDMuc2VsZWN0QWxsKCAnZy5zdGF0ZS5zZWxlY3Rpb24nKS5jbGFzc2VkKCBcInNlbGVjdGlvblwiLCBmYWxzZSk7XG59KVxuLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgaWYoIGQzLmV2ZW50LnJlbGF0ZWRUYXJnZXQudGFnTmFtZT09J0hUTUwnKSB7XG4gICAgICAgIC8vIHJlbW92ZSBzZWxlY3Rpb24gZnJhbWVcbiAgICAgICAgc3ZnLnNlbGVjdEFsbCggXCJyZWN0LnNlbGVjdGlvblwiKS5yZW1vdmUoKTtcbiAgICAgICAgLy8gcmVtb3ZlIHRlbXBvcmFyeSBzZWxlY3Rpb24gbWFya2VyIGNsYXNzXG4gICAgICAgIGQzLnNlbGVjdEFsbCggJ2cuc3RhdGUuc2VsZWN0aW9uJykuY2xhc3NlZCggXCJzZWxlY3Rpb25cIiwgZmFsc2UpO1xuICAgIH1cbn0pO1xucmVzdGFydCgpO1xuZnVuY3Rpb24gcmVzdGFydCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIlJFU1RBUlRcIik7XG4gICAgXG4gICAgZ1N0YXRlcyA9IGdTdGF0ZXMuZGF0YShzdGF0ZXMpO1xuICAgIHZhciBnU3RhdGUgPSBnU3RhdGVzLmVudGVyKCkuYXBwZW5kKCBcImdcIilcbiAgICAgICAgLmF0dHIoeyBcInRyYW5zZm9ybVwiIDogZnVuY3Rpb24oIGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiKyBbZC54LGQueV0gKyBcIilcIjtcbiAgICAgICAgICAgIH0sJ2NsYXNzJzogJ3N0YXRlJywnZGF0YS1pZCc6ZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pLmNhbGwoIGRyYWcpO1xuICAgIC8qZ1N0YXRlLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAvL3J4OiA1LHdpZHRoOjgwLGhlaWdodDo4MFxuICAgICAgICAgICAgciAgICAgICA6IHJhZGl1cyArIDEwMCxcbiAgICAgICAgICAgIGNsYXNzICAgOiAnb3V0ZXInXG4gICAgICAgIH0pXG4gICAgICAgIC5vbiggXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oIGQpIHtcbiAgICAgICAgICAgIHN0YXJ0U3RhdGUgPSBkLCBlbmRTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIC8vIHJlcG9zaXRpb24gZHJhZyBsaW5lXG4gICAgICAgICAgICBkcmFnX2xpbmVcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ21hcmtlci1lbmQnLCAndXJsKCNlbmQtYXJyb3cpJylcbiAgICAgICAgICAgICAgICAuY2xhc3NlZCgnaGlkZGVuJywgZmFsc2UpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAnTScgKyBkLnggKyAnLCcgKyBkLnkgKyAnTCcgKyBkLnggKyAnLCcgKyBkLnkpXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICAgICAvLyBmb3JjZSBlbGVtZW50IHRvIGJlIGFuIHRvcFxuICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHRoaXMucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJtb3VzZWRvd25cIiwgc3RhcnRTdGF0ZSk7XG4gICAgICAgIH0pOyovXG4gICAgZ1N0YXRlLmFwcGVuZCgnY2lyY2xlJykuYXR0cih7cjo0MCxjbGFzczonaW5uZXInfSlcbiAgICAub24oXCJtb3VzZW92ZXJcIixmdW5jdGlvbihkLGkpe1xuICAgICAgICBkMy5zZWxlY3QoIHRoaXMucGFyZW50Tm9kZSkuY2xhc3NlZCggXCJob3ZlclwiLCB0cnVlKTt9KVxuICAgIC5vbihcImNsaWNrXCIsZnVuY3Rpb24oZCxpKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJDTElDS0VEXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBhcmVudE5vZGUuZGF0YXNldC5pZCk7XG4gICAgICAgIHNob3dJbmZvcm1hdGlvbih0aGlzLnBhcmVudE5vZGUuZGF0YXNldC5pZCk7XG4gICAgfSk7XG4gICAgLy9nU3RhdGUuYXBwZW5kKCdyZWN0JykuYXR0cih7fSk7XG4gICAgLypnU3RhdGUuYXBwZW5kKCBcImNpcmNsZVwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAvL3J4OiA1LHdpZHRoOjgwLGhlaWdodDo4MCxcbiAgICAgICAgICAgIHIgICAgICAgOiByYWRpdXMsXG4gICAgICAgICAgICBjbGFzcyAgIDogJ2lubmVyJ1xuICAgICAgICB9KVxuICAgICAgICAub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oIGQsIGkpIHtcbiAgICAgICAgICAgIHZhciBlID0gZDMuZXZlbnQsXG4gICAgICAgICAgICAgICAgZyA9IHRoaXMucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICBpc1NlbGVjdGVkID0gZDMuc2VsZWN0KCBnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIpO1xuXG4gICAgICAgICAgICBpZiggIWUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbCggJ2cuc2VsZWN0ZWQnKS5jbGFzc2VkKCBcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGQzLnNlbGVjdCggZykuY2xhc3NlZCggXCJzZWxlY3RlZFwiLCAhaXNTZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgLy8gcmVhcHBlbmQgZHJhZ2dlZCBlbGVtZW50IGFzIGxhc3QgXG4gICAgICAgICAgICAgICAgLy8gc28gdGhhdCBpdHMgc3RheXMgb24gdG9wIFxuICAgICAgICAgICAgZy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCBnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBkMy5zZWxlY3QoIHRoaXMucGFyZW50Tm9kZSkuY2xhc3NlZCggXCJob3ZlclwiLCB0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgZDMuc2VsZWN0KCB0aGlzLnBhcmVudE5vZGUpLmNsYXNzZWQoIFwiaG92ZXJcIiwgZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICA7Ki9cblxuICAgIGdTdGF0ZS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICd0ZXh0LWFuY2hvcicgICA6ICdtaWRkbGUnLFxuICAgICAgICAgICAgeSAgICAgICAgICAgICAgIDogNCxcbiAgICAgICAgICAgIGNsYXNzICAgICAgICAgICA6ICd0aXRsZSdcbiAgICAgICAgfSlcbiAgICAgICAgLnRleHQoIGZ1bmN0aW9uKCBkKSB7XG4gICAgICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICAgICAgfSlcbiAgICA7XG4gICAgZ1N0YXRlLmFwcGVuZCggXCJ0aXRsZVwiKS50ZXh0KCBmdW5jdGlvbiggZCkge1xuICAgICAgICByZXR1cm4gZC5sYWJlbDtcbiAgICB9KTtcbiAgICBnU3RhdGVzLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIGdUcmFuc2l0aW9ucyA9IGdUcmFuc2l0aW9ucy5kYXRhKCB0cmFuc2l0aW9ucyk7XG4gICAgZ1RyYW5zaXRpb25zLmVudGVyKCkuYXBwZW5kKCAncGF0aCcpXG4gICAgICAgIC5hdHRyKCAnY2xhc3MnLCAndHJhbnNpdGlvbicpXG4gICAgICAgIC5hdHRyKCAnZCcsIGNvbXB1dGVUcmFuc2l0aW9uUGF0aClcbiAgICA7ICAgXG4gICAgZ1RyYW5zaXRpb25zLmV4aXQoKS5yZW1vdmUoKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBBIGdyYXBoIGRhdGEgc3RydWN0dXJlIHdpdGggZGVwdGgtZmlyc3Qgc2VhcmNoIGFuZCB0b3BvbG9naWNhbCBzb3J0LlxuZnVuY3Rpb24gR3JhcGgoc2VyaWFsaXplZCkge1xuICAgIC8vIFJldHVybmVkIGdyYXBoIGluc3RhbmNlXG4gICAgdmFyIGdyYXBoID0ge1xuICAgICAgICBhZGROb2RlOiBhZGROb2RlLFxuICAgICAgICByZW1vdmVOb2RlOiByZW1vdmVOb2RlLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGFkamFjZW50OiBhZGphY2VudCxcbiAgICAgICAgYWRkRWRnZTogYWRkRWRnZSxcbiAgICAgICAgcmVtb3ZlRWRnZTogcmVtb3ZlRWRnZSxcbiAgICAgICAgc2V0RWRnZVdlaWdodDogc2V0RWRnZVdlaWdodCxcbiAgICAgICAgZ2V0RWRnZVdlaWdodDogZ2V0RWRnZVdlaWdodCxcbiAgICAgICAgaW5kZWdyZWU6IGluZGVncmVlLFxuICAgICAgICBvdXRkZWdyZWU6IG91dGRlZ3JlZSxcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaDogZGVwdGhGaXJzdFNlYXJjaCxcbiAgICAgICAgbG93ZXN0Q29tbW9uQW5jZXN0b3JzOiBsb3dlc3RDb21tb25BbmNlc3RvcnMsXG4gICAgICAgIHRvcG9sb2dpY2FsU29ydDogdG9wb2xvZ2ljYWxTb3J0LFxuICAgICAgICBzaG9ydGVzdFBhdGg6IHNob3J0ZXN0UGF0aCxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemUsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVxuICAgIH07XG4gICAgLy8gVGhlIGFkamFjZW5jeSBsaXN0IG9mIHRoZSBncmFwaC5cbiAgICAvLyBLZXlzIGFyZSBub2RlIGlkcy5cbiAgICAvLyBWYWx1ZXMgYXJlIGFkamFjZW50IG5vZGUgaWQgYXJyYXlzLlxuICAgIHZhciBlZGdlcyA9IHt9O1xuICAgIC8vIFRoZSB3ZWlnaHRzIG9mIGVkZ2VzLlxuICAgIC8vIEtleXMgYXJlIHN0cmluZyBlbmNvZGluZ3Mgb2YgZWRnZXMuXG4gICAgLy8gVmFsdWVzIGFyZSB3ZWlnaHRzIChudW1iZXJzKS5cbiAgICB2YXIgZWRnZVdlaWdodHMgPSB7fTtcbiAgICAvLyBJZiBhIHNlcmlhbGl6ZWQgZ3JhcGggd2FzIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciwgZGVzZXJpYWxpemUgaXQuXG4gICAgaWYgKHNlcmlhbGl6ZWQpIHtcbiAgICAgICAgZGVzZXJpYWxpemUoc2VyaWFsaXplZCk7XG4gICAgfVxuICAgIC8vIEFkZHMgYSBub2RlIHRvIHRoZSBncmFwaC5cbiAgICAvLyBJZiBub2RlIHdhcyBhbHJlYWR5IGFkZGVkLCB0aGlzIGZ1bmN0aW9uIGRvZXMgbm90aGluZy5cbiAgICAvLyBJZiBub2RlIHdhcyBub3QgYWxyZWFkeSBhZGRlZCwgdGhpcyBmdW5jdGlvbiBzZXRzIHVwIGFuIGVtcHR5IGFkamFjZW5jeSBsaXN0LlxuICAgIGZ1bmN0aW9uIGFkZE5vZGUobm9kZSkge1xuICAgICAgICBlZGdlc1tub2RlXSA9IGFkamFjZW50KG5vZGUpO1xuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIFJlbW92ZXMgYSBub2RlIGZyb20gdGhlIGdyYXBoLlxuICAgIC8vIEFsc28gcmVtb3ZlcyBpbmNvbWluZyBhbmQgb3V0Z29pbmcgZWRnZXMuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIC8vIFJlbW92ZSBpbmNvbWluZyBlZGdlcy5cbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIGVkZ2VzW3VdLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodiA9PT0gbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVFZGdlKHUsIHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmVtb3ZlIG91dGdvaW5nIGVkZ2VzIChhbmQgc2lnbmFsIHRoYXQgdGhlIG5vZGUgbm8gbG9uZ2VyIGV4aXN0cykuXG4gICAgICAgIGRlbGV0ZSBlZGdlc1tub2RlXTtcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBHZXRzIHRoZSBsaXN0IG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBncmFwaC5cbiAgICBmdW5jdGlvbiBub2RlcygpIHtcbiAgICAgICAgLy8gVE9ETzogQmV0dGVyIGltcGxlbWVudGF0aW9uIHdpdGggc2V0IGRhdGEgc3RydWN0dXJlXG4gICAgICAgIHZhciBub2RlU2V0ID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICBub2RlU2V0W3VdID0gdHJ1ZTtcbiAgICAgICAgICAgIGVkZ2VzW3VdLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBub2RlU2V0W3ZdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5vZGVTZXQpO1xuICAgIH1cbiAgICAvLyBHZXRzIHRoZSBhZGphY2VudCBub2RlIGxpc3QgZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIC8vIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgZm9yIHVua25vd24gbm9kZXMuXG4gICAgZnVuY3Rpb24gYWRqYWNlbnQobm9kZSkge1xuICAgICAgICByZXR1cm4gZWRnZXNbbm9kZV0gfHwgW107XG4gICAgfVxuICAgIC8vIENvbXB1dGVzIGEgc3RyaW5nIGVuY29kaW5nIG9mIGFuIGVkZ2UsXG4gICAgLy8gZm9yIHVzZSBhcyBhIGtleSBpbiBhbiBvYmplY3QuXG4gICAgZnVuY3Rpb24gZW5jb2RlRWRnZSh1LCB2KSB7XG4gICAgICAgIHJldHVybiB1ICsgXCJ8XCIgKyB2O1xuICAgIH1cbiAgICAvLyBTZXRzIHRoZSB3ZWlnaHQgb2YgdGhlIGdpdmVuIGVkZ2UuXG4gICAgZnVuY3Rpb24gc2V0RWRnZVdlaWdodCh1LCB2LCB3ZWlnaHQpIHtcbiAgICAgICAgZWRnZVdlaWdodHNbZW5jb2RlRWRnZSh1LCB2KV0gPSB3ZWlnaHQ7XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gR2V0cyB0aGUgd2VpZ2h0IG9mIHRoZSBnaXZlbiBlZGdlLlxuICAgIC8vIFJldHVybnMgMSBpZiBubyB3ZWlnaHQgd2FzIHByZXZpb3VzbHkgc2V0LlxuICAgIGZ1bmN0aW9uIGdldEVkZ2VXZWlnaHQodSwgdikge1xuICAgICAgICB2YXIgd2VpZ2h0ID0gZWRnZVdlaWdodHNbZW5jb2RlRWRnZSh1LCB2KV07XG4gICAgICAgIHJldHVybiB3ZWlnaHQgPT09IHVuZGVmaW5lZCA/IDEgOiB3ZWlnaHQ7XG4gICAgfVxuICAgIC8vIEFkZHMgYW4gZWRnZSBmcm9tIG5vZGUgdSB0byBub2RlIHYuXG4gICAgLy8gSW1wbGljaXRseSBhZGRzIHRoZSBub2RlcyBpZiB0aGV5IHdlcmUgbm90IGFscmVhZHkgYWRkZWQuXG4gICAgZnVuY3Rpb24gYWRkRWRnZSh1LCB2LCB3ZWlnaHQpIHtcbiAgICAgICAgYWRkTm9kZSh1KTtcbiAgICAgICAgYWRkTm9kZSh2KTtcbiAgICAgICAgYWRqYWNlbnQodSkucHVzaCh2KTtcbiAgICAgICAgaWYgKHdlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRFZGdlV2VpZ2h0KHUsIHYsIHdlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cbiAgICAvLyBSZW1vdmVzIHRoZSBlZGdlIGZyb20gbm9kZSB1IHRvIG5vZGUgdi5cbiAgICAvLyBEb2VzIG5vdCByZW1vdmUgdGhlIG5vZGVzLlxuICAgIC8vIERvZXMgbm90aGluZyBpZiB0aGUgZWRnZSBkb2VzIG5vdCBleGlzdC5cbiAgICBmdW5jdGlvbiByZW1vdmVFZGdlKHUsIHYpIHtcbiAgICAgICAgaWYgKGVkZ2VzW3VdKSB7XG4gICAgICAgICAgICBlZGdlc1t1XSA9IGFkamFjZW50KHUpLmZpbHRlcihmdW5jdGlvbiAoX3YpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3YgIT09IHY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JhcGg7XG4gICAgfVxuICAgIC8vIENvbXB1dGVzIHRoZSBpbmRlZ3JlZSBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgLy8gTm90IHZlcnkgZWZmaWNpZW50LCBjb3N0cyBPKEUpIHdoZXJlIEUgPSBudW1iZXIgb2YgZWRnZXMuXG4gICAgZnVuY3Rpb24gaW5kZWdyZWUobm9kZSkge1xuICAgICAgICB2YXIgZGVncmVlID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2sodikge1xuICAgICAgICAgICAgaWYgKHYgPT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkZWdyZWUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBPYmplY3Qua2V5cyhlZGdlcykuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgZWRnZXNbdV0uZm9yRWFjaChjaGVjayk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVncmVlO1xuICAgIH1cbiAgICAvLyBDb21wdXRlcyB0aGUgb3V0ZGVncmVlIGZvciB0aGUgZ2l2ZW4gbm9kZS5cbiAgICBmdW5jdGlvbiBvdXRkZWdyZWUobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZSBpbiBlZGdlcyA/IGVkZ2VzW25vZGVdLmxlbmd0aCA6IDA7XG4gICAgfVxuICAgIC8vIERlcHRoIEZpcnN0IFNlYXJjaCBhbGdvcml0aG0sIGluc3BpcmVkIGJ5XG4gICAgLy8gQ29ybWVuIGV0IGFsLiBcIkludHJvZHVjdGlvbiB0byBBbGdvcml0aG1zXCIgM3JkIEVkLiBwLiA2MDRcbiAgICAvLyBUaGlzIHZhcmlhbnQgaW5jbHVkZXMgYW4gYWRkaXRpb25hbCBvcHRpb25cbiAgICAvLyBgaW5jbHVkZVNvdXJjZU5vZGVzYCB0byBzcGVjaWZ5IHdoZXRoZXIgdG8gaW5jbHVkZSBvclxuICAgIC8vIGV4Y2x1ZGUgdGhlIHNvdXJjZSBub2RlcyBmcm9tIHRoZSByZXN1bHQgKHRydWUgYnkgZGVmYXVsdCkuXG4gICAgLy8gSWYgYHNvdXJjZU5vZGVzYCBpcyBub3Qgc3BlY2lmaWVkLCBhbGwgbm9kZXMgaW4gdGhlIGdyYXBoXG4gICAgLy8gYXJlIHVzZWQgYXMgc291cmNlIG5vZGVzLlxuICAgIGZ1bmN0aW9uIGRlcHRoRmlyc3RTZWFyY2goc291cmNlTm9kZXMsIGluY2x1ZGVTb3VyY2VOb2Rlcykge1xuICAgICAgICBpZiAoaW5jbHVkZVNvdXJjZU5vZGVzID09PSB2b2lkIDApIHsgaW5jbHVkZVNvdXJjZU5vZGVzID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoIXNvdXJjZU5vZGVzKSB7XG4gICAgICAgICAgICBzb3VyY2VOb2RlcyA9IG5vZGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpbmNsdWRlU291cmNlTm9kZXMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2aXNpdGVkID0ge307XG4gICAgICAgIHZhciBub2RlTGlzdCA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBERlNWaXNpdChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWRbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25vZGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhZGphY2VudChub2RlKS5mb3JFYWNoKERGU1Zpc2l0KTtcbiAgICAgICAgICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmNsdWRlU291cmNlTm9kZXMpIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVzLmZvckVhY2goREZTVmlzaXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc291cmNlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzb3VyY2VOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChERlNWaXNpdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZUxpc3Q7XG4gICAgfVxuICAgIC8vIExlYXN0IENvbW1vbiBBbmNlc3RvcnNcbiAgICAvLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vcmVsYXhlZHdzL2xjYS9ibG9iL21hc3Rlci9zcmMvTG93ZXN0Q29tbW9uQW5jZXN0b3IucGhwIGNvZGVcbiAgICAvLyBidXQgdXNlcyBkZXB0aCBzZWFyY2ggaW5zdGVhZCBvZiBicmVhZHRoLiBBbHNvIHVzZXMgc29tZSBvcHRpbWl6YXRpb25zXG4gICAgZnVuY3Rpb24gbG93ZXN0Q29tbW9uQW5jZXN0b3JzKG5vZGUxLCBub2RlMikge1xuICAgICAgICB2YXIgbm9kZTFBbmNlc3RvcnMgPSBbXTtcbiAgICAgICAgdmFyIGxjYXMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gQ0ExVmlzaXQodmlzaXRlZCwgbm9kZSkge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW25vZGVdKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbm9kZTFBbmNlc3RvcnMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PSBub2RlMikge1xuICAgICAgICAgICAgICAgICAgICBsY2FzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gZm91bmQgLSBzaG9ydGN1dFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWRqYWNlbnQobm9kZSkuZXZlcnkoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENBMVZpc2l0KHZpc2l0ZWQsIG5vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gQ0EyVmlzaXQodmlzaXRlZCwgbm9kZSkge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW25vZGVdKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUxQW5jZXN0b3JzLmluZGV4T2Yobm9kZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsY2FzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxjYXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnQobm9kZSkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ0EyVmlzaXQodmlzaXRlZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0ExVmlzaXQoe30sIG5vZGUxKSkge1xuICAgICAgICAgICAgLy8gTm8gc2hvcnRjdXQgd29ya2VkXG4gICAgICAgICAgICBDQTJWaXNpdCh7fSwgbm9kZTIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsY2FzO1xuICAgIH1cbiAgICAvLyBUaGUgdG9wb2xvZ2ljYWwgc29ydCBhbGdvcml0aG0geWllbGRzIGEgbGlzdCBvZiB2aXNpdGVkIG5vZGVzXG4gICAgLy8gc3VjaCB0aGF0IGZvciBlYWNoIHZpc2l0ZWQgZWRnZSAodSwgdiksIHUgY29tZXMgYmVmb3JlIHYgaW4gdGhlIGxpc3QuXG4gICAgLy8gQW1hemluZ2x5LCB0aGlzIGNvbWVzIGZyb20ganVzdCByZXZlcnNpbmcgdGhlIHJlc3VsdCBmcm9tIGRlcHRoIGZpcnN0IHNlYXJjaC5cbiAgICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDYxM1xuICAgIGZ1bmN0aW9uIHRvcG9sb2dpY2FsU29ydChzb3VyY2VOb2RlcywgaW5jbHVkZVNvdXJjZU5vZGVzKSB7XG4gICAgICAgIGlmIChpbmNsdWRlU291cmNlTm9kZXMgPT09IHZvaWQgMCkgeyBpbmNsdWRlU291cmNlTm9kZXMgPSB0cnVlOyB9XG4gICAgICAgIHJldHVybiBkZXB0aEZpcnN0U2VhcmNoKHNvdXJjZU5vZGVzLCBpbmNsdWRlU291cmNlTm9kZXMpLnJldmVyc2UoKTtcbiAgICB9XG4gICAgLy8gRGlqa3N0cmEncyBTaG9ydGVzdCBQYXRoIEFsZ29yaXRobS5cbiAgICAvLyBDb3JtZW4gZXQgYWwuIFwiSW50cm9kdWN0aW9uIHRvIEFsZ29yaXRobXNcIiAzcmQgRWQuIHAuIDY1OFxuICAgIC8vIFZhcmlhYmxlIGFuZCBmdW5jdGlvbiBuYW1lcyBjb3JyZXNwb25kIHRvIG5hbWVzIGluIHRoZSBib29rLlxuICAgIGZ1bmN0aW9uIHNob3J0ZXN0UGF0aChzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XG4gICAgICAgIC8vIFVwcGVyIGJvdW5kcyBmb3Igc2hvcnRlc3QgcGF0aCB3ZWlnaHRzIGZyb20gc291cmNlLlxuICAgICAgICB2YXIgZCA9IHt9O1xuICAgICAgICAvLyBQcmVkZWNlc3NvcnMuXG4gICAgICAgIHZhciBwID0ge307XG4gICAgICAgIC8vIFBvb3IgbWFuJ3MgcHJpb3JpdHkgcXVldWUsIGtleWVkIG9uIGQuXG4gICAgICAgIHZhciBxID0ge307XG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVTaW5nbGVTb3VyY2UoKSB7XG4gICAgICAgICAgICBub2RlcygpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkW25vZGVdID0gSW5maW5pdHk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChkW3NvdXJjZV0gIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU291cmNlIG5vZGUgaXMgbm90IGluIHRoZSBncmFwaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkW2Rlc3RpbmF0aW9uXSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXN0aW5hdGlvbiBub2RlIGlzIG5vdCBpbiB0aGUgZ3JhcGhcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkW3NvdXJjZV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZHMgZW50cmllcyBpbiBxIGZvciBhbGwgbm9kZXMuXG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVQcmlvcml0eVF1ZXVlKCkge1xuICAgICAgICAgICAgbm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgcVtub2RlXSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm5zIHRydWUgaWYgcSBpcyBlbXB0eS5cbiAgICAgICAgZnVuY3Rpb24gcHJpb3JpdHlRdWV1ZUVtcHR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHEpLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBMaW5lYXIgc2VhcmNoIHRvIGV4dHJhY3QgKGZpbmQgYW5kIHJlbW92ZSkgbWluIGZyb20gcS5cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdE1pbigpIHtcbiAgICAgICAgICAgIHZhciBtaW4gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIHZhciBtaW5Ob2RlO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocSkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChkW25vZGVdIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGRbbm9kZV07XG4gICAgICAgICAgICAgICAgICAgIG1pbk5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG1pbk5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoIGhlcmUsIHRoZXJlJ3MgYSBkaXNjb25uZWN0ZWQgc3ViZ3JhcGgsIGFuZCB3ZSdyZSBkb25lLlxuICAgICAgICAgICAgICAgIHEgPSB7fTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBxW21pbk5vZGVdO1xuICAgICAgICAgICAgcmV0dXJuIG1pbk5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVsYXgodSwgdikge1xuICAgICAgICAgICAgdmFyIHcgPSBnZXRFZGdlV2VpZ2h0KHUsIHYpO1xuICAgICAgICAgICAgaWYgKGRbdl0gPiBkW3VdICsgdykge1xuICAgICAgICAgICAgICAgIGRbdl0gPSBkW3VdICsgdztcbiAgICAgICAgICAgICAgICBwW3ZdID0gdTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkaWprc3RyYSgpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVTaW5nbGVTb3VyY2UoKTtcbiAgICAgICAgICAgIGluaXRpYWxpemVQcmlvcml0eVF1ZXVlKCk7XG4gICAgICAgICAgICB3aGlsZSAoIXByaW9yaXR5UXVldWVFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHUgPSBleHRyYWN0TWluKCk7XG4gICAgICAgICAgICAgICAgaWYgKHUgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBhZGphY2VudCh1KS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbGF4KHUsIHYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFzc2VtYmxlcyB0aGUgc2hvcnRlc3QgcGF0aCBieSB0cmF2ZXJzaW5nIHRoZVxuICAgICAgICAvLyBwcmVkZWNlc3NvciBzdWJncmFwaCBmcm9tIGRlc3RpbmF0aW9uIHRvIHNvdXJjZS5cbiAgICAgICAgZnVuY3Rpb24gcGF0aCgpIHtcbiAgICAgICAgICAgIHZhciBub2RlTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHdlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgd2hpbGUgKHBbbm9kZV0pIHtcbiAgICAgICAgICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIHdlaWdodCArPSBnZXRFZGdlV2VpZ2h0KHBbbm9kZV0sIG5vZGUpO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBwW25vZGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHBhdGggZm91bmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgbm9kZUxpc3QucmV2ZXJzZSgpO1xuICAgICAgICAgICAgbm9kZUxpc3Qud2VpZ2h0ID0gd2VpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVMaXN0O1xuICAgICAgICB9XG4gICAgICAgIGRpamtzdHJhKCk7XG4gICAgICAgIHJldHVybiBwYXRoKCk7XG4gICAgfVxuICAgIC8vIFNlcmlhbGl6ZXMgdGhlIGdyYXBoLlxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSB7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMoKS5tYXAoZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGxpbmtzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBzZXJpYWxpemVkLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBub2RlLmlkO1xuICAgICAgICAgICAgYWRqYWNlbnQoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkLmxpbmtzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodDogZ2V0RWRnZVdlaWdodChzb3VyY2UsIHRhcmdldClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG4gICAgfVxuICAgIC8vIERlc2VyaWFsaXplcyB0aGUgZ2l2ZW4gc2VyaWFsaXplZCBncmFwaC5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZShzZXJpYWxpemVkKSB7XG4gICAgICAgIHNlcmlhbGl6ZWQubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlcmlhbGl6ZWQubGlua3MuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuICAgICAgICAgICAgYWRkRWRnZShsaW5rLnNvdXJjZSwgbGluay50YXJnZXQsIGxpbmsud2VpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBncmFwaDtcbiAgICB9XG4gICAgLy8gVGhlIHJldHVybmVkIGdyYXBoIGluc3RhbmNlLlxuICAgIHJldHVybiBncmFwaDtcbn1cbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XG4iXX0=
