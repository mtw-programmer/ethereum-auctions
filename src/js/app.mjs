import { toggleLoaders, loadApp } from './load.mjs';
import { render } from './render.mjs';

class App {
  constructor() {
    this.loading = false;
    this.contracts = {};
    this.activeTemplate = '';
    this.stopTemplate = '';
  }

  setLoading(active, end) {
    this.loading = active || end;
    let bool = active;
    let loader = $('#active-loader');
    let content = $('.active-auctions');

    toggleLoaders(bool, loader, content);

    bool = end;
    loader = $('#end-loader');
    content = $('#stop-auctions');

    toggleLoaders(bool, loader, content);
  }
}

const app = new App();

$('#add-auction-btn').click(() => createAuction());

const createAuction = async () => {
  try {
    app.setLoading(true, false);
    const title = $('#title').val();
    const description = $('#description').val();
    const price = Math.round(parseFloat($('#price').val()) * 100);

    if (title && description && price) {
      await app.auctions.createAuction(title, description, price, { from: app.account });
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
  } finally {
    app.setLoading(false, false);
  }
};

const placeBid = async (id) => {
  try {
    const newPrice = Math.round(parseFloat($(`.enter-bid[name=${id}]`).val()) * 100);
    if (!newPrice || !id) return;
    app.setLoading(true, false);

    await app.auctions.placeBid(id, newPrice, { from: app.account });
  } catch (ex) {
    console.error(ex);
  } finally {
    app.setLoading(false, false);
    window.location.reload();
  }
};

const stopAuction = async (id) => {
  try {
    console.log(id);
    app.setLoading(true, true);
    await app.auctions.stopAuction(id, { from: app.account });
  } catch (ex) {
    console.log(ex);
  } finally {
    app.setLoading(false, false);
    window.location.reload();
  }
};

$(window).load(() => loadApp());
$(document).on('click','.bid-btn', (e) => placeBid(e.target.name));
$(document).on('click','.stop-bid-btn', (e) => stopAuction(e.target.name));

export { app, render };
