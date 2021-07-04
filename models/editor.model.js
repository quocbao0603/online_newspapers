const db = require('../utils/db')
const postModel = require('../models/post.model')
const tagModel = require('../models/tag.model')
const addTag = async function(list){
    for (let i = 0; i < list.length; i++) {
      const tag = await tagModel.getTagByPostID(list[i].PostID);
      list[i]["tag"] = tag;
    }
    return list;
}
module.exports ={
    async getPostsManage(CatIDLv1,CatIDLv2){
        const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    where p.CatIDLv1 = ${CatIDLv1} AND p.catIDLv2 =  ${CatIDLv2} AND p.Status = 3
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;

    },
    getCatsManage(UserID){
        return db('editors')
        .where("userID",UserID) 
    },
    updateCmtsPostRefuse(postID,notice){
        return db("posts")
        .where("PostID", postID)
        .update({
            Notice: notice,
        });
    },
    updatePostStatusByPostID(postID,postStatus){
        return db("posts")
        .where("PostID", postID)
        .update({
            Status: postStatus,
        });
    },
    updatePostAfterCheck(postID,notice,postStatus){
        return db("posts")
        .where("PostID", postID)
        .update({
            Status: postStatus,
            Notice: notice,
        });
    }
}



