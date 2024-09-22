import React, { useState, useEffect } from 'react';
import { getProduct } from '../apis/product';
import { renderStarFromNumber, formatCurrency } from '../ultis/helper';

const FeaturedProduct = () => {
    const  [products, setProducts] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, []);

    /**
     * Lấy dữ liệu featured product
     */
    const fetchProduct = async () => {
        try {
            const res = await getProduct({sort: '-totalRatings -sold', limit: '9'});
            let featuredProduct = res.data;
            setProducts(featuredProduct);
        }
        catch (error) {
            console.error(`Đã xảy ra lỗi ${error}`);
        }
    }

    return (
        <div className='h-full'>
            <div className='text-[20px] pb-4 border-b border-main mb-[15px]'>
                <span className='text-gray-500 font-semibold uppercase'>Featured product</span>
            </div>
            <div className='grid grid-cols-3 grid-rows-3 gap-5'>
                {
                    products?.map(product => (
                        <div key={product._id} className='flex border border-basic box-border p-[15px]'>
                            <div className='w-[85px] object-contain'>
                                <img src={product.thumb} alt='true'/>
                            </div>
                            <div className='ml-8'>
                                <div className='pt-[15px] pb-[6px] truncate w-[190px] font-main text-[16px] font-normal hover:text-main' title={product?.title}>{product?.title}</div>
                                <div className='flex h-4 mb-[10px]'>{ renderStarFromNumber(product?.totalRatings, 16, 'text-color-20-light' )}</div>
                                <div className='product__price mb-[10px]'>
                                    <span className='money font-main text-[16px] font-normal mb-[10px]'>
                                        { formatCurrency(product.price) }
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
       
    )
}

export default FeaturedProduct;