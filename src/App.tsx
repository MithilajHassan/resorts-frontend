
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import ResortRoutes from './routes/ResortRoutes'
import AdminRoutes from './routes/AdminRoutes'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/resort/*' element={<ResortRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </Router>
  )
}

export default App
