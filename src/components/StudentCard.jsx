import { motion } from 'framer-motion'
import './StudentCard.css'

// Inisial dari nama untuk avatar placeholder
function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Warna avatar berdasarkan ID
const avatarColors = [
  ['#2563eb', '#60a5fa'],
  ['#7c3aed', '#a78bfa'],
  ['#0891b2', '#22d3ee'],
  ['#059669', '#34d399'],
  ['#d97706', '#fbbf24'],
  ['#dc2626', '#f87171'],
]

function StudentCard({ student, index }) {
  const color = avatarColors[index % avatarColors.length]

  return (
    <motion.div
      className="student-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <div className="student-photo-wrapper">
        {student.photo ? (
          <img
            src={student.photo}
            alt={student.name}
            className="student-photo"
          />
        ) : (
          <div
            className="student-avatar"
            style={{
              background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
            }}
          >
            {getInitials(student.name)}
          </div>
        )}
      </div>
      <div className="student-info">
        <h3 className="student-name">{student.name}</h3>
      </div>
    </motion.div>
  )
}

export default StudentCard
