const db = require("../utils/db");

module.exports = {
  all() {
    return db("tags_posts");
  },

  add(tags, post) {
    tags.forEach(tag =>{
      tag_post = {
        TagID: tag,
        PostID: post
      };
      db("tags_posts").insert(tag_post);
    });
    return true;
  },
};
