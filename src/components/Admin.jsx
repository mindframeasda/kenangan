import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlus, Trash2, Home, Upload, Users, Image as ImageIcon } from 'lucide-react'
import './Admin.css'

const API_URL = 'http://localhost:3001/api'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('gallery') // 'gallery' | 'members'
  
  // Gallery State
  const [photos, setPhotos] = useState([])
  const [newCaption, setNewCaption] = useState('')
  const [newCategory, setNewCategory] = useState('Kenangan')

  // Members State
  const [members, setMembers] = useState([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Siswa')

  useEffect(() => {
    fetch(`${API_URL}/gallery`)
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error(err))

    fetch(`${API_URL}/students`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err))
  }, [])

  // --- Gallery Handlers ---
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('caption', newCaption)
      formData.append('category', newCategory)

      try {
        const res = await fetch(`${API_URL}/gallery`, { method: 'POST', body: formData })
        const newPhoto = await res.json()
        setPhotos(prev => [...prev, newPhoto])
        setNewCaption('')
      } catch (err) {
        console.error("Upload error:", err)
      }
    }
  }

  const handleDeletePhoto = async (id) => {
    await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' })
    setPhotos(photos.filter(p => p.id !== id))
  }

  // --- Members Handlers ---
  const handleMemberUpload = async (e) => {
    const file = e.target.files[0]
    if (file && newMemberName) {
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('name', newMemberName)
      formData.append('role', newMemberRole)

      try {
        const res = await fetch(`${API_URL}/students`, { method: 'POST', body: formData })
        const newMember = await res.json()
        setMembers(prev => [...prev, newMember])
        setNewMemberName('')
        setNewMemberRole('Siswa')
      } catch (err) {
        console.error("Upload error:", err)
      }
    } else if (!newMemberName) {
      alert("Masukkan nama siswa terlebih dahulu sebelum mengunggah foto!")
    }
  }

  const handleDeleteMember = async (id) => {
    await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' })
    setMembers(members.filter(m => m.id !== id))
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Panel Admin</h2>
          <Link to="/" className="btn-back">
            <Home size={18} /> Kembali ke Web
          </Link>
        </div>
      </header>

      <main className="container admin-main">
        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={18} /> Galeri Kenangan
          </button>
          <button 
            className={`admin-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={18} /> Anggota Kelas
          </button>
        </div>

        {activeTab === 'gallery' && (
          <div className="tab-content fade-in">
            <div className="upload-section glass">
              <h3>Tambah Foto Galeri</h3>
              <p>Pilih foto dari perangkat Anda untuk ditambahkan ke Galeri.</p>
              <div className="upload-form">
                <input 
                  type="text" 
                  placeholder="Caption/Keterangan foto..." 
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="caption-input"
                />
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="caption-input"
                  style={{ flex: '0 0 auto', minWidth: '150px' }}
                >
                  <option value="Kenangan">Kenangan</option>
                  <option value="Siswa">Foto Siswa</option>
                  <option value="Acara">Acara Sekolah</option>
                </select>
                <label className="btn btn-primary upload-btn">
                  <Upload size={18} /> Pilih File
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handlePhotoUpload} 
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Kelola Foto ({photos.length})
            </h3>
            <div className="admin-gallery-grid">
              {photos.map(photo => (
                <div key={photo.id} className="admin-photo-card glass">
                  {photo.url?.toLowerCase().endsWith('.mp4') ? (
                    <video src={photo.url} muted style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  ) : (
                    <img src={photo.url} alt={photo.caption} />
                  )}
                  <div className="admin-photo-info">
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span>{photo.caption}</span>
                      <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{photo.category || 'Kenangan'}</small>
                    </div>
                    <button onClick={() => handleDeletePhoto(photo.id)} className="btn-delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="tab-content fade-in">
            <div className="upload-section glass">
              <h3>Tambah Anggota Baru</h3>
              <p>Masukkan data dan foto siswa.</p>
              <div className="upload-form">
                <input 
                  type="text" 
                  placeholder="Nama Siswa..." 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="caption-input"
                />
                <input 
                  type="text" 
                  placeholder="Peran (cth: Siswa, Ketua Kelas)..." 
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="caption-input"
                  style={{ flex: '0 0 auto', maxWidth: '200px' }}
                />
                <label className="btn btn-primary upload-btn">
                  <Upload size={18} /> Upload Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleMemberUpload} 
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Daftar Anggota ({members.length})
            </h3>
            <div className="admin-members-list">
              {members.map(member => (
                <div key={member.id} className="admin-member-item glass">
                  <div className="admin-member-profile">
                    <div className="admin-member-avatar">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} />
                      ) : (
                        <div className="admin-member-initial">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="admin-member-details">
                      <strong>{member.name}</strong>
                      <small>{member.role}</small>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMember(member.id)} className="btn-delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
