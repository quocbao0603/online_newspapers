const db = require("../utils/db");

module.exports = {
  all() {
    return db("tags_posts");
  },

  async add(tags, post) {
    if (tags === undefined) return;
    else if (tags.length == 1) {
      const tag_post = {
        TagID: tags,
        PostID: post,
      };
      await db("tags_posts").insert(tag_post);
      return;
    } 
    else {
      tags.forEach(async (tag) => {
        const tag_post = {
          TagID: tag,
          PostID: post,
        };
        console.log(tag_post);
        await db("tags_posts").insert(tag_post);
      });
      return;
    }
  },
  async patch(tags, post) {
    await db("tags_posts").where('PostID', post).del();
    this.add(tags, post);
  },
  del(post){
    return db("tags_posts").where('PostID', post).del();
  }
};
