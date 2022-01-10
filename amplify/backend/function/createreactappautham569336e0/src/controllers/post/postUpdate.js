const https = require('https');

const postUpdate=(connection)=>(req,res)=>{ 
  
  const {id,title,slug,link,contentTable,description,excerpt,featuredImage,oldFeaturedImage,featured,date,category,author,tags, follow,timeToRead, seo}=req.body
  const newDate = new Date();
   
    const filter = {}
    
    title? filter['title']=title : 0
    slug? filter['slug']=slug : filter['slug']='/'+title.toLowerCase().split(' ').join('-')
    link? filter['link']=null : filter['link']=null
    contentTable? filter['contentTable']=contentTable :filter['contentTable']=contentTable
    description? filter['description']=description : 0
    excerpt? filter['excerpt']=excerpt : 0
    featuredImage? filter['featuredImage']=featuredImage : 0
    featured? filter['featured']=featured : filter['featured']=featured
    date? 0: filter['date'] = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate() 
    category? filter['category']=category : 0
    author? filter['author']=author : 0
    tags? filter['tags']=tags.toString() : 0
    follow? filter['follow']=follow : 0
    timeToRead? filter['timeToRead']=timeToRead : 0  
    seo?filter['seo']=seo:0
   
    connection.then(client => {
    const post = client.db('news').collection('post')  

     post.updateOne({'_id':parseInt(id)},{$set:filter})
    .then(results => {
       try {
        res.send(results)
        // const options = {
        //   hostname: 'https://webhooks.amplify.us-east-2.amazonaws.com',
        //   path: '/prod/webhooks',
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   params: {
        //     id: '8569b580-4671-4261-b977-17f64cd426e5',
        //     token: 'KmcKRqmGwSpWM8ohDhnk3pTmpFip5HXBx0P3dWY588'
        //   }
        // }
        // https
        // .request(options, res => {
        //   console.log(`statusCode: ${res.statusCode}`)})
         
        
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