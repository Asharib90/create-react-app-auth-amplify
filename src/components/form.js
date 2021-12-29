
import React, {useEffect,useState} from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';
import styled from 'styled-components';
import blogsLogo from '../assets/star-blogs.png';
import newsLogo from '../assets/star-news.png';
import "react-data-table-component-extensions/dist/index.css";
import backgroundImage from '../assets/WebBg.png';
import { Link } from 'react-router-dom';
import Navigation from "./Navigation/navigation";

function Form() {  

  const [compData, setCompData] = useState([]);
  const [compColumn, setColumn] = useState([]);
  useEffect(() => {
    fetch('https://zlmxumtllh.execute-api.us-east-2.amazonaws.com/devi/form').then(response => response.json())
    .then(data =>{
      
      const tempArray = []
      const tempArray1 = []
      
      data.Items.map(item => (
        Object.keys((item)).map(key => {          
          if(tempArray.find(e=>e.name===key)===undefined){
            tempArray.push({name: key, header: key, minWidth: 50, defaultFlex: 2})
          }
          return null})))
         
          setColumn(tempArray)
          setCompData(data.Items)        
    })
      },[])
    
const gridStyle = { minHeight: 550 };
console.log(compData,compColumn)

return (   
  <MianSection>
  <div className='maincontanier'>

      <Header style={{backgroundImage: `linear-gradient(359deg, #ffffff17 50%, rgb(255 255 255 / 43%) 100%, #ffffffe3 0px),url(${backgroundImage})`}}>
          <div className='Centercontanier'>
              <div className='headersection'>
                  <div className='logo'><img src={newsLogo} alt="logo" className="News"></img></div>
                  <div className='logo'><img src={blogsLogo} alt="logo" className="Blogs"></img></div>
              </div>
          </div>
      </Header>
      <MainContainer>
              <div className='Centercontanier'>
                <div className='viewfrom'>
                <Navigation/>
                <h1 className="heading">Summary</h1>
                  <div className='fromsection'>
                    <br /> <br />

                  <ReactDataGrid
                    idProperty="id"
                    columns={compColumn}
                    dataSource={compData}
                    style={gridStyle}
                    />
     </div>                 
                </div>
                </div>
           </MainContainer>
           </div>

  </MianSection>
  )
};


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
export default Form;


  