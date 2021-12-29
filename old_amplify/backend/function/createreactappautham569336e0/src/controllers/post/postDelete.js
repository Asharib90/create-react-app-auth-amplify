
const postDelete=(connection)=>(req,res)=>{ 
  
 connection.then(client => {    
    const post = client.db('news').collection('post').deleteOne({_id:req.body.id}).then(results => {
    try {
         
        // res.send(results.deletedCount? "Deleted" :"record not found");
        res.send(results.deletedCount? results.deletedCount+" number of record deleted" :"record not found");
      } catch (error) {
        res.status(500).send(error);
      }
    })
    .catch(error => console.error(error))
    })
}

module.exports={
  postDelete:postDelete
}