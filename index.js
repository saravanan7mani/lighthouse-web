import { firstResponse,
         secondResponse,
         thirdResponse,
         leafResponse       }   from    '../data.js'; 

const WIDTH                     =   document.getElementById('renderBox').clientWidth;
const HEIGHT                    =   document.getElementById('renderBox').clientHeight;
console.log(WIDTH, HEIGHT);
const CENTERX                   =   WIDTH / 2;
const CENTERY                   =   HEIGHT / 2;

const nodes = [];
const links = [];
let vis = null;

const depth = 1;

const graphResp = firstResponse;
nodes.push(...graphResp.nodes);
links.push(...graphResp.links);

const update = (vis, simulation, nodes, links) => {

    // Node setup
    const node = vis.selectAll('.node').data(nodes);
    const container = node.enter()
        .append('g')
        .attr('class', 'node')
        .style('transform', (d) => `translate(${d.x}px, ${d.y}px)`)
        .on('click', click)
    container.append('circle').attr('r', radius).style('fill', color).style('stroke', circleStroke);
    container.append('text').style('text-anchor', 'start').attr('fill', '#0000ff77').style('font-size', '12px').attr("x", "10px");

    container.selectAll('circle').transition().attr('r', radius).style('fill', color);
    container.selectAll('text').text((d) => d.alias );
    node.exit().remove();

    // Link setup
    const link = vis.selectAll('.link').data(links);
    const line = link.enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke', '#aaaaff')
        .attr('x1', l => l.source.x)
        .attr('y1', l => l.source.y)
        .attr('x2', l => l.target.x)
        .attr('y2', l => l.target.y);
    link.exit().remove();

    return {
        node, container, link, line
    };

}

const click = async (d) => {

    /*
    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;
    const index = selected.findIndex(s => s === pub_key);

    console.log(selected, selectedNode, index);
    */

    //const rawResp = await new Promise(();
    //const graphResp = await rawResp.json();
    nodes = [];
    links = [];

    const graphResp = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (depth === 1) {
          resolve(secondResponse);
        } else if (depth === 2) {
          resolve(thirdResponse);
        } else if (depth === 3) {
          resolve(leafResponse);
        }
        depth++;
      }, 100);
    });
    nodes.push(...graphResp.nodes);
    links.push(...graphResp.links);
    console.log(nodes, links);

    vis.selectAll('.node').data([]).exit().remove();
    vis.selectAll('.link').data([]).exit().remove();

  setTimeout(() => {
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength( -40 ))
      .force('link', d3.forceLink(links))
      .force('center', d3.forceCenter(CENTERX, CENTERY));


    const { node, container, link, line } = update(vis, simulation, nodes, links);

    simTick(simulation, container, line);
  }, 100);

}


const selected = [];

const radius = (d) => 30;
const circleStroke = (d) => d.capacity > 500000000 ? '#666666': '#ffffff';
const color = (d) => { console.log('color: ', d); return selected.indexOf(d.pub_key) > -1 ? '#0000ff' : '#F69400' };
const simTick = (simulation, container, line) => {

    console.log('container: ', container);
    console.log('line: ', line);

    simulation.on('tick', () => {

        container
            .style('transform', (d) =>  `translate(${d.x}px, ${d.y}px`);

        line
            .attr('x1', l => l.source.x)
            .attr('y1', l => l.source.y)
            .attr('x2', l => l.target.x)
            .attr('y2', l => l.target.y);

    });
}

function init() {

    vis = d3.select('#renderBox');
    console.log('vis', vis);

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength( -40 ))
        .force('link', d3.forceLink(links))
        .force('center', d3.forceCenter(CENTERX, CENTERY));

    const { node, container, link, line } = update(vis, simulation, nodes, links);

    simTick(simulation, container, line);

}

setTimeout(() => {
    init();
}, 100);


