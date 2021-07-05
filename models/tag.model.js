const db = require("../utils/db");

module.exports = {
  all() {
    return db("tags");
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
};
