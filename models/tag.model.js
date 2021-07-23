const db = require("../utils/db");

module.exports = {
  all() {
    return db("tags");
  },
  findByTagID(TagID){
    return db("tags")
    .where("TagID",TagID)
    .first();
  },
  add(tag) {
    return db("tags").insert(tag);
  },

  async getTagByPostID(postID) {
    const sql = `
    select  t.TagName, t.TagID
    from posts p join tags_posts tp join tags t on tp.TagID = t.TagID and tp.PostID = p.PostID
    where p.PostID = ${postID}
      `;
    const raw_data = await db.raw(sql);
    return raw_data[0];
  },
  patch(tag) {
    const id = tag.TagID;
    delete tag.TagID;

    return db("tags").where("TagID", id).update(tag);
  },

  del(id) {
    return db("tags").where("TagID", id).del();
  },
};
