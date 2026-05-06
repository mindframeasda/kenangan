import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Camera, Users, Calendar, MessageSquare, ChevronDown, Settings } from 'lucide-react'
import StudentCard from './components/StudentCard'
import students from './data/students.json'
import gallery from './data/gallery.json'
import './App.css'

// Asset paths
const HERO_BG = '/assets/hero-bg.png' 
const STUDENT_IMG = '/assets/students.png'

function App() {
  const [filter, setFilter] = useState('Semua')

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content container"
        >
          <span className="hero-subtitle">Mengenang Masa Indah</span>
          <h1 className="hero-title">XII AKUNTANSI</h1>
          <h2 style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600' }}>SMK ISLAM JIPANG 2026</h2>
          <p className="hero-desc">Setiap detik yang kita lewati adalah goresan tinta emas dalam buku kehidupan. Mari rayakan perjalanan kita bersama XII Akuntansi SMK Islam Jipang.</p>
          <div className="hero-actions">
            <a href="#gallery" className="btn btn-primary">Lihat Galeri</a>
            <a href="#members" className="btn btn-outline">Daftar Siswa</a>
          </div>
        </motion.div>
        <div className="scroll-indicator">
          <ChevronDown size={32} />
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats container">
        <div className="stats-grid">
          <div className="stat-card glass">
            <Users className="stat-icon" />
            <h3>32</h3>
            <p>Siswa Hebat</p>
          </div>
          <div className="stat-card glass">
            <Camera className="stat-icon" />
            <h3>{gallery.length}+</h3>
            <p>Foto Kenangan</p>
          </div>
          <div className="stat-card glass">
            <Calendar className="stat-icon" />
            <h3>3</h3>
            <p>Tahun Bersama</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="quote-card glass"
          >
            <MessageSquare className="quote-icon" />
            <p className="quote-text">
              "Bukan tentang seberapa lama kita bersama, tapi tentang seberapa berharga setiap detik yang kita lalui sebagai XII AKL 1. Masa depan menanti, tapi kenangan ini akan selalu punya tempat di hati."
            </p>
            <div className="quote-author">— XII Akuntansi 1</div>
          </motion.div>
        </div>
      </section>

      {/* Students Section */}
      <section className="students-section container" id="members">
        <div className="section-header">
          <h2>Anggota Kelas</h2>
          <p>Keluarga besar XII AKUNTANSI 1 yang takkan tergantikan.</p>
        </div>
        <div className="students-grid">
          {[...students]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((student, index) => (
            <StudentCard key={student.id} student={student} index={index} />
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview container" id="gallery">
        <div className="section-header">
          <h2>Galeri Kenangan</h2>
          <p>Kumpulan momen-momen tak terlupakan yang kita ciptakan bersama.</p>
        </div>
        
        <div className="filter-group">
          {['Semua', 'Kenangan', 'Siswa', 'Acara'].map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {gallery
            .filter(photo => filter === 'Semua' || photo.category === filter || (!photo.category && filter === 'Kenangan'))
            .map((photo) => (
            <motion.div 
              key={photo.id}
              whileHover={{ scale: 1.02 }}
              className="gallery-item glass"
            >
              {photo.url?.toLowerCase().endsWith('.mp4') ? (
                <video 
                  src={photo.url} 
                  className="gallery-img" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                />
              ) : (
                <img src={photo.url} alt={photo.caption} className="gallery-img" />
              )}
              <div className="gallery-caption">{photo.caption}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h2>SMK ISLAM JIPANG</h2>
              <p>Lulusan 2026 - XII Akuntansi</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Dibuat dengan <Heart size={16} fill="currentColor" /> untuk seluruh keluarga besar kelas.</p>
            </div>
            <div className="footer-links">
              <a href="#home">Beranda</a>
              <a href="#gallery">Galeri</a>
              <a href="#members">Siswa</a>
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Settings size={14} /> Admin
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 XII AKL 1. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
