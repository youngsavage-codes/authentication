import { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../components/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContent)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
})

const handleInputChange = (field, value) => {
  setFormData({ ...formData, [field]: value });
};

const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    axios.defaults.withCredentials = true;

    let data;
    if (state === 'Sign Up') {
      ({ data } = await axios.post(`${backendUrl}/auth/register`, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      }));
    } else {
      ({ data } = await axios.post(`${backendUrl}/auth/login`, {
        email: formData.email,
        password: formData.password
      }));
    }
    
    if (data.success) {
      setIsLoggedin(true);
      getUserData();
      navigate('/');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};
  
  return (
    <div className='flex items-center justify-center min-h-screen
      px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img src={assets.logo} onClick={() => navigate('/')}  alt="" className='absolute left-5 sm:left-20 top-5
      w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? 'Create Account' : 'Login Account'}</h2>
        <p className='text-center text-sm mb-3'>{state === "Sign Up" ? 'Create your account' : 'Login to your account'}</p>
        <form onSubmit={onSubmitHandler} className='space-y-5'>
          {
            state === 'Sign Up' && (
              <CustomInput 
              type="text" 
              placeholder="Full Name" 
              icon={assets.person_icon} 
              value={formData.fullName} 
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
            )
          }
          <CustomInput 
            type="email" 
            placeholder="Email id" 
            icon={assets.mail_icon}
            value={formData.email} 
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <CustomInput 
            type="password" 
            placeholder="Password" 
            icon={assets.lock_icon} 
            value={formData.password} 
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
          <CustomButton text={state} />
        </form>
        {
          state === 'Sign Up' ? 
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account? {' '}
            <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('Sign In')}>Login here</span>
          </p>
          :
          <p className="text-gray-400 text-center text-xs mt-4">
            Dont have an account? {' '}
            <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('Sign Up')}>Sign up</span>
          </p>
        }
        
      </div>
    </div>
  );
};

export default Login;
