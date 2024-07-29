import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/Home';



function App() {

  return (
    <>
    <div className='bg-[rgba(10,16,23,255)] h-screen'>
    <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
      
      
    </>      
  )
}

export default App
