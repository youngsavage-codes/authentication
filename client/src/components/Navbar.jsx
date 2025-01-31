import { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from './context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

    // Ensure withCredentials is set for the logout request
    axios.defaults.withCredentials = true;

  const sendVerificationOtp = async () => {
    try {
      const {data} = await axios.post(`${backendUrl}/auth//send-verify-otp`, {
          withCredentials: true,
        }
      )

      if(data.success) {
          navigate('/verify-email');
          toast.success("Verify Otp Sent To Your Email")
      }
      else{
        toast.success(data.message)
      }
    } catch(error) {
      toast.error(error.response?.data?.message || "An error occurred during logout.");
    }
  }

  const logout = async () => {
    try {
      // Sending logout request
      const { data } = await axios.post(`${backendUrl}/auth/logout`);

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Successfully logged out");
        navigate('/');
      } else {
        toast.error("Logout failed, please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout.");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
      
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          
          {/* Dropdown for user options */}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
