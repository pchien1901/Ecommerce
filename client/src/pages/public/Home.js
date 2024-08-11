import React, { useEffect } from 'react';
import { Sidebar, Banner } from "../../components"
import product from "../../apis/product";

const Home = () => {

    useEffect(() => {
        Promise.all(
            [
                product.getAllProduct({ sort: '-sold', limit: '10'}),
                product.getAllProduct({ sort: '-createdAt', limit: '10'})
            ]
        )
        .then(response => {
            console.log("best seller: ", response[0]);
            console.log("new arrival: ", response[1]);
        })
        .catch(error => {
            console.error(`Đã có lỗi ${ error }`);
        })
    }, []);

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
                <div className='pl-[10px] max-h-[494px] flex-1'>
                    <Banner />
                </div>
            </div>
        </div>
    )
}

export default Home;