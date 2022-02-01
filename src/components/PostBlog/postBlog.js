import React from "react";
import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import blogsLogo from '../../assets/star-blogs.png';
import newsLogo from '../../assets/star-news.png';
import backgroundImage from '../../assets/WebBg.png';
import draftToHtml from 'draftjs-to-html';
import Amplify,{Storage} from 'aws-amplify';
import Navigation from "../Navigation/navigation";
import {Link} from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ReactTags from 'react-autocomplete-tag' // load ReactTags component
import 'react-autocomplete-tag/dist/index.css' // load default style

import awsconfig from '../../aws-exports';

import Compressor from 'compressorjs';

Amplify.configure(awsconfig);



function PostBlog(){
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


      //Submit Form
      const [success,setSuccess] = React.useState('');
      //get input field value
      const [title, setTitle] = React.useState('');
      const [slug, setSlug] = React.useState('');
      const [link, setLink] = React.useState('');
      const [contentTable, setContentTable]=React.useState('');
      const [excerpt, setExcerpt] = React.useState('');
      const [featuredImage, setFeaturedImage] = React.useState("");
      const [bannerImage, setBannerImage] = React.useState("");
      const [featured, setFeatured] = React.useState('');
      const [category, setCategory] = React.useState('');
      const [author, setAuthor] = React.useState('');
      const [tags, setTags] = React.useState([]);
      const [suggestions, setSuggestions] = React.useState([])
      const[tagListFinal, setTagList] = React.useState([])
      const [follow,setFollow] = React.useState('');
      const [language,setLanguage] = React.useState('');
      //SEO fields
       
      const [seoTitle, setSeoTitle] = React.useState('');
      const [seoDescription, setSeoDescription] = React.useState('');
      const [seoKeywords, setSeoKeywords] = React.useState('');     




      //upload featured Image
      const uploadImage = async(e) => {
        const file = e.target.files[0];
        

        new Compressor(file, {
          quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            // compressedResult has the compressed file.
            // Use the compressed file to upload the images to your server.        
            setFeaturedImage(compressedResult)
            
            try {
                  Storage.put(compressedResult.name, compressedResult, {
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
          },
        });

       
    
      }


      //upload banner Image
      const uploadBannerImage = async(e) => {
        const file = e.target.files[0];

        new Compressor(file, {
          quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            // compressedResult has the compressed file.
            // Use the compressed file to upload the images to your server.        
            setBannerImage(compressedResult)
            try {
              Storage.put(compressedResult.name, compressedResult, {
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
          },
        });

       
     
     
      }
     

  //fetch tags for suggestions
    
  React.useEffect(function effectFunction() {
    async function fetchSuggestions() {
        const response = await fetch('https://newsserverapi.herokuapp.com/tags');
        const json = await response.json();
        setTagList(json);
       
        
    }
    fetchSuggestions();
}, []);

const tagList=tagListFinal.map(d=>
  d.name
)
 const addTag = (val) => {
  setTags([...tags, val])
  setSuggestions([])
}
const removeTag = (idx) => {
  var t = [...tags]
  t.splice(idx, 1)
  setTags(t)
}

const handleTagChange = (val) => {
  // in real app, suggestions could be fetched from backend
  if (val.length > 0) {
    var new_sug = []
    tagList.forEach((t) => {
      if (t.includes(val)) {
        new_sug.push(t)
      }
    })
    setSuggestions(new_sug)
  } else {
    setSuggestions([])
  }
}


      const submitHandler = async e => {
        e.preventDefault();
   
        if(editorState.getCurrentContent().hasText()==false)
        {
          setSuccess('Description is required');
          return false;
        }
       
        
          //featured Image
          const file = featuredImage;
          //banner Images
          const banner =bannerImage; 

         fetch('https://zlmxumtllh.execute-api.us-east-2.amazonaws.com/devi/post',{
         
             method:"Post",
             headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
             body:JSON.stringify({
                "title": title,
                "slug": slug,
                "link": link,
                "contentTable":contentTable,
                "description": convertedContent,
                "excerpt": excerpt,
                "featuredImage": "https://createreactappautham774c4af455b14a6da80642ef720133830-devi.s3.us-east-2.amazonaws.com/public/"+file.name,
                "bannerImage": "https://createreactappautham774c4af455b14a6da80642ef720133830-devi.s3.us-east-2.amazonaws.com/public/"+banner.name,
                "featured": featured,
                "category": category,
                "author": author,
                "tags": tags,
                "follow":follow,
                "timeToRead":time,
                "language":language,
                "seo": {
                  "title": seoTitle,
                  "description": seoDescription,
                  "keywords": seoKeywords
              }
            })
         }).then(response => {
                  console.log(response)
                   if(category=='1')
                   {
                  fetch('https://cors-anywhere.herokuapp.com/https://webhooks.amplify.us-east-2.amazonaws.com/prod/webhooks?id=ebb73ad2-3e61-4a95-836f-9a7f3a0d7e30&token=ZQbqsIiruovmsgA3fOZ3Rq63IoBHryPETJwAtDfotu0',{
                    method:"POST",
                    headers: {
                       'Content-Type': 'application/json',
                       'Origin': 'https://master.dtgguekqbpk7r.amplifyapp.com/'
                     },
                     body:[]
                  }).then(response => {
                    console.log(response)
                  
                  })
                }
                else if(category=='2')
                {
                  fetch('https://cors-anywhere.herokuapp.com/https://webhooks.amplify.us-east-2.amazonaws.com/prod/webhooks?id=7da208b0-b1d4-4c3e-be3e-2ad197e9434b&token=G4FOQ6XB1c3bVVk4cOsXSmCyyCjgyh7cz66Hq0gTfY',{
                    method:"POST",
                    headers: {
                       'Content-Type': 'application/json',
                       'Origin': 'https://master.dtgguekqbpk7r.amplifyapp.com/'
                     },
                     body:[]
                  }).then(response => {
                    console.log(response)
                  
                  })
                }
               
                document.getElementById("blogForm").reset();
                // setLoader(false)
                setSuccess('Your Blog has been successfully posted.');
                setEditorState(EditorState.createEmpty());
                setTags([]);
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
       <h1 style={{textAlign:'center'}}>Post a news/blog</h1>
      
       <form  id="blogForm" method="post" onSubmit={(e)=>submitHandler(e)}>
           <label className="labelClass">Title: <span className="spanClass">*</span></label>
           <input className="inputClass" type="text" name="title" onChange={event => setTitle(event.target.value)} required/>
            <br/>
           <label className="labelClass">Slug: </label>
           <input className="inputClass" type="text" name="slug" placeholder="/example" onChange={event => setSlug(event.target.value)}/>
           <br/>
           <label className="labelClass">Link: </label>
           <input className="inputClass" type="text" name="link" onChange={event => setLink(event.target.value)}/>
           <br/>
           <label className="labelClass">Table of Contents</label>
           <textarea className="inputTextAreaClass" name="content_table" onChange={event => setContentTable(event.target.value)}></textarea>
        
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
          },
          fontFamily: {
            options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana','Noto Nastaliq Urdu'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
          },
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
           <input className="inputClass" type="text" name="excerpt" onChange={event => setExcerpt(event.target.value)} required/>
           <br/>
           <label className="labelClass">Featured Image (360 x 470): <span className="spanClass">*</span></label>
           <input className="inputClass" type="file" name='featuredImage' accept="image/png, image/jpeg" onChange={event => uploadImage(event)} required></input>
         
           <br/>
          
           <label className="labelClass">Banner Image (1600 x 650): <span className="spanClass">*</span></label>
           <input className="inputClass" type="file" name='bannerImage' accept="image/png, image/jpeg" onChange={event => uploadBannerImage(event)}  required></input>
         
           <br/>

           <label className="labelClass">Featured: <span className="spanClass">*</span></label>
          <select className="inputClass" name="featured" onChange={event => setFeatured(event.target.value)}>
           <option value="">-Select Option-</option>   
           <option value="true">Yes</option>
           <option value="false">No</option>
          </select>
          <br/>
          <label className="labelClass">Category: <span className="spanClass">*</span></label>
          <select className="inputClass" name="category" onChange={event => setCategory(event.target.value)} required>
           <option value="">-Select One-</option>
           <option value="1">Star Blogs</option>
           <option value="2">Star News</option>
          </select>
          <br/>
          <label className="labelClass">Author: <span className="spanClass">*</span></label>
          <select className="inputClass" name="author" onChange={event => setAuthor(event.target.value)} required>
           <option value="">-Select One-</option>
           <option value="1">Arif Mustafa</option>
           <option value="2">Aamir Saeeduddin</option>
          </select>

          <br/>
          <label className="labelClass">Tags: </label>
          {/* <input className="inputClass" type="text" name="tags" onChange={event => setTags(event.target.value)}></input> */}
          <ReactTags
      tags={tags}
      suggestions={suggestions}
      onAddHandler={(val) => addTag(val)}
      onDeleteHandler={(idx) => removeTag(idx)}
      onChangeHandler={(val) => handleTagChange(val)}
    />
          <br/>
          <label className="labelClass">Follow: <span className="spanClass">*</span> </label>
          <select className="inputClass" onChange={event => setFollow(event.target.value)} required>
          <option value="">-Select One-</option>
           <option value="Yes">Yes</option>
           <option value="No">No</option>
          </select>
          <br/>
          <label className="labelClass">Language: <span className="spanClass">*</span> </label>
          <select className="inputClass" onChange={event => setLanguage(event.target.value)} required>
          <option value="">-Select One-</option>
           <option value="Eng">Eng</option>
           <option value="Urdu">Urdu</option>
          </select>

          <h2 style={{textAlign:'left'}}>SEO</h2>
          <label className="labelClass">SEO Title: <span className="spanClass">*</span></label>
          <input className="inputClass" type="text" name="seo-title" onChange={event => setSeoTitle(event.target.value)} required></input>
          <label className="labelClass">SEO Description: <span className="spanClass">*</span></label>
          <textarea rows="5" className="inputClass" type="text" name="seo-description" onChange={event => setSeoDescription(event.target.value)} required />
          <label className="labelClass">SEO Keywords: <span className="spanClass">*</span></label>
          <input className="inputClass" type="text" name="seo-description" onChange={event => setSeoKeywords(event.target.value)} required></input>
          <div style={{textAlign:'center'}}>
          <button className="inputSubmitClass">Submit</button>
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


export default PostBlog;