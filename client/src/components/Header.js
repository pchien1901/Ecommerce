import React from 'react';
import logo from '../assets/logo.png';
import icons from '../ultis/icon';
import { Link } from 'react-router-dom';
import path from '../ultis/path';

const Header = () => {
    const { RiPhoneFill, MdEmail, CiUser, GiShoppingBag } = icons;
    return (
        <div className='w-main h-[110px] py-[35px] flex justify-between items-center'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt='logo' className='w-[234px] object-contain'/>
            </Link>
            <div className='flex text-[13px]'>
                <div className='flex flex-col items-center px-5'>
                    <span className='flex items-center'>
                        <RiPhoneFill className='text-main mr-[10px]'/>
                        <span className='font-semibold'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className='flex flex-col items-center px-5 border-l border-black/[.1]'>
                    <span className='flex items-center'>
                        <MdEmail className='text-main mr-[10px]'/>
                        <span className='font-semibold uppercase'>support@tadathemes.com</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                <div className='flex pt-2 px-5 border-l border-black/[.1]'>
                    <GiShoppingBag className='text-main text-xl'/>
                    <span className='pt-1 ml-1'>0 item(s)</span>
                </div>
                <div className='pl-5 pt-2 pr-[30px] border-l border-black/[.1]'>
                    <CiUser className='text-main text-xl'/>
                </div>
            </div>
        </div>
        
    )
}

export default Header;