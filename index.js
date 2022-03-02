
import { parseNodes, 
         parseLinks, 
         formatSats         }   from    './utils.js';

import { drag, 
         redrawNodes,
         simTick            }   from    './d3.helper.js';

import { longPressLink, 
         longPressNode      }   from    './event.handlers.js';

let firstResponse;
//const serviceBase               =   'http://localhost:8089/graph/nodes';
//const serviceBase               =   'http://206.189.143.99:8089/graph/nodes';
const serviceBase               =   'https://api.lnlighthouse.online/graph/nodes';
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
let graphResp;

let breadCrumb = [''];

document.getElementById('searchBtn').addEventListener('click', async () => {

    depth = lastDepth + 1;

    const pubKeyToSearch = document.getElementById('publicKeyField').value;

    document.getElementById('spinOverlay').style.display = 'block';
    document.getElementById('spinSpinner').style.display = 'block';

    const apiRawResp        =   await fetch(serviceBase, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "public_keys": [pubKeyToSearch]
        })
    });
    const endNodeResp       =   await apiRawResp.json();
    console.log('endNodeResp: ', endNodeResp);

    document.getElementById('spinOverlay').style.display = 'none';
    document.getElementById('spinSpinner').style.display = 'none';

    const lnks = parseLinks(endNodeResp);

    breadCrumb = [];
    document.getElementById('breadCrumb').innerHTML = breadCrumb.join('  <b> &gt; </b> ');

    nodes = [];
    links = [];

    graphResp               =   {
        nodes: parseNodes(endNodeResp.nodes),
        links: lnks
    };
    console.log('graphResp', graphResp);
    nodes.push(...graphResp.nodes);
    links.push(...graphResp.links);

    const selectedN = nodes.find(n => n.public_key === pubKeyToSearch);
    //selectedN.isCenter = true;

    vis.selectAll('.node').data([]).exit().remove();
    vis.selectAll('.link').data([]).exit().remove();
    vis.selectAll('.lineText').data([]).exit().remove();

    setTimeout(() => {
        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength( strength ))
            .force('link', d3.forceLink(links).distance(d => depth < lastDepth + 1 ? 30 : isMobile ? (60 + d.index * 3) : (90 + d.index * 4) ))
            .force('center', d3.forceCenter(CENTERX, CENTERY));
        sim = simulation;

        const { node, container, link, line, lineText } = redrawNodes(vis, simulation, nodes, links,
            isMobile, depth, lastDepth, radius,
            circleStroke, circleColor, primaryColor, grayColor,
            genNodeText, genNodeCountText, click);

        simTick(simulation, container, line, lineText);
    }, 100);

});

document.getElementById('resetBtn').addEventListener('click', () => {

    depth = 1;
    nodes = [];
    links = [];
    graphResp = firstResponse;
    console.log('graphResp', graphResp);
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
        
        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength( 0 ))
            .force('link', d3.forceLink(links))
            .force('center', d3.forceCenter(CENTERX, CENTERY));
        sim = simulation;
        const { node, container, link, line, lineText } = redrawNodes(vis, simulation, nodes, links,
            isMobile, depth, lastDepth, radius,
            circleStroke, circleColor, primaryColor, grayColor,
            genNodeText, genNodeCountText, click);

        simTick(simulation, container, line, lineText);

    }, 100);

});

const click = async (d) => {

    const selectedNode = d.srcElement.__data__;

    //console.log('click: ', selected, selectedNode, index);

    nodes = [];
    links = [];

    if (depth === 1) {
        graphResp               =   {
            nodes: parseNodes(selectedNode.children),
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

    } else if (depth <= lastDepth) {
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

        document.getElementById('spinOverlay').style.display = 'block';
        document.getElementById('spinSpinner').style.display = 'block';

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

        document.getElementById('spinOverlay').style.display = 'none';
        document.getElementById('spinSpinner').style.display = 'none';

        const lnks = parseLinks(endNodeResp);

        breadCrumb = [];
        document.getElementById('breadCrumb').innerHTML = breadCrumb.join('  <b> &gt; </b> ');

        nodes = [];
        links = [];

        graphResp               =   {
            nodes: endNodeResp.nodes,
            links: lnks
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);

        const selectedN = nodes.find(n => n.public_key === selectedNode.public_key);
        selectedN.isCenter = true;
    }

    //console.log('click: ', nodes, links);

    vis.selectAll('.node').data([]).exit().remove();
    vis.selectAll('.link').data([]).exit().remove();
    vis.selectAll('.lineText').data([]).exit().remove();

    setTimeout(() => {
        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength( strength ))
            .force('link', d3.forceLink(links).distance(d => depth < lastDepth + 1 ? 30 : isMobile ? (60 + d.index * 3) : (90 + d.index * 4) ))
            .force('center', d3.forceCenter(CENTERX, CENTERY));
        sim = simulation;

        const { node, container, link, line, lineText } = redrawNodes(vis, simulation, nodes, links,
            isMobile, depth, lastDepth, radius,
            circleStroke, circleColor, primaryColor, grayColor,
            genNodeText, genNodeCountText, click);

        simTick(simulation, container, line, lineText);
    }, 100);

}


const selected = [];

const strength = (d) => {
    if (depth > lastDepth) {
        return isMobile ? -10 : -20;
    } else {
        return isMobile ? -25 : -50;
    }
}
const radius = (d) => {
    if (isMobile) {
        return depth === lastDepth + 1 ? 15 : 35
    } else {
        return depth === lastDepth + 1 ? 28 : 45
    }
};
const circleStroke = (d) => {
    if (depth > lastDepth) {
        return '#1EB5D2';
    } else {
        return '#BBBBBB';
    }
}

const circleColor = (d) => {
    if (depth > lastDepth) {
        if (d.isCenter) {
            return '#F79767';
        } else {
            return '#57C8E3';
        }
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
        genNodeText, genNodeCountText, click);

    simTick(simulation, container, line, lineText);

}

setTimeout(async () => {

    const lnNetworkRaw = await fetch(serviceBase);
    firstResponse = {
        nodes: parseNodes((await lnNetworkRaw.json()).nodes),
        links: []
    };
    graphResp = firstResponse;
    nodes.push(...graphResp.nodes);
    links.push(...graphResp.links);

    document.getElementById('spinOverlay').style.display = 'none';
    document.getElementById('spinSpinner').style.display = 'none';
    init();
}, 100);

