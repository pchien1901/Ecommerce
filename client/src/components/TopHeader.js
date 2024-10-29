import React, { memo } from 'react';
import icons from '../ultis/icon.js';
import { Link } from 'react-router-dom';
import path from '../ultis/path.js';

const TopHeader = () => {
  const { FaFacebookF,
    FaTwitter, 
    FaInstagram, 
    FaGoogle,
    FaPinterest } = icons;
  return (
    <header className='h-[40px] bg-main w-full flex justify-center'>
      <div className='w-main text-pure-white flex items-center justify-between'>
        <div className='top-header__left text-[12px] uppercase'>ORDER ONLINE OR CALL US (+1800) 000 8808</div>
        <div className='top-header__right flex justify-end items-center'>
          <Link className='signin-signup p-[10px] hover:text-pure-black cursor-pointer text-[12px]' to={`/${path.LOGIN}`} >Sign In or Create Account</Link>
          <div className='border-l border-basic px-[10px] py-1 cursor-pointer hover:text-pure-black'><FaFacebookF size={12}/></div>
          <div className='border-l border-basic px-[10px] py-1 cursor-pointer hover:text-pure-black'><FaTwitter size={12}/></div>
          <div className='border-l border-basic px-[10px] py-1 cursor-pointer hover:text-pure-black'><FaInstagram size={12}/></div>
          <div className='border-l border-basic px-[10px] py-1 cursor-pointer hover:text-pure-black'><FaGoogle size={12}/></div>
          <div className='border-l border-basic px-[10px] py-1 cursor-pointer hover:text-pure-black'><FaPinterest size={12}/></div>
        </div>
      </div>
    </header>
  )
}

export default memo(TopHeader);