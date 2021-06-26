const db = require('../utils/db');

module.exports = {
  all() {
    return db('products');
  },

  // findByCatID(catId) {
  //   return db('products').where('CatID', catId);
  // },

  findByCatID(catId, offset) {
    return db('products')
      .where('CatID', catId)
      .limit(6)
      .offset(offset);
  },

  async countByCatID(catId) {
    const rows = await db('products')
      .where('CatID', catId)
      .count('*', { as: 'total' });

    return rows[0].total;
  },

  add(product) {
    return db('products').insert(product);
  },

  async findById(id) {
    const rows = await db('products').where('ProID', id);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  patch(product) {
    const id = product.ProID;
    delete product.ProID;

    return db('products')
      .where('ProID', id)
      .update(product);
  },

  del(id) {
    return db('products')
      .where('ProID', id)
      .del();
  }
};
