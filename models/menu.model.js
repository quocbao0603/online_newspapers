const db  = require('../utils/db');
module.exports ={
    topNews(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2","CatNameLv1")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .join("chuyenmuccap1",{"CatIDLv1":"ID"})
        .orderBy("Date","desc")
    },
    news(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .where("CatIDLv1",1)
    },
    worldNews(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .where("CatIDLv1",3)
    },
    businessNews(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .where("CatIDLv1",4)
    },
    perspectivesNews(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .where("CatIDLv1",2)
    },
    sciencesNews(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .where("CatIDLv1",5)
    },
    sportsNews(){
        return db("posts")
        .select("PostID","CatIDLv1","CatIDLv2","PostName","Date","Avatar","CatNameLv2")
        .join("chuyenmuccap2",{"CatIDLv1":"ID1","CatIDLv2":"ID2"})
        .where("CatIDLv1",6)
    },
    
   
   
}
