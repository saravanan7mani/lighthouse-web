/*
 * Click / Dbl click - Differentiator
 * https://stackoverflow.com/questions/49357718/both-single-and-double-click-on-a-node-in-d3-force-directed-graph
 */
import { formatSats         }   from    './utils.js';

import { longPressLink, 
         longPressNode      }   from    './event.handlers.js';

let isMobile;
let timeout = null;


const fnBig = (d) => isMobile ? '12px' : '14px';
const fnNormal = (d) => isMobile ? '10px' : '12px';
const fnSmall = (d) => isMobile ? '8px' : '10px';

export const redrawNodes = (vis, simulation, nodes, links,
    _isMobile, depth, lastDepth, radius,
    circleStroke, circleColor, primaryColor, grayColor,
    genNodeText, genNodeCountText, click) => {

    isMobile = _isMobile

    // Link setup
    const link = vis.selectAll('.link').data(links);
    const line = link.enter()
        .append('line')
        .attr('id', l => l.id)
        .attr('class', 'link')
        .attr('stroke', '#aaaaaa')
        .attr('stroke-width', '3')
        .attr('x1', l => l.source.x)
        .attr('y1', l => l.source.y)
        .attr('x2', l => l.target.x)
        .attr('y2', l => l.target.y)
        .on('dblclick', (d) => {
            console.log('dblclick');
            longPressLink(d);
        })
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', '6');
            d3.select(this).attr('stroke', primaryColor);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', '3');
            d3.select(this).attr('stroke', '#aaaaaa');
        });

    link.exit().remove();

    const linkText = vis.selectAll('.lineText').data(links);
    const lineText = linkText.enter()
        .append("text")
        .attr("class","lineText")
        .attr("dx",0)
        .attr("dy",0)
        .style("fill", '#073a82')
        .style('font-size', fnSmall)
        .text(d => formatSats(d.capacity) )
    linkText.exit().remove();

    // Node setup
    const node = vis.selectAll('.node').data(nodes);
    const container = node.enter()
        .append('g')
        .attr('class', 'node')
        .style('transform', (d) => `translate(${d.x}px, ${d.y}px)`)
        .call(drag(simulation))
        .on('click', (d) => {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                console.log('click');
                click(d);
            }, 300)
        })
        .on('dblclick', (d) => {
            console.log('dblclick');
            clearTimeout(timeout);
            longPressNode(d);
        })
        .on('mouseover', function() {
            //console.log('mouse over');
            d3.select(this.firstChild).attr('stroke-width', 2);
            d3.select(this.firstChild).attr('stroke', depth > lastDepth ? '#FF6666': primaryColor );
        })
        .on('mouseout', function() {
            //console.log('mouse out');
            d3.select(this.firstChild).attr('stroke-width', 1);
            d3.select(this.firstChild).attr('stroke', circleStroke);
        })

    container.append('circle')
        .attr('r', radius)
        .attr('stroke', circleStroke)
        .attr('stroke-width', 1)
        .style('fill', circleColor)

    if (depth === lastDepth + 1) {

        container.append('text')
            .attr('class', 'st')
            .attr('fill', '#555555')
            .attr("y", "0")
            .style('text-anchor', 'middle')
            .style('font-size', fnNormal)
            .style('font-weight', 'bold');

        container.append('text')
            .attr('class', 'en')
            .attr('fill', '#555555')
            .attr("y", "16px")
            .style('text-anchor', 'middle')
            .style('font-size', fnSmall)
            .style('font-weight', 'bold');

        container.selectAll('text.st').text( d => genNodeText(d , 0));
        container.selectAll('text.en').text( d => genNodeText(d , 1));


    } else {

        container.append('text')
            .attr('class', 'st')
            .attr('fill', primaryColor)
            .attr("y", "-12")
            .style('text-anchor', 'middle')
            .style('font-size', fnBig)
            .style('font-weight', 'bold');

        container.append('text')
            .attr('fill', grayColor)
            .attr("y", "4px")
            .style('text-anchor', 'middle')
            .style('font-size', fnNormal)
            .text('to');

        container.append('text')
            .attr('class', 'en')
            .attr('fill', primaryColor)
            .attr("y", "22px")
            .style('text-anchor', 'middle')
            .style('font-size', fnBig)
            .style('font-weight', 'bold');

        container.append('text')
            .attr('class', 'count')
            .attr('fill', grayColor)
            .attr("y", isMobile ? "50px": "58px")
            .style('text-anchor', 'middle')
            .style('font-size', fnBig);

        container.selectAll('text.st').text( d => genNodeText(d , 0));
        container.selectAll('text.en').text( d => genNodeText(d , 1));
        container.selectAll('text.count').text( d => genNodeCountText(d , 1));


    }

    container.selectAll('circle').transition().attr('r', radius).style('fill', circleColor);
    node.exit().remove();

    return {
        node, container, link, line, lineText
    };

}


export function simTick(simulation, container, line, lineText) {

    simulation.on('tick', () => {

        container
            .style('transform', (d) =>  `translate(${d.x}px, ${d.y}px`);

        line
            .attr('x1', l => l.source.x)
            .attr('y1', l => l.source.y)
            .attr('x2', l => l.target.x)
            .attr('y2', l => l.target.y);

        let lineTextIndexX = 0;
        let lineTextIndexY = 0;

        if (line._groups[0].length > 0) {
            lineText
                .attr('x', () => {
                    const s = line._groups[0][lineTextIndexX].__data__.source;
                    const t = line._groups[0][lineTextIndexX].__data__.target;
                    lineTextIndexX++;
                    return (s.x + t.x) / 2;
                })
                .attr('y', () => {
                    const s = line._groups[0][lineTextIndexY].__data__.source;
                    const t = line._groups[0][lineTextIndexY].__data__.target;
                    lineTextIndexY++;
                    return (s.y + t.y) / 2;
                });
        }

    });
}

export function drag(simulation) {    
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}
