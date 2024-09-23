import React, { useState, useEffect } from 'react';

const images = [
    {
        _id: 0,
        src: 'https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661',
        position: 'A1',
    },
    {
        _id: 1,
        src: 'https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661',
        position: 'A2',
    },
    {
        _id: 2,
        src: 'https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661',
        position: 'A3',
    },
    {
        _id: 3,
        src: 'https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661',
        position: 'A4',
    }
]

const GridImage = () => {
    const banner1 = images.filter(img => img.position === 'A1')[0];
    const banner2 = images.filter(img => img.position === 'A2')[0];
    const banner3 = images.filter(img => img.position === 'A3')[0];
    const banner4 = images.filter(img => img.position === 'A4')[0];

    //console.log(banner1);

    return (
        <div className='grid grid-cols-4 grid-rows-2 gap-4'>
            <div className='col-start-1 col-end-3 row-span-2 image-animation'>
                <img src={banner1.src} alt='true' className='w-full h-full object-cover'/>
            </div>
            <div className='col-start-3 col-end-4 row-start-1 row-end-2 image-animation'>
                <img src={banner2.src} alt='true' className='w-full h-full object-cover'/>
            </div>
            <div className='col-start-3 col-end-4 row-start-2 row-end-3 image-animation'>
                <img src={banner3.src} alt='true' className='w-full h-full object-cover'/>
            </div>
            <div className='col-span-1 row-span-2 image-animation'>
                <img src={banner4.src} alt='true' className='w-full h-full object-cover'/>
            </div>
        </div>
    );
}

export default GridImage;