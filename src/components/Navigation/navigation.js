import React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components';

const Navigation = () => {
    return (
        <>
        <Nav>
        <Link to="/add">Add New</Link>
        <Link to="/">View Existing</Link>
        </Nav>
        </>
        );
};


const Nav=styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 50px;
 a {
    border-radius: 6px;
    padding: 12px 40px;
 
    background-color: #f8f8f8;
    color: #000000;
    -webkit-text-decoration: none;
    text-decoration: none;
    border: 1px solid #d9d9d9;
    letter-spacing: 1px;
    font-size: 14px;
 }
`


export default Navigation;