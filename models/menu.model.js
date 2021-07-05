const db  = require('../utils/db');
module.exports ={
    topNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","categorieslv1.CatNameLv1","posts.Premium","posts.Views","posts.TinyContent")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("posts.Status","1")
        .orderBy("Date","desc")
    },
    news(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",1)
        .where("posts.Status","1")
    },
    worldNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",3)
        .where("posts.Status","1")
    },
    businessNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",4)
        .where("posts.Status","1")
    },
    perspectivesNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",2)
        .where("posts.Status","1")
    },
    sciencesNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",5)
        .where("posts.Status","1")
    },
    sportsNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",6)
        .where("posts.Status","1")
    },
    async topViewsNews(){
        const news= await this.news().orderBy("Views","desc").first();
        const worldNews = await this.worldNews().orderBy("Views","desc").first();
        const businessNews = await this.businessNews().orderBy("Views","desc").first();
        const perspectivesNews = await this.perspectivesNews().orderBy("Views","desc").first();
        const sciencesNews = await this.sciencesNews().orderBy("Views","desc").first();
        const sportsNews = await this.sportsNews().orderBy("Views","desc").first();
        const topViewsNews = [];
        topViewsNews.push(sportsNews);topViewsNews.push(worldNews);topViewsNews.push(businessNews);
        topViewsNews.push(perspectivesNews);topViewsNews.push(sciencesNews);topViewsNews.push(news);
        return topViewsNews;
    },
    topPopularNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","categorieslv1.CatNameLv1","posts.Premium","posts.Views","posts.TinyContent")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("posts.Status","1")
        .orderBy("Views","desc")
        .limit(6)

    }
   
   
}
