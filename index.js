import { firstResponse,
         secondResponse,
         thirdResponse,
         leafResponse       }   from    '../data.js'; 

import { parseNodes, 
         parseLinks, 
         formatSats         }   from    './utils.js';

import { drag, 
         redrawNodes,
         simTick            }   from    './d3.helper.js';

import { longPressLink, 
         longPressNode      }   from    './event.handlers.js';

const WIDTH                     =   document.getElementById('renderBox').clientWidth;
const HEIGHT                    =   document.getElementById('renderBox').clientHeight;
const CENTERX                   =   WIDTH / 2;
const CENTERY                   =   HEIGHT / 2;
const isMobile                  =   WIDTH < 640;

let nodes = [];
let links = [];
let vis = null;

let depth = 1
const lastDepth = 3;

let sim;
let apiResp;
let graphResp = firstResponse;
nodes.push(...graphResp.nodes);
links.push(...graphResp.links);

let breadCrumb = [''];

document.getElementById('helpBtn').addEventListener('click', () => {

    const myModal = new bootstrap.Modal(document.getElementById('helpModel'));
    console.log(myModal);
    myModal.show();

});

document.getElementById('resetBtn').addEventListener('click', () => {

    depth = 1;
    nodes = [];
    links = [];
    graphResp = firstResponse;
    nodes.push(...graphResp.nodes.map(n => {
        return {
            ...n,
            salt: Math.random()
        }
    }));

    breadCrumb = [''];
    document.getElementById('breadCrumb').innerHTML = breadCrumb.join('  <b> &gt; </b> ');

    vis.selectAll('.node').data([]).exit().remove();
    vis.selectAll('.link').data([]).exit().remove();
    vis.selectAll('.lineText').data([]).exit().remove();

    setTimeout(() => {
        init();
        //sim.force('charge', null);
        //sim.stop();
        //const simulation = d3.forceSimulation(nodes)
        //    .force('charge', d3.forceManyBody().strength( -10 ))
        //    .force('link', d3.forceLink(links))
        //    .force('center', d3.forceCenter(CENTERX, CENTERY));
        //sim = simulation;
        //sim.alpha(1).restart();
        //const { node, container, link, line, lineText } = redrawNodes(vis, simulation, nodes, links);
        //simTick(simulation, container, line, lineText);
    }, 100);

});

const click = async (d) => {

    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;
    const index = selected.findIndex(s => s === pub_key);

    //console.log('click: ', selected, selectedNode, index);

    nodes = [];
    links = [];

    if (depth === 1) {
        const serviceBase       =   'http://localhost:8089/graph/nodes';
        //const serviceBase       =   'http://139.59.38.23:8089/graph/nodes';
        const stSats            =   selectedNode.startSats;
        const enSats            =   selectedNode.endSats;
        const apiRawResp        =   await fetch(`${serviceBase}?min_capacity=${stSats}&max_capacity=${enSats}&limit=1000`);
        apiResp                 =   await apiRawResp.json();
        graphResp               =   {
            nodes: parseNodes(apiResp.nodes),
            links: []
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
        depth++;

        breadCrumb.push(`${formatSats(selectedNode.startSats)} to ${formatSats(selectedNode.endSats)}`);
        document.getElementById('breadCrumb').innerHTML = breadCrumb.join('  <b> &gt; </b> ');

    } else if (depth < lastDepth) {
        graphResp               =   {
            nodes: parseNodes(selectedNode.children),
            links: []
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
        depth++;

        breadCrumb.push(`${formatSats(selectedNode.startSats)} to ${formatSats(selectedNode.endSats)}`);
        document.getElementById('breadCrumb').innerHTML = breadCrumb.join('  <b> &gt; </b> ');

    } else if (depth === lastDepth) {
        graphResp               =   {
            nodes: selectedNode.children,
            links: []
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
        depth++;

        breadCrumb.push(`${formatSats(selectedNode.startSats)} to ${formatSats(selectedNode.endSats)}`);
        document.getElementById('breadCrumb').innerHTML = breadCrumb.join('  <b> &gt; </b> ');

    } else if (depth === lastDepth + 1) {
        const serviceBase       =   'http://localhost:8089/graph/nodes';
        //const serviceBase       =   'http://139.59.38.23:8089/graph/nodes';
        const apiRawResp        =   await fetch(serviceBase, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "public_keys": [selectedNode.public_key]
            })
        });
        const endNodeResp       =   await apiRawResp.json();

        const lnks = parseLinks(endNodeResp);

        //console.log('lnks 1', endNodeResp);
        //console.log('lnks 2', lnks);

        graphResp               =   {
            nodes: endNodeResp.nodes,
            links: lnks
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
    }

    //console.log(nodes, links);

    vis.selectAll('.node').data([]).exit().remove();
    vis.selectAll('.link').data([]).exit().remove();
    vis.selectAll('.lineText').data([]).exit().remove();

    setTimeout(() => {
        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength( strength ))
            .force('link', d3.forceLink(links).distance(d => depth < lastDepth + 1 ? 30 : isMobile ? (70 + d.index * 3) : (100 + d.index * 5) ))
            .force('center', d3.forceCenter(CENTERX, CENTERY));
        sim = simulation;

        const { node, container, link, line, lineText } = redrawNodes(vis, simulation, nodes, links,
            isMobile, depth, lastDepth, radius,
            circleStroke, circleColor, primaryColor, grayColor,
            genNodeText, genNodeCountText);

        simTick(simulation, container, line, lineText);
    }, 100);

}


const selected = [];

const strength = (d) => isMobile ? -25 : -50
const radius = (d) => {
    if (isMobile) {
        return depth === lastDepth + 1 ? 15 : 35
    } else {
        return depth === lastDepth + 1 ? 25 : 45
    }
};
const circleStroke = (d) => {
    if (depth > lastDepth) {
        return '#FF8888';
    } else {
        return '#BBBBBB';
    }
}

const circleColor = (d) => {
    if (depth > lastDepth) {
        return nodeColor;
    } else {
        return bucketColor;
    }
};
const primaryColor = (d) => '#0d6efd';
const grayColor = (d) => '#666666';
const nodeColor = '#FFBBBB';
const bucketColor = '#DDDDDD';
const genNodeText = (d, st) => {

    if (st === 0) {
        if (depth === lastDepth + 1) {
            return d.alias || d.public_key.substring(0, 12);
        } else {
            return formatSats(d.startSats);
        }
    } else {
        if (depth === lastDepth + 1) {
            return `${formatSats(d.capacity)} sats`;
        } else {
            return formatSats(d.endSats);
        }
    }
}

const genNodeCountText = (d) => {

    if (depth === lastDepth + 1) {
        return 'Capacity: ' + d.capacity;
    } else {
        return 'Count: ' + d.peers;
    }

}

function init() {

    vis = d3.select('#renderBox');
    console.log('vis', vis);

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength( strength ))
        .force('link', d3.forceLink(links))
        .force('center', d3.forceCenter(CENTERX, CENTERY));
    sim = simulation;

    const { node, container, link, line, lineText } = redrawNodes(vis, simulation, nodes, links,
        isMobile, depth, lastDepth, radius,
        circleStroke, circleColor, primaryColor, grayColor,
        genNodeText, genNodeCountText);

    simTick(simulation, container, line, lineText);

}

setTimeout(() => {
    init();
}, 100);

