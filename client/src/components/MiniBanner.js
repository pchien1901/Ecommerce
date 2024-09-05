import React from 'react';
import banner1 from "../assets/banner1-home2_2000x_crop_center.avif";
import banner2 from "../assets/banner2-home2_2000x_crop_center.avif";

/**
 * Component mini banner bên dưới best seller
 * @returns JSX của mini banner
 * @author PMChien (04/09/2024)
 */
const MiniBanner = () => {
    return (
        <div className='w-full flex justify-between gap-5 items-center'>
            <div className='w-[50%]'>
                <img className='w-full object-contain' src={banner2} alt='Banner 1'/>
            </div>
            <div className='w-[50%]'>
                <img className='w-full object-contain' src={banner1} alt='Banner 2'/>
            </div>
        </div>
    )
}

export default MiniBanner;