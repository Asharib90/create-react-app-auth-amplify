const { response } = require("express");

const filter = {}
const  postInsert=(connection)=>(req,res)=>{ 
    getValueForNextSequence(connection,"item_id")
    const {title,slug,link,contentTable,description,excerpt,featuredImage,featured,date,category,author,tags,follow, seo}=req.body
    const newDate = new Date();
    
    

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
    follow? filter['follow']=follow : 0
     
    seo?filter['seo']=seo:0
    
    
    

    connection.then(client => {
    const post = client.db('news').collection('post')  

    const quotesCollection = post.insertOne(filter)

   
    .then(results => {
    try {
      // if(req.body.category==1)
      // {
        
      // //   fetch('https://webhooks.amplify.us-east-2.amazonaws.com/prod/webhooks', {
      // //     method: 'POST',
      // //     headers: {
      // //       'Accept': 'application/json',
      // //       'Content-Type': 'application/json',
      // //     },
      // //     body: JSON.stringify({
      // //       id: '052d5733-d21f-4a42-8bcd-21261c279e04',
      // //       token: '3UAXRi5Kfw1Dky3Q1dgBAkRCV6JtNiXM56X8emphtbE',
      // //     })
          
      // //   }).then(response => {
      // //     console.log(response)
      // // })
      // }
      // else
      // {
        
      //   fetch('https://webhooks.amplify.us-east-2.amazonaws.com/prod/webhooks', {
      //     method: 'POST',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       id: 'fcdd9f38-ab8c-407c-814e-1d6ddd132d79',
      //       token: '2aSSHXukua8PZG1nO6Z8ZgQkDcZy0tZesoaWP8011A',
      //     })
          
      //   }).then(response => {
      //     console.log(response)
      // })
      // }
         
        
        res.send(results);
      } catch (error) {
        res.status(500).send(error);
      }
    })
    .catch(error => console.error(error))
    })
}

function getValueForNextSequence(connection,sequenceOfName){

  connection.then(client => {
    const post = client.db('news').collection('postIdSequence')
    post.findOneAndUpdate(
    { "_id": sequenceOfName },     
    {"$inc":{sequence_value:1}})
    .then(results => {      
      filter['_id']=results.value.sequence_value+1
    });    
    })    
 }

module.exports={
  postInsert:postInsert
}