import { firstResponse,
         secondResponse,
         thirdResponse,
         leafResponse       }   from    '../data.js'; 

import { parseNodes, 
         parseLinks, 
         formatSats         }   from    './utils.js';

import { simTick            }   from    './d3.helper.js';

const WIDTH                     =   document.getElementById('renderBox').clientWidth;
const HEIGHT                    =   document.getElementById('renderBox').clientHeight;
const CENTERX                   =   WIDTH / 2;
const CENTERY                   =   HEIGHT / 2;

let nodes = [];
let links = [];
let vis = null;

let depth = 1, lastDepth = 3;

let apiResp;
let graphResp = firstResponse;
nodes.push(...graphResp.nodes);
links.push(...graphResp.links);

let tapStartTime;
let tapEndTime;

const update = (vis, simulation, nodes, links) => {

    // Link setup
    const link = vis.selectAll('.link').data(links);
    const line = link.enter()
        .append('line')
        .attr('id', l => l.id)
        .attr('class', 'link')
        .attr('stroke', '#aaaaff')
        .attr('stroke-width', '5px')
        .attr('x1', l => l.source.x)
        .attr('y1', l => l.source.y)
        .attr('x2', l => l.target.x)
        .attr('y2', l => l.target.y)
        .on('mousedown', (d) => {
            tapStartTime = new Date().getTime();
        })
        .on('mouseup', (d) => {
            tapEndTime = new Date().getTime();
            if (tapEndTime - tapStartTime > 200 && depth === lastDepth + 1) {
                longPressLink(d);
            }
        });

    link.exit().remove();

    const linkText = vis.selectAll('.lineText').data(links);
    const lineText = linkText.enter()
        .append("text")
        .attr("class","lineText")
        .attr("dx",20)
        .attr("dy",0)
        .style("fill","red")
        .text(d => formatSats(d.capacity) )
    linkText.exit().remove();

    // Node setup
    const node = vis.selectAll('.node').data(nodes);
    const container = node.enter()
        .append('g')
        .attr('class', 'node')
        .style('transform', (d) => `translate(${d.x}px, ${d.y}px)`)
        //.on('click', click)
        .on('mousedown', (d) => {
            tapStartTime = new Date().getTime();
        })
        .on('mouseup', (d) => {
            tapEndTime = new Date().getTime();
            if (tapEndTime - tapStartTime > 200 && depth === lastDepth + 1) {
                longPressNode(d);
            } else {
                click(d);
            }
        });
    container.append('circle').attr('r', radius).style('fill', color).style('stroke', circleStroke);
    container.append('text').style('text-anchor', 'start').attr('fill', '#0000ff77').style('font-size', '12px').attr("x", "10px");

    container.selectAll('circle').transition().attr('r', radius).style('fill', color);
    container.selectAll('text').text(genNodeText);
    node.exit().remove();


    return {
        node, container, link, line, lineText
    };

}

const longPressLink = async (d) => {

    const selectedLink = d.srcElement.__data__;

    console.log('longPressLink: ', selectedLink);

    let msg = `<b>Channel ID:</b> ${selectedLink.channel_id} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedLink.capacity} sats (${formatSats(selectedLink.capacity)}) <br/> <br/>`;
    msg += `<b>Channel Point: </b> ${selectedLink.channel_point} <br/> <br/>`;
    msg += `<b>Source Node:</b> ${selectedLink.source.public_key} <br/> <br/>`;
    msg += `<b>Target Node:</b> ${selectedLink.target.public_key} <br/> <br/>`;

    var myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipBody').innerHTML = msg;


}

const longPressNode = async (d) => {

    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;
    const index = selected.findIndex(s => s === pub_key);

    console.log('longPressNode: ', selectedNode);

    let msg = `<b>Alias:</b> ${selectedNode.alias} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedNode.capacity} sats (${formatSats(selectedNode.capacity)}) <br/> <br/>`;
    msg += `<b>Public Key:</b> ${selectedNode.public_key} <br/> <br/>`;
    msg += `<b>Channel count:</b> ${selectedNode.channel_count} <br/> <br/>`;
    msg += `<b>Socket:</b> ${ selectedNode.sockets && selectedNode.sockets.length > 0 ? selectedNode.sockets.join(', '): 'None'} <br/> <br/>`;

    var myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipBody').innerHTML = msg;
    //document.getElementById('nodeTipBody').innerHTML = 'msg';
}

const click = async (d) => {

    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;
    const index = selected.findIndex(s => s === pub_key);

    console.log(selected, selectedNode, index);

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

    } else if (depth < lastDepth) {
        graphResp               =   {
            nodes: parseNodes(selectedNode.children),
            links: []
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
        depth++;

    } else if (depth === lastDepth) {
        graphResp               =   {
            nodes: selectedNode.children,
            links: []
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
        depth++;

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

        console.log('lnks 1', endNodeResp);
        console.log('lnks 2', lnks);

        graphResp               =   {
            nodes: endNodeResp.nodes,
            links: lnks
        };
        nodes.push(...graphResp.nodes);
        links.push(...graphResp.links);
    }

    console.log(nodes, links);

    vis.selectAll('.node').data([]).exit().remove();
    vis.selectAll('.link').data([]).exit().remove();
    vis.selectAll('.lineText').data([]).exit().remove();

  setTimeout(() => {
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength( -40 ))
      .force('link', d3.forceLink(links).distance(d => { console.log(d.index); return depth < lastDepth + 1 ? 30 : 100 + d.index * 5; } ))
      .force('center', d3.forceCenter(CENTERX, CENTERY));

    const { node, container, link, line, lineText } = update(vis, simulation, nodes, links);

      console.log('line: ', line);
      console.log('lineText: ', lineText);

    simTick(simulation, container, line, lineText);
  }, 100);

}


const selected = [];

const radius = (d) => 30;
const circleStroke = (d) => d.capacity > 500000000 ? '#666666': '#ffffff';
const color = (d) => { /* console.log('color: ', d); */ return selected.indexOf(d.pub_key) > -1 ? '#0000ff' : '#F69400' };

const genNodeText = (d) => {
    if (depth === lastDepth + 1) {
        return `${d.alias || d.public_key} (${formatSats(d.capacity)} sats)`;
    } else {
        return `${d.alias} (${d.peers})`;
    }
}


function init() {

    vis = d3.select('#renderBox');
    console.log('vis', vis);

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength( -40 ))
        .force('link', d3.forceLink(links))
        .force('center', d3.forceCenter(CENTERX, CENTERY));

    const { node, container, link, line, lineText } = update(vis, simulation, nodes, links);

    simTick(simulation, container, line, lineText);

}

setTimeout(() => {
    init();
}, 100);

