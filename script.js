const fetch = require('node-fetch');

let data; 

async function parse() {

    const out = [[]];
    const nodeResp          =   await fetch(`http://206.189.143.99:8089/graph/nodes`);
    const sortedNodes       =   (await nodeResp.json()).nodes;
    let count = 0;
    let bucketIndex = 0;
    let bucketCapacity = Math.round(sortedNodes.length / 10);

    console.log('len: ', sortedNodes.length);
    console.log('Least Capacity: ', sortedNodes[0].capacity);
    console.log('Max Capacity: ', sortedNodes[sortedNodes.length - 1].capacity);
    console.log('Bucket Capacity: ', bucketCapacity);
    
    for (let n of sortedNodes) {

        out[bucketIndex].push(n);
        count++;

        if (count % bucketCapacity === 0) {
            bucketIndex++;
            out.push([]);
            //console.log(count, bucketIndex, out);
            //console.log(count, bucketIndex);
        }

    }

    out.map((b, index) => {
        if (b.length > 0) {
            console.log(`Bucket #${index}: ${b[0].capacity} to ${b[b.length - 1].capacity}: Length: ${b.length}`);
        }
    });

}

parse();
