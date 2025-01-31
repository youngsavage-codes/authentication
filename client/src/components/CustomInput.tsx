import React from 'react';

const CustomInput = ({ 
  type = 'text', 
  placeholder = 'Enter text...', 
  icon, 
  value, 
  onChange, 
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ${className}`}>
      {icon && <img src={icon} alt="icon" className="w-5 h-5" />}
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        required 
        className='bg-transparent outline-none w-full text-white'
      />
    </div>
  );
};

export default CustomInput;