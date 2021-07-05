const db  = require('../utils/db');
module.exports ={
    topNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","categorieslv1.CatNameLv1","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .orderBy("Date","desc")
    },
    news(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .where("categorieslv2.CatIDLv1",1)
    },
    worldNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .where("categorieslv2.CatIDLv1",3)
    },
    businessNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .where("categorieslv2.CatIDLv1",4)
    },
    perspectivesNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .where("categorieslv2.CatIDLv1",2)
    },
    sciencesNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .where("categorieslv2.CatIDLv1",5)
    },
    sportsNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .where("categorieslv2.CatIDLv1",6)
    },
    
   
   
}
