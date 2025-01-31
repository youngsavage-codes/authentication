import  {useContext, useLayoutEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../components/context/AppContext';

const VerifyEmail = () => {
  const navigate = useNavigate()
  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent);
    // Ensure withCredentials is set for the logout request
    axios.defaults.withCredentials = true;

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length -1) {
      inputRefs.current[index + 1].focus();
    } 
  } 

  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pastArray = paste.split('');
    pastArray.forEach((char, index) => {
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      const {data} = await axios.post(`${backendUrl}/auth/verify-account`, {
        otp,
        withCredentials: true,
      })

      if(data.success) {
        toast.success(data.message)
        isLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message)
      }
    } catch(error) {
      toast.error(error.message)
    }
  }

  useLayoutEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (
    <div className='flex items-center justify-center min-h-screen
      bg-gradient-to-br from-blue-200 to-purple-400'>
        <img src={assets.logo} onClick={() => navigate('/')}  alt="" className='absolute left-5 sm:left-20 top-5
              w-28 sm:w-32 cursor-pointer'/>

        <form onSubmit={onSubmitHandler} className='bg-slate-900 text-indigo-300 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-3xl font-semibold text-white text-center mb-3'>Verify Email Otp</h1>
          <p className='text-center text-sm mb-3'>Enter the 6 digit code sent to your email</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} 
              required className='w-12 h-12 bg-[#333A5C] text-white text-center 
              text-xl rounded-md' 
              ref={(e) => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <CustomButton text="Verify Email" />
        </form>
    </div>
  )
}

export default VerifyEmail