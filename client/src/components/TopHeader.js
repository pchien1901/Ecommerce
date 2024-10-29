import React, { memo } from 'react';
import icons from '../ultis/icon.js';

const TopHeader = () => {
  const { FaFacebookF,
    FaTwitter, 
    FaInstagram, 
    FaGoogle,
    FaPinterest } = icons;
  return (
    <header className='h-[40px] bg-main w-full flex justify-center'>
      <div className='w-main text-pure-white flex items-center justify-between px-[20px]'>
        <div className='top-header__left uppercase'>ORDER ONLINE OR CALL US (+1800) 000 8808</div>
        <div className='top-header__right flex justify-end items-center'>
          <div className='signin-signup p-[10px] hover:text-pure-black'>Sign In or Create Account</div>
          <div className='border-l border-pure-white px-[10px]'><FaFacebookF /></div>
          <div className='border-l border-pure-white px-[10px]'><FaTwitter /></div>
          <div className='border-l border-pure-white px-[10px]'><FaInstagram /></div>
          <div className='border-l border-pure-white px-[10px]'><FaGoogle /></div>
          <div className='border-l border-pure-white px-[10px]'><FaPinterest /></div>
        </div>
      </div>
    </header>
  )
}

export default memo(TopHeader);