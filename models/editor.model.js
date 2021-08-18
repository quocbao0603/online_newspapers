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
    async getPostsManage(CatIDLv1,CatIDLv2,offset){
        const sql = `
    select p.*, c1.CatNameLv1 as CatNameLv1, c2.CatNameLv2 as CatNameLv2
    from posts p join CategoriesLv1 c1 join CategoriesLv2 c2 on c1.CatIDLv1 = c2.CatIDLv1 
    AND c2.CatIDLv1 = p.CatIDLv1 AND c2.CatIDLv2 = p.CatIDLv2
    where p.CatIDLv1 = ${CatIDLv1} AND p.catIDLv2 =  ${CatIDLv2} 
    Order by p.Status Desc, p.PostID Desc
    LIMIT 6 OFFSET ${offset}
    `;
    const raw_data = await db.raw(sql);
    const list = raw_data[0];
    await addTag(list)
    return list;

    },
    async countPostManage(catIDLv1,catIDLv2){
        const rows = await db("posts")
        .where({
            CatIDLv1: catIDLv1,
            CatIDLv2: catIDLv2,
        })
        .count("*", { as: "total" });

    return rows[0].total;
    },





    getCatsManage(UserID){
        return db('editors')
        .where("userID",UserID) 
    },
    checkExistUser(userID){
        return db('editors')
        .where("userID",userID)
        .first()
    },
    add(new_user){
        return db("editors").insert(new_user)
    },
    updateManageCatByUserID(userID,catIDLv1,catIDLv2){
        return db("editors")
            .where("userID", userID)
            .update({
                catIDLv1: catIDLv1,
                CatIDLv2:catIDLv2
            });
    },

    setCatManageByUserID(new_user){
        const ID = new_user.id;
        delete new_user.id;
        return db('editors')
            .where('id', ID)
            .update(new_user)
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
    updatePostAfterCheck(postID,notice,postStatus,premium){
        return db("posts")
        .where("PostID", postID)
        .update({
            Status: postStatus,
            Notice: notice,
            Premium: premium,
        });
    },
    setDatePost(postID,datePost){
        return db("posts")
        .where("PostID", postID)
        .update({
            Date: datePost,
        });
    },
    updateCategories(postID,CatIDLv1,CatIDLv2){
        return db("posts")
        .where("PostID", postID)
        .update({
            CatIDLv1:CatIDLv1,
            CatIDLv2:CatIDLv2
        });
    },
    del(userID) {
        return db("editors").where("userID", userID).del();
    }
}



