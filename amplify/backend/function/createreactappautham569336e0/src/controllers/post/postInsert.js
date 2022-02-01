const { response } = require("express");
const axios = require('axios');
const https = require('https');
const querystring = require('querystring');

const filter = {}
const  postInsert=(connection)=>(req,res)=>{ 
        
//   const newDate = new Date();
//   const monthNames = ["January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

//   console.log((monthNames[newDate.getMonth()])+' '+newDate.getDate()+','+newDate.getFullYear());
    getValueForNextSequence(connection,"item_id")
    const {title,slug,link,contentTable,description,excerpt,featuredImage,bannerImage,featured,date,category,author,tags,follow,language,timeToRead, seo}=req.body
    const newDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    const views=0;
    

    title? filter['title']=title : 0
    slug? filter['slug']=slug : filter['slug']='/'+title.toLowerCase().split(' ').join('-')
    link? filter['link']=null : filter['link']=null
    contentTable? filter['contentTable']=contentTable :0
    description? filter['description']=description : 0
    excerpt? filter['excerpt']=excerpt : 0
    featuredImage? filter['featuredImage']=featuredImage : 0
    bannerImage? filter['bannerImage']=bannerImage : 0
    featured? filter['featured']=featured : filter['featured']=featured
    date? 0: filter['date'] = (monthNames[newDate.getMonth()])+' '+newDate.getDate()+', '+newDate.getFullYear() 
    category? filter['category']=category : 0
    author? filter['author']=author : 0
    tags? filter['tags']=tags.toString() : 0
    follow? filter['follow']=follow : 0
    language? filter['language']=language : 0
    timeToRead? filter['timeToRead']=timeToRead : 0 
    seo?filter['seo']=seo:0
    views? 0: filter['views']=views
    
    

    connection.then(client => {
    const post = client.db('news').collection('post')  

    const quotesCollection = post.insertOne(filter)

   
    .then(results => {
    try {
      if(req.body.category==1)
      {
        axios
  .post('https://webhooks.amplify.us-east-2.amazonaws.com/prod/webhooks',
   {
    id: 'b8bb08f8-ed88-4b0b-aea7-91d73e7c6fb7',
    token: 'vGBI8XcK5Z8MGLu8TPb8017laqqzYKp0A35ELgkdFc'
  }
  )
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  
  })
     
      }
    else
      {
        axios
        .post('https://webhooks.amplify.us-east-2.amazonaws.com/prod/webhooks',
         {
          id: 'fcdd9f38-ab8c-407c-814e-1d6ddd132d79',
          token: '2aSSHXukua8PZG1nO6Z8ZgQkDcZy0tZesoaWP8011A'
        }
        )
        .then(res => {
          console.log(`statusCode: ${res.status}`)
          console.log(res)
        })
        .catch(error => {
          console.error(error)
        
        })
           
    
      }
         
        
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