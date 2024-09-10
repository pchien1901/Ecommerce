import React, { useState, useEffect, memo} from 'react';
import icons from '../ultis/icon';
import product from '../apis/product';
import img from '../assets/productCommingSoon.png';
import { formatCurrency } from '../ultis/helper';

/**
 * Component Đếm thời gian và hiển thị sản phẩm giảm giá tại Home
 */
const DealDaily = () => {
    // icon ngôi sao
    const { AiFillStar } = icons;

    const [ dealDaily, setDealDaily ] = useState(null);
    const fetchDealDaily = async () => {
        const response = await product.getAllProduct({limit: 1, page: 2});
        console.log(response);
        if( response.success) {
            setDealDaily(response.data[0]);
        }
    }

    useEffect(() => {
        fetchDealDaily();
    }, [])
    return (
        <div className='border border-basic w-full h-full p-5'> 
            <div className='flex items-center w-full mb-[50px]'>
                <span className='flex-1 flex justify-center text-main'><AiFillStar size={20} /></span>
                <span className='flex-6 font-semibold text-[20px] text-center text-pure-black'>Deal Daily</span>
                <span className='flex-1'></span>
            </div>
            <div className=''>
                <img src={ dealDaily?.thumb || img} alt='true' className='w-[253px] min-h-[198px] object-contain mb-[15px]'/>
                <div className='pt-[15px] pb-[6px] truncate w-[190px] font-main text-[16px] font-normal hover:text-main' title={dealDaily?.title}>{dealDaily?.title}</div>
                <div className='money font-main text-[16px] font-normal mb-[10px]'>
                    { formatCurrency(dealDaily?.price) }
                </div>
            </div>
        </div>
    )
}

export default memo(DealDaily); // bọc trong memo tránh re-render