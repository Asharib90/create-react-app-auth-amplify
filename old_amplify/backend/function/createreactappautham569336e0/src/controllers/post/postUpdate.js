const postUpdate=(connection)=>(req,res)=>{ 
  
  const {id,title,slug,link,contentTable,description,excerpt,featuredImage,oldFeaturedImage,featured,date,category,author,tags, seo}=req.body
  const newDate = new Date();
   
    const filter = {}
    
    title? filter['title']=title : 0
    slug? filter['slug']=slug : filter['slug']='/'+title.toLowerCase().split(' ').join('-')
    link? filter['link']=null : filter['link']=null
    contentTable? filter['contentTable']=contentTable :0
    description? filter['description']=description : 0
    excerpt? filter['excerpt']=excerpt : 0
    featuredImage? filter['featuredImage']=featuredImage : 0
    featured? filter['featured']=featured : filter['featured']=featured
    date? 0: filter['date'] = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate() 
    category? filter['category']=category : 0
    author? filter['author']=author : 0
    tags? filter['tags']=tags : filter['tags']=tags
    
     
    seo?filter['seo']=seo:0
   
    connection.then(client => {
    const post = client.db('news').collection('post')  

    const quotesCollection = post.updateOne({'_id':parseInt(id)},{$set:filter})
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
  postUpdate:postUpdate
}