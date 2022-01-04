import React from "react";
import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw,ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import blogsLogo from '../../assets/star-blogs.png';
import newsLogo from '../../assets/star-news.png';
import backgroundImage from '../../assets/WebBg.png';
import draftToHtml from 'draftjs-to-html';
import Amplify,{Storage} from 'aws-amplify';
import { useParams } from 'react-router';
import Navigation from "../Navigation/navigation";
import {Link} from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import awsconfig from '../../aws-exports';


Amplify.configure(awsconfig);


function BlogSingle(props){
  let { id } = useParams();
  
 
//upload images inside editor
  function uploadImageCallBack(file){
    return new Promise(
      (resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open('POST','https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization','Client-ID 4be41ea50eda5be');
        const data= new FormData();
        data.append('image',file);
        xhr.send(data);
        xhr.addEventListener('load',()=>{
          const response=JSON.parse(xhr.responseText);
          console.log(response)
          resolve(response);
        });
        xhr.addEventListener('error',()=>{
          const error = JSON.parse(xhr.responseText);
          console.log(error)
        })
      }
    )
  }


   //display selected image
          
   const [image, setImage] = React.useState(null)

   const onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      const file = event.target.files[0];
      setFeaturedImage(event.target.files[0]);
      try {
        await Storage.put(file.name, file, {
        //contentType: "image/png", // contentType is optional
        resumable: true,
        completeCallback: (event) => {
            console.log(`Successfully uploaded ${event.key}`);
        },
        progressCallback: (progress) => {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
        errorCallback: (err) => {
            console.error('Unexpected error while uploading', err);
        }
      });
       } catch (error) {
      console.log("Error uploading file: ", error);
    }
    }
   }
   

  




      //Submit Form
      const [success,setSuccess] = React.useState('');


      //get input field value
      const [title, setTitle] = React.useState();
      const [slug, setSlug] = React.useState('');
      const [link, setLink] = React.useState('');
      const [contentTable, setContentTable]=React.useState('');
      const [excerpt, setExcerpt] = React.useState('');
      const [featuredImage, setFeaturedImage] = React.useState("");
      const [oldFeaturedImage, setOldFeaturedImage] = React.useState("");
      const [featured, setFeatured] = React.useState('');
      const [category, setCategory] = React.useState('');
      const [author, setAuthor] = React.useState('');
      const [tags, setTags] = React.useState('');
      const [follow,setFollow] = React.useState('');
      //SEO fields
       
      const [seoTitle, setSeoTitle] = React.useState('');
      const [seoDescription, setSeoDescription] = React.useState('');
      const [seoKeywords, setSeoKeywords] = React.useState('');
  

      

    
    
       
      
       const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
      );

      const  [convertedContent, setConvertedContent] = React.useState(null);
      const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();    
      }
      const convertContentToHTML = () => {
        let currentContentAsHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setConvertedContent(currentContentAsHTML);
      }
      
      

        //calculate time to read
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    
    const [time, setTime] = React.useState(0);
    React.useEffect(() => {
    const text = value;
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    setTime(time)
    
});




       const [posts, updatePosts] = React.useState([]);
      
       React.useEffect(function effectFunction() {
         async function fetchPosts() {
             const response = await fetch(`https://zlmxumtllh.execute-api.us-east-2.amazonaws.com/devi/post/${id}`);
             const json = await response.json();
             
             //set data
             setTitle(json.title)
             setSlug(json.slug)
             setLink(json.link)
             setContentTable(json.contentTable)
             setExcerpt(json.excerpt)
             setFeatured(json.featured)
             setOldFeaturedImage(json.featuredImage)
             setImage(json.featuredImage)
             setCategory(json.category)
             setAuthor(json.author)
             setTags(json.tags)
             setFollow(json.follow)
             setSeoTitle(json.seo.title)
             setSeoDescription(json.seo.description)
             setSeoKeywords(json.seo.keywords)
             setConvertedContent(json.description)
             setEditorState(EditorState.createWithContent(
                  ContentState.createFromBlockArray(
                    convertFromHTML(json.description)
                  )))
             updatePosts(json);

            
             
         }
         fetchPosts();
       
       }, []);
    
      

       
      
       const submitHandler = e => {
        e.preventDefault();
        
        
       
   
        if(editorState.getCurrentContent().hasText()==false)
        {
          setSuccess('Description is required');
          return false;
        }

         const file = featuredImage;
        
        try {
         
             Storage.put(file.name, file, {
            //contentType: "image/png", // contentType is optional
            
          });
          console.log('Success');
        } catch (error) {
          console.log("Error uploading file: ", error);
        }
          //get FeaturedImage
          var FeaturedImage=''
          if(file=='')
          {
            FeaturedImage=oldFeaturedImage
          }  
          else
          {
            FeaturedImage="https://createreactappautham774c4af455b14a6da80642ef720133830-devi.s3.us-east-2.amazonaws.com/public/"+file.name
          }
         fetch('https://zlmxumtllh.execute-api.us-east-2.amazonaws.com/devi/post',{
          
             method:"PUT",
             headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
             body:JSON.stringify({
                "id": id,
                "title": title,
                "slug": slug,
                "link": link,
                "contentTable":contentTable,
                "description": convertedContent,
                "excerpt": excerpt,
                // "featuredImage": "https://starnewsformbbd4e22507e44405a64778be964267bd130756-dev.s3.us-east-2.amazonaws.com/public/"+file.name,
                "featuredImage": FeaturedImage,
                "oldFeaturedImage": oldFeaturedImage,
                "featured": featured,
                "category": category,
                "author": author,
                "tags": tags,
                "follow":follow,
                "timeToRead":time,
                "seo": {
                  "title": seoTitle,
                  "description": seoDescription,
                  "keywords": seoKeywords
              }
            })
         }).then(response => {
                  console.log(response)
               
               // document.getElementById("blogForm").reset();
                // setLoader(false)
                setSuccess('Your Blog has been successfully updated.');
                
                //setEditorState(EditorState.createEmpty());
              })
        
       }
       
       
      
        
     

      
  
      
    return (

      <MianSection>
      <div className='maincontanier'>
          
  
         
          
      
      <Header style={{backgroundImage: `linear-gradient(359deg, #ffffff17 50%, rgb(255 255 255 / 43%) 100%, #ffffffe3 0px),url(${backgroundImage})`}}>
                <div className='Centercontanier'>
                    <div className='headersection'>
                    <Link to="/"> <div className='logo'><img src={newsLogo} alt="logo" className="News"></img></div></Link>
                       <Link to="/">  <div className='logo'><img src={blogsLogo} alt="logo" className="Blogs"></img></div></Link>
                    </div>
                </div>
            </Header>
           
       <MainContainer> 
      
       <div className='Centercontanier'>
         <div className="viewform">
       <Navigation/>
       <h1 style={{textAlign:'center'}}>Edit News/Blog</h1>
      
       <form  id="blogForm" method="post" onSubmit={(e)=>submitHandler(e)}>
           <label className="labelClass">Title: <span className="spanClass">*</span></label>
           <input className="inputClass" type="text" name="title" value={title} onChange={event => setTitle(event.target.value)} required/>
            <br/>
           <label className="labelClass">Slug: </label>
           <input className="inputClass" type="text" name="slug" placeholder="/example" value={slug} onChange={event => setSlug(event.target.value)}/>
           <br/>
           <label className="labelClass">Link: </label>
           <input className="inputClass" type="text" name="link" value={link} onChange={event => setLink(event.target.value)}/>
           <br/>
           <label className="labelClass">Table of Contents</label>
           <textarea className="inputTextAreaClass" name="content_table" onChange={event => setContentTable(event.target.value)} value={contentTable}></textarea>
        
           <br/>
           <label>Description: <span className="spanClass">*</span></label>
           <Tabs>
             <br/>
    <TabList>
      <Tab>Visual</Tab>
      <Tab>Html</Tab>
    </TabList>

    <TabPanel>
    <EditorStyles>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          image: {
            uploadCallback: uploadImageCallBack,
            alt: {present:true,mandatory: false},
          }
        }}
       
      />
     </EditorStyles>
    </TabPanel>
    <TabPanel>
    <textarea className="inputTextAreaClass" onChange={event => setConvertedContent(event.target.value)} value={convertedContent}></textarea>
    </TabPanel>
  </Tabs>
         
    
   

           <br/>
           <label className="labelClass">Excerpt: <span className="spanClass">*</span></label>
           <input className="inputClass" type="text" name="excerpt" value={excerpt} onChange={event => setExcerpt(event.target.value)} required/>
           <br/>  <br/>
           <label className="labelClass">Featured Image: <span className="spanClass">*</span></label>
         <br/>
           {/* <img className="featured-image" src={posts.featuredImage} alt="Featured-Image"></img> */}
         
           <img src={image} alt="Featured-Image" className="featured-image"/>
           <input type="file" onChange={onImageChange} className="inputClass" accept="image/png, image/jpeg" />
           {/* <input className="inputClass" type="file" name='featuredImage' accept="image/png, image/jpeg" onChange={event => setFeaturedImage(event.target.files[0])}></input> */}
           
           <br/>
           <label className="labelClass">Featured: <span className="spanClass">*</span></label>
          <select className="inputClass" name="featured" onChange={event => setFeatured(event.target.value)}>
          {featured == 'true'?  <option value={featured}>Yes</option>: <option value={featured}>No</option> }
           <option value="true">Yes</option>
           <option value="false">No</option>
          </select>
          <br/>
          <label className="labelClass">Category: <span className="spanClass">*</span></label>
          <select className="inputClass" name="category" onChange={event => setCategory(event.target.value)} required>
          {category == '1'? <option value={category}>Star Blogs</option>: 
         <option value={category}>Star News</option> }
           <option value="1">Star Blogs</option>
           <option value="2">Star News</option>
          </select>
        
          <br/>
          <label className="labelClass">Author: <span className="spanClass">*</span></label>
          <select className="inputClass" name="author" onChange={event => setAuthor(event.target.value)} required>
            {author == '1'?  <option value={author}>Arif Mustafa</option>: <option value={author}>Aamir Saeeduddin</option> }
           <option value="1">Arif Mustafa</option>
           <option value="2">Aamir Saeeduddin</option>
          </select>

          <br/>
          <label className="labelClass">Tags: </label>
          <input className="inputClass" type="text" value={tags} name="tags" onChange={event => setTags(event.target.value)} required></input>
          <br/>
          <label className="labelClass">Follow: <span className="spanClass">*</span> </label>
          <select className="inputClass" onChange={event => setFollow(event.target.value)} required>
          {follow == 'Yes'?  <option value={follow}>Yes</option>: <option value={follow}>No</option> }
           <option value="Yes">Yes</option>
           <option value="No">No</option>
          </select>
         
          <h2 style={{textAlign:'left'}}>SEO</h2>
          <label className="labelClass">SEO Title: <span className="spanClass">*</span></label>
          <input className="inputClass" type="text" value={seoTitle} name="seo-title" onChange={event => setSeoTitle(event.target.value)} required></input>
          <label className="labelClass">SEO Description: <span className="spanClass">*</span></label>
          <textarea rows="5" className="inputClass" type="text" value={seoDescription} name="seo-description" onChange={event => setSeoDescription(event.target.value)} required />
          <label className="labelClass">SEO Keywords: <span className="spanClass">*</span></label>
          <input className="inputClass" type="text" name="seo-description" value={seoKeywords} onChange={event => setSeoKeywords(event.target.value)} required></input>
          <div style={{textAlign:'center'}}>
          <button className="inputSubmitClass">Update</button>
          </div>
          <br/>
        {success}
        <br/><br/>
       </form>
       </div>
       </div>
       </MainContainer>
     
       </div>
       </MianSection>
    )
      
}


const MianSection = styled.div`
.Centercontanier {
    box-sizing: border-box;
    margin: 0;
    min-width: 0;
    width: 100%;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    position: relative;
    z-index: 10;
}




`


const MainContainer = styled.div`

border-radius: 5px;
background-color: #f8f8f8;
padding-left:50px;
padding-right:50px;

font-family: 'Poppins',sans-serif;

.labelClass{
    color:#333;
    
}

.spanClass{
    color:red;
  fontSize:16px;
}

.inputClass{
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.inputTextAreaClass{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  height: 200px;
}

.inputSubmitClass{
    width: 30%;
  background-color: #ff000a;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.viewform {
  background: #fff;
  padding: 50px 50px;
}

.featured-image{
  height:200px;
  width:300px;
}

`

const EditorStyles=styled.div`
.wrapper-class {
margin-top:10px;    
padding: 1rem;
border: 1px solid #ccc;
width:98%;

}
.editor-class {
color: #333;
padding: 1rem;
border: 1px solid #ccc;
height: 300px;


}
.toolbar-class {
border: 1px solid #ccc;
color: #333;
}
`

const Header = styled.div`
background-size: contain;
.logo img {
    width: 180px;
}
.headersection{
    display: flex;
    justify-content: space-between;
    align-items: center;


}


`



export default BlogSingle;