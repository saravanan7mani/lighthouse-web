
export function parseNodes(sortedNodes) {

    const out = [[]];
    let count = 0;
    let bucketIndex = 0;
    let bucketCapacity = Math.round(sortedNodes.length / 10);

    //console.log('len: ', sortedNodes.length);
    //console.log('Bucket Capacity:', bucketCapacity);
    //console.log('Least Capacity: ', sortedNodes[0].capacity);
    //console.log('Max Capacity: ', sortedNodes[sortedNodes.length - 1].capacity);
    
    for (let n of sortedNodes) {

        out[bucketIndex].push(n);
        count++;

        if (count % bucketCapacity === 0) {
            bucketIndex++;
            out.push([]);
        }

    }

    return out.filter(b => b.length > 0).map((bucket, index) => {

        //console.log(`Bucket #${index}: ${bucket[0].capacity} to ${bucket[bucket.length - 1].capacity}`);
        
        return {
            id                      :   index,
            alias                   :   `${formatSats(bucket[0].capacity)} to ${formatSats(bucket[bucket.length - 1].capacity)} sats`,
            peers                   :   bucket.length,
            startSats               :   bucket[0].capacity,
            endSats                 :   bucket[bucket.length - 1].capacity,
            children                :   bucket
        }
    });
}

export function parseLinks({nodes, channels}) {
    return channels.map(l => {
        return {
            source: nodes.findIndex(n => n.public_key === l.n0_public_key),
            target: nodes.findIndex(n => n.public_key === l.n1_public_key),
            ...l
        }
    });
}

export function formatSats(sats) {

    if (sats < 1000) {
        return sats;
    } else if (sats < 1000000) {
        return (sats / 1000).toFixed(2) + 'K';
        //return (sats / 1000).toFixed(0) + 'K';
    } else {
        return (sats / 1000000).toFixed(2) + 'M';
        //return (sats / 1000000).toFixed(0) + 'M';
    }

}
