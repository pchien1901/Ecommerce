import React from 'react';
import { Outlet } from 'react-router-dom'; // đóng vai trò giống như thành phần tùy biến, tùy vào đường dẫn sẽ hiển thị các component
import { Navigation, Header } from '../../components';

const Public = () => {
    return (
        <div className='w-main block my-0 mx-auto box-border'>
            <Header />
            <Navigation />
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Public;
