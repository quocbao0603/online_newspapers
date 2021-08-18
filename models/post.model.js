const db = require("../utils/db");
const tagModel = require("../models/tag.model");
const cmtModel = require("../models/comments.model")


const addTag = async function(list) {
    for (let i = 0; i < list.length; i++) {
        const tag = await tagModel.getTagByPostID(list[i].PostID);
        list[i]["tag"] = tag;
    }
    return list;
}
module.exports = {
    async allPost(offset) {

        const sql = `
        select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2, u.name as name_author
        from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 join users u on u.id = p.Author
        AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
        order by p.PostID desc
        LIMIT 6 OFFSET ${offset}
      `;
        const raw_data = await db.raw(sql);
        const list = raw_data[0];
        await addTag(list)
        return list;

        return db("posts");
    },

    async findByCatIDLv1(catId, offset) {
        const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2 
    where p.CatIDLv1 = ${catId} AND p.Status = 1
    order by p.Premium desc , p.PostID desc
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
    where p.CatIDLv1 = ${catIdLv1} AND p.catIDLv2 =  ${catIDLv2} AND p.Status = 1
    order by p.Premium desc , p.PostID desc
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
    where tp.TagID = ${TagID} AND p.Status = 1
    order by p.Premium desc , p.PostID desc
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
    order by p.Premium desc , p.PostID desc
    LIMIT 6 OFFSET ${offset}
    `;
        const raw_data = await db.raw(sql);
        const list = raw_data[0];
        await addTag(list)
        return list;
    },

    async countByAuthor(userID) {
        const sql = `
    select COUNT(*) as total
    from posts
    where Author = ${userID}
    `;
        const raw_data = await db.raw(sql);
        const rows = raw_data[0];
        return rows[0].total;
    },
    async countAllPost() {
        const sql = `
        select count(PostID) as total
        from posts
        `;
        const raw_data = await db.raw(sql);
        const rows = raw_data[0];
        return rows[0].total;
        //return raw_data;
    },
    async countByTagID(TagID) {
        const sql = `
    select COUNT(*) as total
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 join tags_posts tp on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2 AND tp.PostID = p.PostID
    where tp.TagID = ${TagID} AND p.Status = 1
    `;
        const raw_data = await db.raw(sql);
        const rows = raw_data[0];
        return rows[0].total;
    },
    async countByCatIDLv1(catId) {
        const rows = await db("posts")
            .where({
                CatIDLv1: catId,
                Status:  1
            })
            .count("*", { as: "total" });

        return rows[0].total;
    },
    async countByCatIDLv2(catIdLv1, catIDLv2) {
        const rows = await db("posts")
            .where({
                CatIDLv1: catIdLv1,
                CatIDLv2: catIDLv2,
                Status:  1
            })
            .count("*", { as: "total" });

        return rows[0].total;
    },
    async getAuthorByPostID(PostID) {
        const rows = await db("posts")
            .where("PostID", PostID)
            .join("users", { "id": "Author" })

        return rows[0].name;


    },

    getPostByTagID(TagID) {
        return db("tags").where("TagID", TagID);
    },

    add(post) {
        return db("posts").insert(post);
    },

    async findById(id) {
        const rows = await db("posts")
            .where("PostID", id)
            .join("categorieslv2", { "categorieslv2.CatIDLv1": "posts.CatIDLv1", "categorieslv2.CatIDLv2": "posts.CatIDLv2" })
            .join("categorieslv1", { "categorieslv1.CatIDLv1": "posts.CatIDLv1" })
        if (rows.length === 0) return null;
        await addTag(rows)
        return rows[0];
    },
    async searchByText(text, offset) {
        const sql = `
    SELECT p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2 FROM posts p join CategoriesLv1 c1 join CategoriesLv2 c2  on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    WHERE MATCH (p.PostName, p.TinyContent, p.FullContent) AGAINST ( '${text}' IN NATURAL LANGUAGE MODE) AND p.Status = 1
    order by p.Premium desc , p.PostID desc
    LIMIT 6 OFFSET ${offset};
      `;
        const raw_data = await db.raw(sql);
        const list = raw_data[0];
        await addTag(list)
        return list;
    },
    async countSearchByText(text) {
        const sql = `
    SELECT COUNT(*) as total
    FROM posts 
    WHERE MATCH (PostName, TinyContent, FullContent) 
    AGAINST ( '${text}' IN NATURAL LANGUAGE MODE) AND Status = 1
      `;
      const raw_data = await db.raw(sql);
      const rows = raw_data[0];
      return rows[0].total;
    },
    getPostsWaitUp() {
        return db('posts')
            .where("Status", "0")
    },
    updatePostStatusByPostID(postID, postStatus) {
        return db("posts")
            .where("PostID", postID)
            .update({
                Status: postStatus,
            });
    },


    patch(post) {
        const id = post.PostID;
        delete post.PostID;

        return db("posts").where("PostID", id).update(post);
    },
    getViewsPostByPostID(PostID) {
        return db("posts").select("Views").where("PostID", PostID);
    },
    async updateViewsPostByPostID(PostID) {
        const views = await this.getViewsPostByPostID(PostID);
        const updateViews = views[0].Views + 1;
        return db("posts").where("PostID", PostID).update({ Views: updateViews });
    },
    del(id) {
        return db("posts").where("PostID", id).del();
    },
    getCmtsByPostID(PostID) {
        return cmtModel.commentsOfPost(PostID);
    },
    getCmtID() {
        return cmtModel.countAllCmts();
    },
    addNewCmt(newCmt) {
        return cmtModel.addComment(newCmt);
    }
};