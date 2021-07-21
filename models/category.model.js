// const list = [
//   { CatID: 1, CatName: 'Laptop' },
//   { CatID: 2, CatName: 'Phone' },
//   { CatID: 3, CatName: 'Quần áo' },
//   { CatID: 4, CatName: 'Giày dép' },
//   { CatID: 5, CatName: 'Trang sức' },
//   { CatID: 6, CatName: 'Khác' },
// ];

const db = require("../utils/db");

module.exports = {
  allCatLv1() {
    return db("CategoriesLv1");
  },
  categoryLv1() {
    return db("CategoriesLv1");
  },
  async allCatLv2ByCatLv1(id) {
    const rows = await db("CategoriesLv2").where("CatIDLv1", id);
    if (rows.length === 0) return null;

    return rows;
  },

  async findCatLv2ByCatLv1AndCatLv2(idlv1,idlv2) {
    const rows = await db("CategoriesLv2").where("CatIDLv1", idlv1)
    .where("CatIDLv2",idlv2);
    if (rows.length === 0) return null;

    return rows[0];
  },



  allWithDetails() {
    // const sql = `
    //   select c.*, count(p.ProID) as ProductCount
    //   from categories c left join products p on c.CatID = p.CatID
    //   group by c.CatID, c.CatName
    //   `;
    const sql = `
      select  c1.CatIDLv1 as CatIDLv1 ,c2.CatIDLv2 as CatIDLv2,c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
      from CategoriesLv1 c1 left join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1
      `;
    return db.raw(sql);
  },

  add(category) {
    return db("categories").insert(category);
  },

  async findByIdCatLv1(id) {
    const rows = await db("CategoriesLv1").where("CatIDLv1", id);
    if (rows.length === 0) return null;

    return rows[0];
  },

  patch(category) {
    const id = category.CatIDLv1;
    delete category.CatIDLv1;

    return db("CategoriesLv1").where("CatIDLv1", id).update(category);
  },

  del(id) {
    return db("CategoriesLv1").where("CatIDLv1", id).del();
  },
};
