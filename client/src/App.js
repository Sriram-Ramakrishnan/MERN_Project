import './App.css';
import React,{ Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

 const App = () =>
 <Router>
    <Navbar/>
      <Routes>
        <Route exact path="/" element={<Landing/>} />
      </Routes>
      <section className='container'>
        <Routes>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/register" element={<Register/>} />
        </Routes>
      </section>
    </Router>
;

export default App;
