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
  category(){
    return db('chuyenmuccap1');
  },

  allWithDetails() {
    // const sql = `
    //   select c.*, count(p.ProID) as ProductCount
    //   from categories c left join products p on c.CatID = p.CatID
    //   group by c.CatID, c.CatName
    //   `;
    const sql = `
      select  c1.ID as ID ,c2.ID2 as ID2,c1.Name as NameLv1, c2.Name as NameLv2
      from chuyenmuccap1 c1 left join chuyenmuccap2 c2 on c1.ID = c2.ID1
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
