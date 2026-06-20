import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiLaravel } from '../api';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      if (token) {
        await apiLaravel.post('/logout');
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar flex-between">
      <div className="logo">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--accent-primary)' }}>React</span>Fullstack
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        <Link to="/siswa" className={`nav-link ${isActive('/siswa')}`}>Siswa (Express)</Link>
        <Link to="/posts" className={`nav-link ${isActive('/posts')}`}>Forum (Laravel)</Link>
        
        {token ? (
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
