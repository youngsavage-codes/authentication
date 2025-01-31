import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/verify-email' element={<VerifyEmail />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
      </Routes>
    </div>
  )
}

export default App
