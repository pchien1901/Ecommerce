import React, { memo } from 'react';
import icons from '../ultis/icon.js';

const Footer = () => {
  const { MdEmail, FaMapMarkerAlt,
    FaPhone } = icons; // lấy component icon email từ destructuring
  return (
    <footer className='w-full'>
      <section className='h-[103px] w-full bg-main flex items-center justify-center'>
        <div className='w-main flex justify-between '>
          <div className='top-footer__left text-pure-white flex-1'>
            <div className='uppercase text-[20px] text-opacity-80'>Sign up to Newsletter</div>
            <div className='text-[13px] text-opacity-60'>Subscribe now and receive weekly newsletter</div>
          </div>
          <div className='flex-1 flex items-center'>
            <input 
              type='email' 
              placeholder='Email address' 
              className='flex-1 py-4 pl-10 rounded-l-full bg-[#ffffff1a] bg-opacity-50 text-pure-white outline-none placeholder:text-sm placeholder:text-pure-white'
            />
            <div className='rounded-r-full bg-[#ffffff1a] bg-opacity-50 w-[70px] h-[56px] flex justify-center items-center text-pure-white'>
              <MdEmail size={20}/>
            </div>
          </div>
        </div>
      </section>
      <section className='h-[407px] w-full bg-footer-bg flex items-center justify-center text-footer-text-color text-[13px]'>
        <div className='w-main'>
        <div className='w-main flex border-b border-b-footer-text-color pb-[30px]'>
          <div className='flex-2'>
            <h3 className='mb-[20px] text-[15px] pl-[15px] font-medium border-l-2 border-main text-pure-white uppercase'>About us</h3>
            <div className='flex items-center pb-[10px]'>
              <FaMapMarkerAlt className='text-pure-white' size={13} />
              <span className='text-pure-white pl-2'>Address:</span>
              <span className='pl-2'>474 Ontario St Toronto, ON M4X 1M7 Canada</span>
            </div>
            <div className='flex items-center pb-[10px]'>
              <FaPhone className='text-pure-white' size={13} />
              <span className='text-pure-white pl-2'>Phone:</span>
              <span className='pl-2'>(+1234)56789xxx</span>
            </div>
            <div className='flex items-center pb-[10px] mb-[20px]'>
              <MdEmail className='text-pure-white' size={13} />
              <span className='text-pure-white pl-2'>Mail:</span>
              <span className='pl-2'>goodluck.foryou@gmail.com</span>
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='mb-[20px] text-[15px] pl-[15px] font-medium border-l-2 border-main text-pure-white uppercase'>Information</h3>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Typography</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Gallery</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Store location</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Today's Deals</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Contact</span>
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='mb-[20px] text-[15px] pl-[15px] font-medium border-l-2 border-main text-pure-white uppercase'>Who we are</h3>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Help</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Free Shipping</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>FAQs</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Return & Exchange</span>
            </div>
            <div className='flex items-center pb-[10px] cursor-pointer hover:text-pure-white'>
              <span className='pl-2'>Testimonials</span>
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='mb-[20px] text-[15px] pl-[15px] font-medium border-l-2 border-main text-pure-white uppercase'>#Digitalworldstore</h3>
          </div>
        </div>
        <div className='w-main flex pt-[30px]'>
          <h3 className='mb-[20px] text-[15px] pl-[15px] font-medium border-l-2 border-main text-pure-white uppercase'>Product tag</h3>
        </div>
        </div>
      </section>
    </footer>
  )
}

export default memo(Footer);