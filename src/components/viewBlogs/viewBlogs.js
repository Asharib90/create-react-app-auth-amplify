import React from 'react';
import styled from 'styled-components';
import blogsLogo from '../../assets/star-blogs.png';
import newsLogo from '../../assets/star-news.png';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import backgroundImage from '../../assets/WebBg.png';
import { Link } from 'react-router-dom';
import Navigation from "../Navigation/navigation";
import awsconfig from '../../aws-exports';
import Amplify, { API } from 'aws-amplify';


Amplify.configure(awsconfig);

function ViewBlogs() {
    const [posts, updatePosts] = React.useState([]);
    const [success,setSuccess] = React.useState('');

    React.useEffect(function effectFunction() {
        async function fetchPosts() {
            const response = await fetch('https://newsserverapi.herokuapp.com/post');
            const json = await response.json();
            //console.log(json);
            updatePosts(json);

        }
        fetchPosts();
    }, []);

    const deletePost = async (e,index) => {
        
       //working needs to be done
       
        const response = await fetch('https://zlmxumtllh.execute-api.us-east-2.amazonaws.com/devi/post', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                id: e
            })
        }).then(response => {
         
         // document.getElementById("blogForm").reset();
          // setLoader(false)
         setSuccess('Record has been successfully deleted');
         const dataCopy = [...posts];
         dataCopy.splice(index, 1);
         updatePosts(dataCopy);
       
          //setEditorState(EditorState.createEmpty());
        });
    }


    const columns = [
        {
            name: <h3>Sno</h3>,
            selector: row => row.sno,
            width:'80px'
        },       
        {
            name: <h3>Title</h3>,
            selector: row => row.title,
            width:'56%'
         
        },
        {
            name: <h3>Category</h3>,
            selector: row => row.category,
            width:'190px'
        },
        {
            name: <h3>Actions</h3>,
            width:'250px',
            cell: (s) => (
                
                <>
                   <Link className="btn btn-info edit"  to={'/view/'+s.post_id}><svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.241 3.83a1 1 0 0 1-.07 1.412L6.866 14.565 6.387 16h1.226l10.714-9.74a1 1 0 0 1 1.346 1.48l-11 10A1 1 0 0 1 8 18H5a1 1 0 0 1-.949-1.316l1-3a1 1 0 0 1 .278-.426l10.5-9.5a1 1 0 0 1 1.412.071zM4 21a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.793 3.793a1 1 0 0 1 1.414 0l2.5 2.5a1 1 0 0 1-1.414 1.414l-2.5-2.5a1 1 0 0 1 0-1.414zM15.293 9.707l-2.5-2.5 1.414-1.414 2.5 2.5-1.414 1.414z" fill="#000"/></svg>Edit</Link>
                   {/* {if(window.confirm('Are you sure to delete this record?')){ this.deleteHandler(item.id)};}} */}
                    <button className='delete' raised primary onClick={(e,index) => {if(window.confirm('Are you sure to delete this record?'))deletePost(s.post_id,s.sno)}}><svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 7a1 1 0 0 1 1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 1 1 2 0v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a1 1 0 0 1 1-1z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10 8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zM14 8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zM4 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM8 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z" fill="#000"/></svg>Delete</button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const data = posts.map((p, index) => ({

        "sno": index,
        "post_id": p._id,
        "title": p.title,
        "category": p.category.name,
    }));

    const tableData = {
        columns,
        data
      };

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
                <div className='viewfrom'>
                <Navigation/>
                {success ? <div id="success"> {success}</div> : ''}
              
                  <h1 className="heading">View News and Blogs</h1>
                  <div className='fromsection'>
                  <DataTableExtensions {...tableData}>
               
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    defaultSortAsc={false}
                    highlightOnHover
                 />
             
                 </DataTableExtensions>
                 </div> 
                
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
.viewfrom h1.heading {
    padding: 31px 33px 0px;
}

.fromsection .data-table-extensions {
    width: 28% !important;
    float: right;
    margin-bottom: 19px;
}

.fromsection .data-table-extensions .data-table-extensions-filter {
    width: 100%;
}
#success {
    text-align: center;
    right: 0;
    top: 0;
    background: #e1ede0;
    color: #028b18;
    padding: 12px 21px;
    border-radius: 38px;
    border: 1px solid #028b18;
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

const MainContainer = styled.div`
border-radius: 5px;
background-color: #f8f8f8;
padding-left:50px;
padding-right:50px;

font-family: 'Poppins',sans-serif;

.data-table-extensions-action{
    display:none !important;
}
.data-table-extensions {
    display: inline-block;
    width: 50% !important;
    box-sizing: border-box;
    padding: 0px !important;
}

.data-table-extensions-filter{
    border: 1px solid #cfcccf;
    float: right !important;
    width: 50%;
    position: relative;
   
}
.data-table-extensions > .data-table-extensions-filter > .icon {
    float: left;
    display: block;
    width: 20px;
    height: 24px;
    background-image: url(data:xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m28.34 24.12-6.5-6.85A10.49 10.49 0 1 0 12.5 23h.55a1 1 0 1 0-.1-2 8.5 8.5 0 1 1 5.4-2.32A8.72 8.72 0 0 1 16.53 20a1 1 0 0 0-.41 1.35.89.89 0 0 0 .36.36v.08l6.77 7.13A3.48 3.48 0 0 0 25.73 30h.09a3.43 3.43 0 0 0 2.39-1 3.47 3.47 0 0 0 .13-4.88zm-1.5 3.47a1.45 1.45 0 0 1-1.06.41 1.51 1.51 0 0 1-1-.46l-6.15-6.49a10.07 10.07 0 0 0 1.14-.93 10.54 10.54 0 0 0 1-1.12l6.16 6.5a1.47 1.47 0 0 1-.09 2.09z"/><path d="M8.55 8.16a1 1 0 0 0-1.39.29 7.19 7.19 0 0 0 1.17 9.29A1 1 0 0 0 9 18a1 1 0 0 0 .67-1.74A5.32 5.32 0 0 1 8 12.91a5.24 5.24 0 0 1 .84-3.36 1 1 0 0 0-.29-1.39z"==);
    background-repeat: no-repeat;
    background-position: left center;
    position: absolute;
    right: 14px;
    top: 8px;
}
.data-table-extensions > .data-table-extensions-filter > .filter-text {
    border: 0;
    border-right: 1px solid #e9dfdf;
    outline: none;
    padding: 12px 20px;
    font-size: 15px;
    letter-spacing: 1px;
    width: 74%;
}
.viewfrom {
    background: #fff;
    padding: 50px 50px;
}
.heading{
    font-size: 29px;
    font-weight: 500;
    text-transform: uppercase;
    -webkit-letter-spacing: 2px;
    -moz-letter-spacing: 2px;
    -ms-letter-spacing: 2px;
    letter-spacing: 2px;
    color: #363636;
    padding: 0px 0px;
    font-family: -webkit-pictograph;
    width: 50%;
    float: left;
    margin: 0;
    line-height: 43px;
}


.fromsection {
    background: #f8f8f8;
    padding: 30px 30px;
    margin-top: 20px;
}
a.btn.btn-info.edit {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3%;
    text-decoration: none;
    font-size: 14px;
    color: #000;
}

button.delete {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3%;
    text-decoration: none;
    font-size: 14px;
    color: #000;
    background: none;
    border: 0px;
    cursor:pointer;
}


a.btn.btn-info.edit svg path {fill: #55a900;}


button.delete svg path {
    fill: #e42528;
}

`

export default ViewBlogs