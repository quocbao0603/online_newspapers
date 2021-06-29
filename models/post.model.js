const db = require("../utils/db");

module.exports = {
  all() {
    return db("posts");
  },

  // findByCatIDLv1(catId) {
  //   return db('posts').where('CatIDLv1', catId);
  // },

  findByCatIDLv1(catId, offset) {
    return db("posts").where("CatIDLv1", catId).limit(6).offset(offset);
  },
  findByCatIDLv2(catIdLv1, catIDLv2, offset) {
    return db("posts")
      .where({
        CatIDLv1: catIdLv1,
        CatIDLv2: catIDLv2,
      })
      .limit(6)
      .offset(offset);
  },

  async countByCatIDLv1(catId) {
    const rows = await db("posts")
      .where("CatIDLv1", catId)
      .count("*", { as: "total" });

    return rows[0].total;
  },
  async countByCatIDLv2(catIdLv1, catIDLv2) {
    const rows = await db("posts")
      .where({
        CatIDLv1: catIdLv1,
        CatIDLv2: catIDLv2,
      })
      .count("*", { as: "total" });

    return rows[0].total;
  },

  add(post) {
    return db("posts").insert(post);
  },

  async findById(id) {
    const rows = await db("posts").where("PostID", id);
    if (rows.length === 0) return null;

    return rows[0];
  },

  patch(post) {
    const id = post.PostID;
    delete post.PostID;

    return db("posts").where("PostID", id).update(post);
  },

  del(id) {
    return db("posts").where("PostID", id).del();
  },
};
