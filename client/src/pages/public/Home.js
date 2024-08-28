import React from 'react';
import { Sidebar, Banner, BestSeller } from "../../components"

const Home = () => {

    return (
        <div className='w-main'>
            {/* <<div className='flex flex-col gap-5 w-[24%] flex-auto border'>
                <Sidebar />
                <span>Deal daily</span>
            </div>
            <div className='flex flex-col gap-5 pl-5 w-[72%] flex-auto border'>
                <Banner />
                <span>Best seller</span>
            </div>> */}
            <div className='mb-[30px] max-w-[1220px] min-h-[430.75px] max-h-[494px] box-border flex'>
                <div className='w-[24%]'>
                    <Sidebar />
                </div>
                <div className='pl-[20px] max-h-[494px] flex-1'>
                    <Banner />
                </div>
            </div>
            <div className='mb-[30px] max-w-[1220px] min-h-[547px] max-h-[598px] box-border flex'>
                <div className='w-[24%]'>
                    Daily deals
                </div>
                <div className='pl-[20px] flex-1'>
                    <div className='min-h-[408px] max-h-[438px] w-[100%]'>
                        <BestSeller />
                    </div>
                    <div className='min-h-[96px] max-h-[160px]'></div>
                </div>
            </div>
            <div className='mb-[30px] max-w-[1220px] min-h-[547px] max-h-[598px] box-border flex'>
                <div className='w-[24%]'>
                    Daily deals
                </div>
                <div className='pl-[20px] flex-1'>
                    <div className='min-h-[408px] max-h-[438px] w-[100%]'>
                        <BestSeller />
                    </div>
                    <div className='min-h-[96px] max-h-[160px]'></div>
                </div>
            </div>
        </div>
    )
}

export default Home;