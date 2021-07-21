const db = require('../utils/db')

module.exports  ={
    commentsOfPost(PostID) {
        return db("comments")
        .select("users.name","Content","comments.Date")
        .join("users",{"id":"UserID"})
        .where("PostsID",PostID)
    },
    addComment(newCmt){
        return db("comments").insert(newCmt);
    },
    async countAllCmts(){
    const rows = await db("comments")
        .count("*", { as: "total" });

    return rows[0].total;
    },
    async countCmtsByPostID(postID){
        const rows = await db("comments")
            .where("PostsID",postID)
            .count("*", { as: "total" });
    
        return rows[0].total;
    }
}