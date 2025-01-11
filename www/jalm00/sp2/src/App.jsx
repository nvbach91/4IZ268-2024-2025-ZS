import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Drink from './pages/Drink' 

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drink/:id" element={<Drink />} />
      </Routes>
  )
}

export default App
