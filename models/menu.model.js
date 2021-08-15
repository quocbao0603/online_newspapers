const db  = require('../utils/db');
module.exports ={
    topNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","categorieslv1.CatNameLv1","posts.Premium","posts.Views","posts.TinyContent")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("posts.Status","1")
        .orderBy("Views","desc")
    },
    news(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",1)
        .where("posts.Status","1")
        .limit(10)
    },
    worldNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",3)
        .where("posts.Status","1")
        .limit(10)
    },
    businessNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",4)
        .where("posts.Status","1")
        .limit(10)
    },
    perspectivesNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",2)
        .where("posts.Status","1")
        .limit(10)
    },
    sciencesNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",5)
        .where("posts.Status","1")
        .limit(10)
    },
    sportsNews(){
        return db("posts")
        .select("posts.PostID","posts.CatIDLv1","posts.CatIDLv2","posts.PostName","posts.Date","posts.Avatar","categorieslv2.CatNameLv2","posts.Premium","posts.Views","posts.TinyContent","categorieslv1.CatNameLv1")
        .join("categorieslv2",{"categorieslv2.CatIDLv1":"posts.CatIDLv1","categorieslv2.CatIDLv2":"posts.CatIDLv2"})
        .join("categorieslv1",{"categorieslv1.CatIDLv1":"posts.CatIDLv1"})
        .where("categorieslv2.CatIDLv1",6)
        .where("posts.Status","1")
        .limit(10)
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

    },
    async topNewNews(){
        const news= await this.news().orderBy("Date","desc").first();
        const worldNews = await this.worldNews().orderBy("Date","desc").first();
        const businessNews = await this.businessNews().orderBy("Date","desc").first();
        const perspectivesNews = await this.perspectivesNews().orderBy("Date","desc").first();
        const sciencesNews = await this.sciencesNews().orderBy("Date","desc").first();
        const sportsNews = await this.sportsNews().orderBy("Date","desc").first();
        const topViewsNews = [];
        topViewsNews.push(sportsNews);topViewsNews.push(worldNews);topViewsNews.push(businessNews);
        topViewsNews.push(perspectivesNews);topViewsNews.push(sciencesNews);topViewsNews.push(news);
        return topViewsNews;
    },
    
   
   
}
