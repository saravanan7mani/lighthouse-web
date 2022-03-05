import { formatSats         }   from    './utils.js';

export const longPressLink = async (d) => {

    const selectedLink = d.srcElement.__data__;

    console.log('longPressLink: ', selectedLink);

    let msg = `<b>Channel ID:</b> ${selectedLink.channel_id} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedLink.capacity} sats (${formatSats(selectedLink.capacity)}) <br/> <br/>`;
    msg += `<b>Channel Point: </b> ${selectedLink.channel_point} <br/> <br/>`;

    if (selectedLink.n0_public_key)
        msg += `<b>Node 1 Public key: </b> ${selectedLink.n0_public_key} <br/> <br/>`;

    if (selectedLink.n1_public_key)
        msg += `<b>Node 2 Public key: </b> ${selectedLink.n1_public_key} <br/> <br/>`;


    msg += '<table style="width: 100%">';
    msg += '<tr>';
    msg += '<th> Property </th>';
    msg += '<th> Node 1 </th>';
    msg += '<th> Node 2 </th>';
    msg += '</tr>';

    if (selectedLink.n0_base_fee_mtokens || selectedLink.n1_base_fee_mtokens) {
        msg += '<tr>';
        msg += '<td> Base fee (in mSats) </td>';
        msg += selectedLink.n0_base_fee_mtokens ? `<td> ${selectedLink.n0_base_fee_mtokens} </td>` : '<td> </td>';
        msg += selectedLink.n1_base_fee_mtokens ? `<td> ${selectedLink.n1_base_fee_mtokens} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    if (selectedLink.n0_cltv_delta || selectedLink.n1_cltv_delta) {
        msg += '<tr>';
        msg += '<td> CLTV Delta </td>';
        msg += selectedLink.n0_cltv_delta ? `<td> ${selectedLink.n0_cltv_delta} </td>` : '<td> </td>';
        msg += selectedLink.n1_cltv_delta ? `<td> ${selectedLink.n1_cltv_delta} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    if (selectedLink.n0_fee_rate || selectedLink.n1_fee_rate) {
        msg += '<tr>';
        msg += '<td> Fee rate </td>';
        msg += selectedLink.n0_fee_rate ? `<td> ${selectedLink.n0_fee_rate} </td>` : '<td> </td>';
        msg += selectedLink.n1_fee_rate ? `<td> ${selectedLink.n1_fee_rate} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    if (selectedLink.n0_is_disabled || selectedLink.n1_is_disabled) {
        msg += '<tr>';
        msg += '<td> Is Disabled </td>';
        msg += selectedLink.n0_is_disabled ? `<td> ${selectedLink.n0_is_disabled} </td>` : '<td> </td>';
        msg += selectedLink.n1_is_disabled ? `<td> ${selectedLink.n1_is_disabled} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    if (selectedLink.n0_min_htlc_mtokens || selectedLink.n1_min_htlc_mtokens) {
        msg += '<tr>';
        msg += '<td> Min HTLC (in mSats) </td>';
        msg += selectedLink.n0_min_htlc_mtokens ? `<td> ${formatSats(selectedLink.n0_min_htlc_mtokens)} </td>` : '<td> </td>';
        msg += selectedLink.n1_min_htlc_mtokens ? `<td> ${formatSats(selectedLink.n1_min_htlc_mtokens)} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    if (selectedLink.n0_max_htlc_mtokens || selectedLink.n1_max_htlc_mtokens) {
        msg += '<tr>';
        msg += '<td> Max HTLC (in mSats) </td>';
        msg += selectedLink.n0_max_htlc_mtokens ? `<td> ${formatSats(selectedLink.n0_max_htlc_mtokens)} </td>` : '<td> </td>';
        msg += selectedLink.n1_max_htlc_mtokens ? `<td> ${formatSats(selectedLink.n1_max_htlc_mtokens)} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    /*
    if (selectedLink.n0_public_key || selectedLink.n1_public_key) {
        msg += '<tr>';
        msg += '<td> Public key </td>';
        msg += selectedLink.n0_public_key ? `<td> ${selectedLink.n0_public_key} </td>` : '<td> </td>';
        msg += selectedLink.n1_public_key ? `<td> ${selectedLink.n1_public_key} </td>` : '<td> </td>';
        msg += '</tr>';
    }
    */

    if (selectedLink.n0_updated_at || selectedLink.n1_updated_at) {
        const dateObj1 = new Date(selectedLink.n0_updated_at || 0);
        const dateObj2 = new Date(selectedLink.n1_updated_at || 0);

        msg += '<tr>';
        msg += '<td> Updated at </td>';
        msg += selectedLink.n0_updated_at ? `<td> ${dateObj1.toLocaleDateString()} ${dateObj1.toLocaleTimeString()} </td>` : '<td> </td>';
        msg += selectedLink.n1_updated_at ? `<td> ${dateObj2.toLocaleDateString()} ${dateObj2.toLocaleTimeString()} </td>` : '<td> </td>';
        msg += '</tr>';
    }

    msg += '</table>';

    /*
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

    if (selectedLink.n0_updated_at) {
        const dateObj = new Date(selectedLink.n0_updated_at);
        msg += `<b>N1: Updated at: </b> ${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()} <br/> <br/>`;
    }

    if (selectedLink.n1_updated_at) {
        const dateObj = new Date(selectedLink.n1_updated_at);
        msg += `<b>N2: Updated at: </b> ${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()} <br/> <br/>`;
    }
    */

    const myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipTile').innerText = 'Channel Info';
    document.getElementById('nodeTipBody').innerHTML = msg;

}

export const longPressNode = async (d) => {

    const selectedNode = d.srcElement.__data__;
    const pub_key = selectedNode.pub_key;
    const dateObj = new Date(selectedNode.updated_at);

    //console.log('longPressNode: ', selectedNode);

    let msg = `<b>Alias:</b> ${selectedNode.alias} <br/> <br/>`;
    msg += `<b>Capacity:</b> ${selectedNode.capacity} sats (${formatSats(selectedNode.capacity)}) <br/> <br/>`;
    msg += `<b>Public Key:</b> ${selectedNode.public_key} <br/> <br/>`;
    msg += `<b>Channel count:</b> ${selectedNode.channel_count} <br/> <br/>`;
    msg += `<b>Socket:</b> ${ selectedNode.sockets && selectedNode.sockets.length > 0 ? selectedNode.sockets.join(', '): 'None'} <br/> <br/>`;
    msg += `<b>Updated at:</b> ${ dateObj.toLocaleDateString() } ${ dateObj.toLocaleTimeString() } <br/> <br/>`;

    const myModal = new bootstrap.Modal(document.getElementById('nodeTipModel'))
    myModal.show();

    document.getElementById('nodeTipTile').innerText = 'Node Info';
    document.getElementById('nodeTipBody').innerHTML = msg;
}

document.getElementById('helpBtn').addEventListener('click', () => {

    const myModal = new bootstrap.Modal(document.getElementById('helpModel'));
    myModal.show();

});

