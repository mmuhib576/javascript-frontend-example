import React from 'react';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useCookies } from 'react-cookie'

function App() {
  const [cookie,setCookie,removeCookie] = useCookies(['email', 'userid', 'user_name'])
  const user_name = cookie.user_name
  
  return (
    <BrowserRouter>
    <div>
    {/* <Login /> */}
   
    <Routes>
       <Route path="/" element={<Login/>}/>
       
       {user_name && <Route path="/Home" element={<Home/>}/>}
       <Route path="/Signup" element={<Signup/>}/>
   
    </Routes>
   
    </div>
   
    </BrowserRouter>
  );
}

export default App;
