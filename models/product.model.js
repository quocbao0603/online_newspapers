const db = require("../utils/db");

module.exports = {
  all() {
    return db("products");
  },

  // findByCatIDLv1(catId) {
  //   return db('products').where('CatIDLv1', catId);
  // },

  findByCatIDLv1(catId, offset) {
    return db("products").where("CatIDLv1", catId).limit(6).offset(offset);
  },
  findByCatIDLv2(catIdLv1, catIDLv2, offset) {
    return db("products")
      .where({
        CatIDLv1: catIdLv1,
        CatIDLv2: catIDLv2,
      })
      .limit(6)
      .offset(offset);
  },

  async countByCatIDLv1(catId) {
    const rows = await db("products")
      .where("CatIDLv1", catId)
      .count("*", { as: "total" });

    return rows[0].total;
  },
  async countByCatIDLv2(catIdLv1, catIDLv2) {
    const rows = await db("products")
      .where({
        CatIDLv1: catIdLv1,
        CatIDLv2: catIDLv2,
      })
      .count("*", { as: "total" });

    return rows[0].total;
  },

  add(product) {
    return db("products").insert(product);
  },

  async findById(id) {
    const rows = await db("products").where("ProID", id);
    if (rows.length === 0) return null;

    return rows[0];
  },

  patch(product) {
    const id = product.ProID;
    delete product.ProID;

    return db("products").where("ProID", id).update(product);
  },

  del(id) {
    return db("products").where("ProID", id).del();
  },
};
