const viewsUpdate=(connection)=>(req,res)=>{ 
   const id = req.params.id
   
   connection.then(client => {
    const post = client.db('news').collection('post')  
    const Oldview=post.findOne(
        {
           '_id': parseInt(id),
          
        },
        function(err,doc) {
           if (err) throw err;
           const newViews=doc.views+1
           //console.log( (doc.views)+1); 
           var newvalues = { $set: {views: newViews} }
            const quotesCollection = post.updateOne({'_id':parseInt(id)},newvalues)
    .then(results => {
    try {
        res.send(newvalues);
      } catch (error) {
        res.status(500).send(error);
      }
    })
    .catch(error => console.error(error)) 
        }
     )
   
   
     })


}


module.exports={
    viewsUpdate:viewsUpdate
  }