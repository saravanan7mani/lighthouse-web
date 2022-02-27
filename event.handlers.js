
export const longPressLink = async (d) => {

    const selectedLink = d.srcElement.__data__;

    //console.log('longPressLink: ', selectedLink);

    let msg = `<b>Channel ID:</b> ${selectedLink.channel_id} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedLink.capacity} sats (${formatSats(selectedLink.capacity)}) <br/> <br/>`;
    msg += `<b>Channel Point: </b> ${selectedLink.channel_point} <br/> <br/>`;
    msg += `<b>Source Node:</b> ${selectedLink.source.public_key} <br/> <br/>`;
    msg += `<b>Target Node:</b> ${selectedLink.target.public_key} <br/> <br/>`;

    const myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipBody').innerHTML = msg;


}

export const longPressNode = async (d) => {

    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;
    const index = selected.findIndex(s => s === pub_key);

    //console.log('longPressNode: ', selectedNode);

    let msg = `<b>Alias:</b> ${selectedNode.alias} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedNode.capacity} sats (${formatSats(selectedNode.capacity)}) <br/> <br/>`;
    msg += `<b>Public Key:</b> ${selectedNode.public_key} <br/> <br/>`;
    msg += `<b>Channel count:</b> ${selectedNode.channel_count} <br/> <br/>`;
    msg += `<b>Socket:</b> ${ selectedNode.sockets && selectedNode.sockets.length > 0 ? selectedNode.sockets.join(', '): 'None'} <br/> <br/>`;

    const myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipBody').innerHTML = msg;
}


