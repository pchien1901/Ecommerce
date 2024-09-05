import React, { useState, useEffect } from 'react';
import product from "../apis/product"
import { Product } from "./index";
import Slider from 'react-slick';
import { ProductCard } from "./index";

const tabs = [
    { id: 1, name: "Best Seller ", label: 'Hot' },
    { id: 2, name: "New Arrivals", label: 'New' }, 
];

const settings = {
    dots: false, // dấu trắng dưới để biết đang ở đâu
    infinite: false, // có cho phép lướt vòng tròn không
    speed: 500, // Tốc độ lướt
    slidesToShow: 3, // số lượng item show
    slidesToScroll: 1 // số lượng item lướt
  };

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState(null);
    const [newArrivals, setNewArrivals] = useState(null);
    const [ activeTab, setActiveTab ] = useState(0);
    const [products, setProducts ] = useState(null);

    useEffect(() => {
        Promise.all(
            [
                product.getAllProduct({ sort: '-sold', limit: '10'}),
                product.getAllProduct({ sort: '-createdAt', limit: '10'})
            ]
        )
        .then(response => {
            setBestSeller(response[0].data.data);
            setProducts(response[0].data.data);
            setNewArrivals(response[1].data.data);
        })
        .catch(error => {
            console.error(`Đã có lỗi ${ error }`);
        })
    }, []);

    useEffect(() => {
        if(activeTab === 1 || activeTab === 0) {
            setProducts(bestSeller);
        }
        if(activeTab === 2) {
            setProducts(newArrivals);
        }
    }, [activeTab]);

    const tab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className='h-[100%]'>
            <div className='flex text-[20px] gap-8 pb-4 border-b border-main overflow-x-auto'>
                {
                    tabs.map(el => (
                        <span
                            key={el.id}
                            className = {`${activeTab === el.id ? 'text-black' : 'text-gray-500'}  font-semibold cursor-pointer uppercase border-r border-basic pr-[20px]`}
                            onClick={() => { setActiveTab(activeTab !== el.id ? el.id : 1)}}
                        >
                            {el.name}
                        </span>
                    ))
                }
            </div>
            <div className='mt-4 max-w-[908px]'>
                <Slider {...settings}>
                    {
                        products?.map(el => (
                            <ProductCard 
                                key={el._id}
                                productData={el}
                                label={tab? tab.label : 'Hot'}
                            />
                        ))
                    }
                   
                </Slider>
            </div>

        </div>
    );

}

export default BestSeller;