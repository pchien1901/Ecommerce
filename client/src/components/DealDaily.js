import React, { useState, useEffect, memo} from 'react';
import icons from '../ultis/icon';
import product from '../apis/product';
import { getCurrentDealDaily } from '../apis/dealDaily';
import img from '../assets/productCommingSoon.png';
import { formatCurrency, renderStarFromNumber } from '../ultis/helper';
import CountDown from './CountDown';


/**
 * Component Đếm thời gian và hiển thị sản phẩm giảm giá tại Home
 */
const DealDaily = () => {
    // icon ngôi sao
    const { AiFillStar, LuMenu } = icons;
    const COUNTDOWN_NUMBER = 60;

    const [ dealDaily, setDealDaily ] = useState(null); //state lưu product hiển thị trên deal daily
    const [ hour, setHour ] = useState(0); // state quản lý giờ
    const [ minute, setMinute ] = useState(0); // state quản lý phút
    const [ second, setSecond ] = useState(0); // state quản lý giây
    const [ isExpire, setIsExpire ] = useState(false);  // state quản lý khi nào 

    /**
     * Gọi api lấy product để hiển thị tại deal daily, hiện tại đang lấy 1 product cố định
     */
    const fetchDealDaily = async () => {
        try{
            const response = await product.getAllProduct({limit: 1, page: 2});
            console.log(response);
            if( response.success) {
                setDealDaily(response.data[0]);
            
            }
        }
        catch(error) {
            console.error(`Đã có lỗi khi gọi api ${error}`);
        }
        
    }

    /**
     * Hàm gọi api lấy deal daily tại thời điểm hiện tại
     */
    const getCurrentDeal = async () => {
        try{
            const res = await getCurrentDealDaily();
            console.log(res);
        }
        catch (error) {
            console.error(`Đã có lỗi khi gọi api ${error}`);
        }
    }

    // useEffect dùng để gọi api lấy product hiển thị deal daily, chạy mỗi lần render
    useEffect(() => {
        //clearInterval(idInterval);
        fetchDealDaily();
        //getCurrentDeal();
        console.log('gọi api lần tải trang đầu tiên.');
    }, []);

    // useEffet quản lý thời gian đếm ngược 
    useEffect(() => {
         let idInterval = setInterval(() => {
            if(second > 0) {
                setSecond((preSecond) => preSecond - 1);
            }
            else {
                if (minute > 0) {
                    setMinute((preMinute) => preMinute - 1);
                    setSecond(COUNTDOWN_NUMBER);
                }
                else {
                    if(hour > 0) {
                        setHour((preHour) => preHour - 1);
                        setMinute(COUNTDOWN_NUMBER);
                        setSecond(COUNTDOWN_NUMBER);
                    }
                    else {
                        setIsExpire(true);
                    }
                }
            }
        }, 1000); // chạy sau mỗi 1 s
        return () => {
            clearInterval(idInterval);
        }
    }, [second]);

    // useEffect gọi product mới
    useEffect(() => {
        if(isExpire) {
            fetchDealDaily();
            console.log('gọi api mỗi lần reset');
            setHour(COUNTDOWN_NUMBER);
            setMinute(COUNTDOWN_NUMBER);
            setSecond(COUNTDOWN_NUMBER);
            setIsExpire(false);
        }
    }, [isExpire]);

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