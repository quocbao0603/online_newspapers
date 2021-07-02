const db = require("../utils/db");
const tagModel = require("../models/tag.model");
const cmtModel = require("../models/comments.model")


const addTag = async function(list){
  for (let i = 0; i < list.length; i++) {
    const tag = await tagModel.getTagByPostID(list[i].PostID);
    list[i]["tag"] = tag;
  }
  return list;
}
module.exports = {
  all() {},

  // findByCatIDLv1(catId) {
  //   return db('posts').where('CatIDLv1', catId);
  // },

  async findByCatIDLv1(catId, offset) {
    const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    where p.CatIDLv1 = ${catId}
    LIMIT 6 OFFSET ${offset}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;
  },
  async findByCatIDLv2(catIdLv1, catIDLv2, offset) {
    const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    where p.CatIDLv1 = ${catIdLv1} AND p.catIDLv2 =  ${catIDLv2}
    LIMIT 6 OFFSET ${offset}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;
  },
  async findByTagID(TagID, offset) {
    const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 join tags_posts tp on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2 AND tp.PostID = p.PostID
    where tp.TagID = ${TagID}
    LIMIT 6 OFFSET ${offset}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;
  },
  async findByAuthor(userID, offset) {
    const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    where p.Author = ${userID}
    LIMIT 6 OFFSET ${offset}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;
  },

  async countByAuthor(userID) {
    const sql = `
    select COUNT(*)
    from posts
    where Author = ${userID}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    return list;
  },
  async countByTagID(TagID) {
    const sql = `
    select COUNT(*)
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 join tags_posts tp on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2 AND tp.PostID = p.PostID
    where tp.TagID = ${TagID}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    return list;
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

  getPostByTagID(TagID) {
    return db("tags").where("TagID", TagID);
  },

  add(post) {
    return db("posts").insert(post);
  },

  async findById(id) {
    const rows = await db("posts").where("PostID", id);
    if (rows.length === 0) return null;

    return rows[0];
  },
  async searchByText(text, offset) {
    const sql = `
    SELECT p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2 FROM posts p join CategoriesLv1 c1 join CategoriesLv2 c2  on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    WHERE MATCH (p.PostName, p.TinyContent, p.FullContent) 
    AGAINST ( '${text}' IN NATURAL LANGUAGE MODE) LIMIT 6 OFFSET ${offset};
      `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;
  },
  countSearchByText(text) {
    const sql = `
    SELECT COUNT(*) FROM posts 
    WHERE MATCH (PostName, TinyContent, FullContent) 
    AGAINST ( '${text}' IN NATURAL LANGUAGE MODE);
      `;
    return db.raw(sql);
  },
  patch(post) {
    const id = post.PostID;
    delete post.PostID;

    return db("posts").where("PostID", id).update(post);
  },

  del(id) {
    return db("posts").where("PostID", id).del();
  },
  getCmtsByPostID(PostID){
    return cmtModel.commentsOfPost(PostID);
  },
  getCmtID(){
    return cmtModel.countAllCmts();
  },
  addNewCmt(newCmt){
    return cmtModel.addComment(newCmt);
  }
};
