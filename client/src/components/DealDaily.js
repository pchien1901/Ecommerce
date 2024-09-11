import React, { useState, useEffect, memo} from 'react';
import icons from '../ultis/icon';
import product from '../apis/product';
import img from '../assets/productCommingSoon.png';
import { formatCurrency, renderStarFromNumber } from '../ultis/helper';
import CountDown from './CountDown';

/**
 * Component Đếm thời gian và hiển thị sản phẩm giảm giá tại Home
 */
const DealDaily = () => {
    // icon ngôi sao
    const { AiFillStar, LuMenu } = icons;

    const [ dealDaily, setDealDaily ] = useState(null);
    const [ hour, setHour ] = useState(0);
    const [ minute, setMinute ] = useState(0);
    const [ second, setSecond ] = useState(0);

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
            <div className='flex items-center w-full mb-[30px]'>
                <span className='flex-1 flex justify-center text-main'><AiFillStar size={20} /></span>
                <span className='flex-6 font-semibold text-[20px] text-center text-pure-black'>Deal Daily</span>
                <span className='flex-1'></span>
            </div>
            <div className=''>
                <img src={ dealDaily?.thumb || img} alt='true' className='w-[253px] min-h-[198px] object-contain mb-[15px]'/>
                <div className='text-center pt-[15px] pb-[6px] truncate w-full font-main text-[16px] font-normal hover:text-main' title={dealDaily?.title}>{dealDaily?.title}</div>
                <div className='flex justify-center h-4'>{ renderStarFromNumber(dealDaily?.totalRatings, 20, 'text-color-20-light' )}</div>
                <div className='money font-main text-[16px] font-normal pt-[15px] mb-[15px] text-center'>
                    { formatCurrency(dealDaily?.price) }
                </div>
            </div>
            <div>
                <div className='flex justify-center gap-2 w-full mb-[15px]'>
                    <CountDown unit={'Hours'} number={hour} />
                    <CountDown unit={'Minutes'} number={minute} />
                    <CountDown unit={'Seconds'} number={second} />
                </div>
                <button 
                    className='flex gap-2 justify-center items-center w-full h-10 font-medium bg-main text-pure-white hover:bg-color-20-light active:bg-color-20-dark'
                    type='button'
                >
                    <LuMenu />
                    <span>Options</span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily); // bọc trong memo tránh re-render