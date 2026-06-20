import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLaravel } from '../api';

const Posts = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', body: '' });

  const navigate = useNavigate();
  
  // Get currently logged-in user ID
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await apiLaravel.get('/post');
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts. Is the Laravel server running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post = null) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (post) {
      setEditingId(post.id);
      setFormData({ title: post.title, body: post.body });
    } else {
      setEditingId(null);
      setFormData({ title: '', body: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiLaravel.put(`/post/${editingId}`, formData);
      } else {
        await apiLaravel.post('/post', formData);
      }
      handleCloseModal();
      fetchPosts();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiLaravel.delete(`/post/${id}`);
        fetchPosts();
      } catch (err) {
        alert('Error deleting post: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Community Forum</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Powered by Laravel Sanctum & Policies</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          + Create Post
        </button>
      </div>

      {!token && (
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--border-radius-md)', marginBottom: '2rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <strong>Notice:</strong> You are viewing as a guest. Please <a href="/login">login</a> to create or manage your posts.
        </div>
      )}

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="flex-center"><span className="loader"></span></div>
      ) : (
        <div className="grid-cols-2">
          {posts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No posts found. Be the first to post!
            </div>
          ) : (
            posts.map(post => {
              const isOwner = currentUser?.id === post.user_id;
              
              return (
                <div key={post.id} className="card post-card">
                  <h3>{post.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Posted on {formatDate(post.created_at)}
                  </div>
                  <p className="post-body">{post.body}</p>
                  
                  <div className="post-footer">
                    <span className="badge">Author ID: {post.user_id}</span>
                    
                    {isOwner && (
                      <div className="action-buttons">
                        <button onClick={() => handleOpenModal(post)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
                        <button onClick={() => handleDelete(post.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Post' : 'Create New Post'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Title</label>
                <input type="text" name="title" className="input-field" placeholder="Enter an engaging title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Content Body</label>
                <textarea name="body" className="input-field" placeholder="What's on your mind?" rows="5" value={formData.body} onChange={handleChange} required></textarea>
              </div>
              <div className="flex-between" style={{ marginTop: '2rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Post' : 'Publish Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
