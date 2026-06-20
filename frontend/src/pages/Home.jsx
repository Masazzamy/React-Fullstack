import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container animate-fade-in">
      <section className="hero-section">
        <h1 className="hero-title">Modern Fullstack Architecture</h1>
        <p className="hero-subtitle">
          An elegant React single-page application consuming both a Laravel Sanctum REST API and an Express.js MySQL CRUD API simultaneously.
        </p>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <Link to="/siswa" className="btn btn-primary">
            Explore Express API
          </Link>
          <Link to="/posts" className="btn btn-outline">
            Explore Laravel API
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        <div className="glass-panel feature-card">
          <div className="feature-icon">⚡</div>
          <h3>React + Vite</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Blazing fast frontend scaffolding with modern tools and elegant Vanilla CSS.</p>
        </div>
        <div className="glass-panel feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Laravel Sanctum</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Secure token-based authentication and authorization policies for RESTful API.</p>
        </div>
        <div className="glass-panel feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Express.js</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Lightweight, lightning-fast backend API providing real-time data CRUD operations.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
