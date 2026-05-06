import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.path.includes('student') ? 'public/assets/students' : 'public/assets/gallery';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Database Paths
const studentsDb = path.join(__dirname, 'src/data/students.json');
const galleryDb = path.join(__dirname, 'src/data/gallery.json');

// Helper to read/write JSON
const readDb = (dbPath) => {
  if (!fs.existsSync(dbPath)) return [];
  const data = fs.readFileSync(dbPath, 'utf8');
  return data ? JSON.parse(data) : [];
};

const writeDb = (dbPath, data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// GET ENDPOINTS
app.get('/api/students', (req, res) => res.json(readDb(studentsDb)));
app.get('/api/gallery', (req, res) => res.json(readDb(galleryDb)));

// POST ENDPOINTS (Upload + Save to DB)
app.post('/api/students', upload.single('photo'), (req, res) => {
  try {
    const students = readDb(studentsDb);
    const newStudent = {
      id: Date.now(),
      name: req.body.name,
      role: req.body.role || 'Siswa',
      photo: req.file ? `/assets/students/${req.file.filename}` : null
    };
    students.push(newStudent);
    writeDb(studentsDb, students);
    res.json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gallery', upload.single('photo'), (req, res) => {
  try {
    const gallery = readDb(galleryDb);
    const newPhoto = {
      id: Date.now(),
      url: req.file ? `/assets/gallery/${req.file.filename}` : null,
      caption: req.body.caption || 'Kenangan',
      category: req.body.category || 'Kenangan'
    };
    gallery.push(newPhoto);
    writeDb(galleryDb, gallery);
    res.json(newPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE ENDPOINTS
app.delete('/api/students/:id', (req, res) => {
  let students = readDb(studentsDb);
  students = students.filter(s => s.id !== parseInt(req.params.id));
  writeDb(studentsDb, students);
  res.json({ success: true });
});

app.delete('/api/gallery/:id', (req, res) => {
  let gallery = readDb(galleryDb);
  gallery = gallery.filter(g => g.id !== parseInt(req.params.id));
  writeDb(galleryDb, gallery);
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local Admin Server running on http://localhost:${PORT}`);
  console.log(`Uploads will be saved directly to public/assets and src/data/*.json!`);
});
