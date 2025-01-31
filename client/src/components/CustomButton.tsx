import React from 'react'

const CustomButton = ({text, onPress}) => {
  return (
    <button type="submit" onClick={onPress} className='w-full rounded-full py-2.5 
    text-white bg-gradient-to-r from-indigo-500 to-indigo-900
      font-medium'>
        {text}
    </button>
  )
}

export default CustomButton