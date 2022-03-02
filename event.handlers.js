import { formatSats         }   from    './utils.js';

export const longPressLink = async (d) => {

    const selectedLink = d.srcElement.__data__;

    console.log('longPressLink: ', selectedLink);

    let msg = `<b>Channel ID:</b> ${selectedLink.channel_id} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedLink.capacity} sats (${formatSats(selectedLink.capacity)}) <br/> <br/>`;
    msg += `<b>Channel Point: </b> ${selectedLink.channel_point} <br/> <br/>`;

    if (selectedLink.n0_base_fee_mtokens)
        msg += `<b>N1: Base fee: </b> ${selectedLink.n0_base_fee_mtokens} (in mSats) <br/> <br/>`;

    if (selectedLink.n1_base_fee_mtokens)
        msg += `<b>N2: Base fee: </b> ${selectedLink.n1_base_fee_mtokens} (in mSats) <br/> <br/>`;

    if (selectedLink.n0_cltv_delta)
        msg += `<b>N1: CLTV Delta: </b> ${selectedLink.n0_cltv_delta} <br/> <br/>`;

    if (selectedLink.n1_cltv_delta)
        msg += `<b>N2: CLTV Delta: </b> ${selectedLink.n1_cltv_delta} <br/> <br/>`;

    if (selectedLink.n0_fee_rate)
        msg += `<b>N1: Fee rate: </b> ${selectedLink.n0_fee_rate} <br/> <br/>`;

    if (selectedLink.n1_fee_rate)
        msg += `<b>N2: Fee rate: </b> ${selectedLink.n1_fee_rate} <br/> <br/>`;

    if (selectedLink.n0_is_disabled)
        msg += `<b>N1: Is Disabled: </b> ${selectedLink.n0_is_disabled} <br/> <br/>`;

    if (selectedLink.n1_is_disabled)
        msg += `<b>N2: Is Disabled: </b> ${selectedLink.n1_is_disabled} <br/> <br/>`;

    if (selectedLink.n0_max_htlc_mtokens)
        msg += `<b>N1: Max HTLC: </b> ${formatSats(selectedLink.n0_max_htlc_mtokens)} (in mSats) <br/> <br/>`;

    if (selectedLink.n1_max_htlc_mtokens)
        msg += `<b>N2: Max HTLC: </b> ${formatSats(selectedLink.n1_max_htlc_mtokens)} (in mSats) <br/> <br/>`;

    if (selectedLink.n0_min_htlc_mtokens)
        msg += `<b>N1: Min HTLC: </b> ${formatSats(selectedLink.n0_min_htlc_mtokens)} (in mSats) <br/> <br/>`;

    if (selectedLink.n1_min_htlc_mtokens)
        msg += `<b>N2: Min HTLC: </b> ${formatSats(selectedLink.n1_min_htlc_mtokens)} (in mSats) <br/> <br/>`;

    if (selectedLink.n0_public_key)
        msg += `<b>N1: Public key: </b> ${selectedLink.n0_public_key} <br/> <br/>`;

    if (selectedLink.n1_public_key)
        msg += `<b>N2: Public key: </b> ${selectedLink.n1_public_key} <br/> <br/>`;

    if (selectedLink.n0_updated_at)
        msg += `<b>N1: Updated at: </b> ${selectedLink.n0_updated_at} <br/> <br/>`;

    if (selectedLink.n1_updated_at)
        msg += `<b>N2: Updated at: </b> ${selectedLink.n1_updated_at} <br/> <br/>`;

    const myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipBody').innerHTML = msg;

    document.getElementById('nodeTipTile').innerText = 'Channel Info';

}

export const longPressNode = async (d) => {

    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;

    //console.log('longPressNode: ', selectedNode);

    let msg = `<b>Alias:</b> ${selectedNode.alias} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedNode.capacity} sats (${formatSats(selectedNode.capacity)}) <br/> <br/>`;
    msg += `<b>Public Key:</b> ${selectedNode.public_key} <br/> <br/>`;
    msg += `<b>Channel count:</b> ${selectedNode.channel_count} <br/> <br/>`;
    msg += `<b>Socket:</b> ${ selectedNode.sockets && selectedNode.sockets.length > 0 ? selectedNode.sockets.join(', '): 'None'} <br/> <br/>`;
    msg += `<b>Updated at:</b> ${ selectedNode.updated_at } <br/> <br/>`;

    const myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipBody').innerHTML = msg;

    document.getElementById('nodeTipTile').innerText = 'Node Info';
}

document.getElementById('helpBtn').addEventListener('click', () => {

    const myModal = new bootstrap.Modal(document.getElementById('helpModel'));
    myModal.show();

});

