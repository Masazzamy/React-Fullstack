import React, { useState, useEffect } from 'react';
import { apiExpress } from '../api';

const Siswa = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama: '', kelas: '', nis: '' });

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      const res = await apiExpress.get('/siswa');
      setSiswaList(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data. Is the Express server running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  const handleOpenModal = (siswa = null) => {
    if (siswa) {
      setEditingId(siswa.id);
      setFormData({ nama: siswa.nama, kelas: siswa.kelas, nis: siswa.nis });
    } else {
      setEditingId(null);
      setFormData({ nama: '', kelas: '', nis: '' });
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
        await apiExpress.put(`/siswa/${editingId}`, formData);
      } else {
        await apiExpress.post('/siswa', formData);
      }
      handleCloseModal();
      fetchSiswa();
    } catch (err) {
      alert('Error saving data: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiExpress.delete(`/siswa/${id}`);
        fetchSiswa();
      } catch (err) {
        alert('Error deleting data');
      }
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2>Data Siswa</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Powered by Express.js & MySQL</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          + Tambah Siswa
        </button>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-panel table-container">
        {loading ? (
          <div className="flex-center"><span className="loader"></span></div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NIS</th>
                <th>Nama Lengkap</th>
                <th>Kelas</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswaList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    Belum ada data siswa.
                  </td>
                </tr>
              ) : (
                siswaList.map(siswa => (
                  <tr key={siswa.id}>
                    <td>{siswa.id}</td>
                    <td><span className="badge">{siswa.nis}</span></td>
                    <td style={{ fontWeight: '500' }}>{siswa.nama}</td>
                    <td>{siswa.kelas}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleOpenModal(siswa)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Edit</button>
                      <button onClick={() => handleDelete(siswa.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">NIS (Nomor Induk Siswa)</label>
                <input type="text" name="nis" className="input-field" value={formData.nis} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Nama Lengkap</label>
                <input type="text" name="nama" className="input-field" value={formData.nama} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Kelas</label>
                <input type="text" name="kelas" className="input-field" value={formData.kelas} onChange={handleChange} required />
              </div>
              <div className="flex-between" style={{ marginTop: '2rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Siswa;
