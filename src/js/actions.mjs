import { app } from './app.mjs';

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
  } catch (ex) {
    console.error(ex);
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
    console.error(ex);
  } finally {
    app.setLoading(false, false);
    window.location.reload();
  }
};

export { createAuction, placeBid, stopAuction };
