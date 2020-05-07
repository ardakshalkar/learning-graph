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