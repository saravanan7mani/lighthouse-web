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

