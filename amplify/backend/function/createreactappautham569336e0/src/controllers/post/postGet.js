const postGet=(connection)=>(req,res)=>{ 
    const {title,link,description,excerpt,featuredImage,featured,category,author,tags}=req.body
    const filter = {}

    title? filter['title']=title : 0
    link? filter['link']=link : 0
    description? filter['description']=description : 0
    excerpt? filter['excerpt']=excerpt : 0
    featuredImage? filter['featuredImage']=featuredImage : 0
    featured? filter['featured']=featured : 0
    category? filter['category']=category : 0
    author? filter['author']=author : 0
    tags? filter['tags']=tags : 0

    connection.then(client => {
    const post = client.db('news').collection('post')  

    const quotesCollection = post.aggregate([      
        {$lookup:
          {
            from: "category",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }},
          {$lookup:
            {
              from: "author",
              localField: "author",
              foreignField: "_id",
              as: "author"
            }},
            {$unwind: '$author'},
            {$unwind: '$category'},
            {$match :  filter} ]).toArray()
        .then(results => {
          try {
              res.send(results);
            } catch (error) {
              res.status(500).send(error);
            }
          })
          .catch(error => console.error(error))
          })
}

module.exports={
  postGet:postGet
}