import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import TecnicoDashboard from './pages/tecnico/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import ProductorDashboard from './pages/productor/Dashboard'
import RegistroProductor from './pages/registroProductor'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tecnico" element={<ProtectedRoute><TecnicoDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/productor" element={<ProtectedRoute><ProductorDashboard /></ProtectedRoute>} />
        <Route path="/registro" element={<RegistroProductor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App