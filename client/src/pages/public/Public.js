import React from 'react';
import { Outlet } from 'react-router-dom'; // đóng vai trò giống như thành phần tùy biến, tùy vào đường dẫn sẽ hiển thị các component
import { Navigation, Header, Footer, TopHeader } from '../../components';

const Public = () => {
    return (
      <>
        <TopHeader />
        <div className='w-main block my-0 mx-auto px-[20px] box-border'>
            <Header />
            <Navigation />
            <div className=''>
                <Outlet />
            </div>
        </div>
        <Footer />
      </>
       
    )
}

export default Public;
