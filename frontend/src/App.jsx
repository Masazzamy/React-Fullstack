import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Siswa from './pages/Siswa';
import Posts from './pages/Posts';
import Auth from './pages/Auth';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  return (
    <Router>
      <div className="app-container">
        <Navbar token={token} setToken={setToken} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/siswa" element={<Siswa />} />
            <Route path="/posts" element={<Posts token={token} />} />
            <Route 
              path="/login" 
              element={token ? <Navigate to="/posts" /> : <Auth setToken={setToken} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
