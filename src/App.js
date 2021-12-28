import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Amplify from 'aws-amplify';
import './App.css';
import PostBlog from "./components/PostBlog/postBlog";
import ViewBlogs from './components/viewBlogs/viewBlogs';
import BlogSingle from './components/PostBlog/blogSingle';
import Form from './components/form';


function App(props) {
  // Storage.put("test.txt", "Hello");
  return (
    <React.Fragment>
      
 <Router>
  <Routes>
    <Route path="/" element={<ViewBlogs />} />
    <Route path="/add" element={<PostBlog />} />
    <Route path="/view/:id" element={<BlogSingle/>}/>
    <Route path="/form" element={<Form/>}/>
  </Routes>
</Router>
    {/* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    
    </div> */}
   
   
   
    </React.Fragment>
  );
}

export default App;
