import React, { useState, useEffect, memo} from 'react';
import icons from '../ultis/icon';
import { getCurrentDealDaily } from '../apis/dealDaily';
import img from '../assets/productCommingSoon.png';
import { formatCurrency, renderStarFromNumber } from '../ultis/helper';
import CountDown from './CountDown';


/**
 * Component Đếm thời gian và hiển thị sản phẩm giảm giá tại Home
 */
const DealCountDown = () => {
    // icon ngôi sao
    const { AiFillStar, LuMenu } = icons;
    const COUNTDOWN_NUMBER = 1;

    const [ deal, setDeal ] = useState(null);
    const [ dealDaily, setDealDaily ] = useState(null); //state lưu product hiển thị trên deal daily
    const [ hour, setHour ] = useState(0); // state quản lý giờ
    const [ minute, setMinute ] = useState(0); // state quản lý phút
    const [ second, setSecond ] = useState(0); // state quản lý giây
    const [ isExpire, setIsExpire ] = useState(false);  // state quản lý khi nào 

    /**
     * Hàm gọi api lấy deal daily tại thời điểm hiện tại, có deal sẽ cập nhật deal, set dealDaily và tính thời gian
     */
    const fetchDealAndUpdateCountDown = async () => {
        const { data: deal } = await getCurrentDealDaily();
        setDeal(deal);
        setDealDaily(deal.product);
        updateCountDown(new Date(deal.endTime) - new Date());
    }

    /**
     * Hàm cập nhật các giá trị hour, minute, second để hiển thị theo thời gian thực
     * @param {number} timeDifferent chênh lệch thời gian tại thời điểm hiện tại và thời điểm kết thúc deal
     * @author PMChien (18/09/2024)
     */
    const updateCountDown = (timeDifferent) => {
        const totalSeconds = Math.floor(timeDifferent / 1000); //số giây tính theo mili giây
        const hours = Math.floor(totalSeconds / 3600); // giờ
        const minutes = Math.floor((totalSeconds % 3600) /60);
        const seconds = totalSeconds % 60

        setHour(hours);
        setMinute(minutes);
        setSecond(seconds);
    };

    useEffect(() => {
        console.log('goi api lần đầu.');
        fetchDealAndUpdateCountDown();
    }, []);

    // useEffect dùng để gọi api lấy product hiển thị deal daily, chạy mỗi lần render
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const endTime = new Date(deal?.endTime);
            const timeDifferent = endTime - now;
            //console.log('timeDifferent: ', timeDifferent);
            if(timeDifferent <= 0) {
                fetchDealAndUpdateCountDown();
            }
            else {
                updateCountDown(timeDifferent);
            }
        }, 1000);

        // clean up
        return () => clearInterval(intervalId);
    }, [deal]);

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

export default memo(DealCountDown); // bọc trong memo tránh re-render