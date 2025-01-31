import { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../components/context/AppContext';
import { assets } from '../assets/assets';
import CustomInput from '../components/CustomInput';

const ResetPassword = () => {
  const [email,  setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const {backendUrl} = useContext(AppContent);
  const navigate = useNavigate();

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

    const submitEmail = async (e) => {
      e.preventDefault();
      try {
        const {data} = await axios.post(`${backendUrl}/auth/send-reset-otp`, {
          email,
          withCredentials: true
        })

        data.success ? toast.success('Reset Otp Sent') : toast.error(data.message);
        setEmailSent(true)
      } catch(error) {
        toast.error(error.message)
      }
    }

    const onSubmitOtp = async (e) => {
      e.preventDefault();

      const optArray = inputRefs.current.map(e => e.value);
      setOtp(optArray.join(''));

      setOtpSent(true)
    } 

    const handleChangePassword = async (e) => {
      e.preventDefault();

      try {
        const {data} = await axios.post(`${backendUrl}/auth/reset-password`, {
          email,
          otp,
          newPassword
        })

        if(data.success) {
          setEmailSent(false);
          setOtpSent(false);
          navigate('/');
        }else {
          toast.error(data.message)
        }
      } catch(e) {
        toast.error(e.message);
      }
    } 

  return (
    <div  className='flex items-center justify-center min-h-screen
    bg-gradient-to-br from-blue-200 to-purple-400'>
        <img src={assets.logo} onClick={() => navigate('/')}  alt="" className='absolute left-5 sm:left-20 top-5
          w-28 sm:w-32 cursor-pointer'/>
      {
        !emailSent && (
          <form onSubmit={submitEmail} className='bg-slate-900 text-indigo-300 p-8 rounded-lg shadow-lg w-96 text-sm space-y-5'>
            <h1 className='text-3xl font-semibold text-white text-center mb-3'>Reset Password</h1>
            <p className='text-center text-sm mb-3'>Enter your email address</p>
            <CustomInput 
                type="email" 
                placeholder="Email id" 
                icon={assets.mail_icon}
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            <CustomButton text="Send Otp" />
          </form>
        )
      }

      {
        emailSent && !otpSent && (
          <form onSubmit={onSubmitOtp} className='bg-slate-900 text-indigo-300 p-8 rounded-lg shadow-lg w-96 text-sm'>
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
            <CustomButton text="Submit" />
          </form>
        )
      }

      {
        emailSent && otpSent && (
          <form onSubmit={handleChangePassword} className='bg-slate-900 text-indigo-300 p-8 rounded-lg shadow-lg w-96 text-sm space-y-5'>
            <h1 className='text-3xl font-semibold text-white text-center mb-3'>New Password</h1>
            <p className='text-center text-sm mb-3'>Enter your new password</p>
            <CustomInput 
                type="password" 
                placeholder="New Password" 
                icon={assets.lock_icon}
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
              />
            <CustomButton text="Change Password" />
          </form>
        )
      }

    </div>
  )
}

export default ResetPassword