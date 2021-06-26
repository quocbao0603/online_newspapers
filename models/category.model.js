// const list = [
//   { CatID: 1, CatName: 'Laptop' },
//   { CatID: 2, CatName: 'Phone' },
//   { CatID: 3, CatName: 'Quần áo' },
//   { CatID: 4, CatName: 'Giày dép' },
//   { CatID: 5, CatName: 'Trang sức' },
//   { CatID: 6, CatName: 'Khác' },
// ];

const db = require('../utils/db');

module.exports = {
  all() {
    return db('categories');
  },

  allWithDetails() {
    const sql = `
      select c.*, count(p.ProID) as ProductCount
      from categories c left join products p on c.CatID = p.CatID
      group by c.CatID, c.CatName
      `;
    return db.raw(sql);
  },

  add(category) {
    return db('categories').insert(category);
  },

  async findById(id) {
    const rows = await db('categories').where('CatID', id);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  patch(category) {
    const id = category.CatID;
    delete category.CatID;

    return db('categories')
      .where('CatID', id)
      .update(category);
  },

  del(id) {
    return db('categories')
      .where('CatID', id)
      .del();
  }
};
