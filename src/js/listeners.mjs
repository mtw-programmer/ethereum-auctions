import { loadApp } from './load.mjs';
import { createAuction, placeBid, stopAuction } from './actions.mjs';

$('#add-auction-btn').click(() => createAuction());
$(window).load(() => loadApp());
$(document).on('click','.bid-btn', (e) => placeBid(e.target.name));
$(document).on('click','.stop-bid-btn', (e) => stopAuction(e.target.name));
