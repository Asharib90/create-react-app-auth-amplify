const postSingleGet=(connection)=>(req,res)=>{ 
    var query = { '_id' : parseInt(req.params.id) }; 
    connection.then(client => {    
        const post = client.db('news').collection('post').findOne(query).then(results => {
        try {
             console.log(results);
            // res.send(results.deletedCount? "Deleted" :"record not found");
            res.send(results);
          } catch (error) {
            res.status(500).send(error);
          }
        })
        .catch(error => console.error(error))
        })
}


module.exports={
    postSingleGet:postSingleGet
  }