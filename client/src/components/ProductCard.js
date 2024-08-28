import React from 'react';
import img from '../assets/productCommingSoon.png'
import icons from '../ultis/icon';
const label = {

}

/**
 * 
 * @param {*} props :
 *      - productData: dữ liệu của product
 *        {
 *          "_id": "66a534a35b00881617261da5",
            "title": "USB SANDISK",
            "description": [
                "Read Speed: up to 130 MB/s",
                "Generation: USB 3.0",
                "Dimensions: 13.21 mm x 42.42 mm x 6.60 mm",
                "Operating temperature: 32° - 113°",
                "Storage temperature: 0° - 158°",
                "5-year limited warranty"
            ],
            "price": 177231,
            "quantity": 595,
            "sold": 98,
            "thumb": "https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811",
            "images": [
                "https://digital-world-2.myshopify.com/cdn/shop/products/z4_1b6e3a93-aa84-4a15-8324-deab9b1d4711_1024x1024.jpg?v=1491404811",
                "https://digital-world-2.myshopify.com/cdn/shop/products/z5_1024x1024.jpg?v=1491404811"
            ],
            "totalRatings": 0,
            "attributes": [
                {
                    "label": "Capacity",
                    "value": "16GB",
                    "_id": "66a534a35b00881617261da7"
                }
            ],
            "ratings": [],
            "createdAt": "2024-07-27T17:55:47.191Z",
            "updatedAt": "2024-07-27T17:55:47.196Z",
            "__v": 1,
            "slug": "usb-sandisk-66a534a35b00881617261da5"
 * 
 *         } 
 * @returns 
 */
const ProductCard = ({ productData, label }) => {
    console.log(label);
    const { PiShootingStarFill, PiShootingStarLight } = icons;
    return (
        <div className='min-w-[230px] max-w-[295px] pl-[20px]'>
            <div className='min-w-[225px] max-w-[275px] border border-basic p-[15px] mb-[20px]'>
                <div className='product__image relative'>
                    <img src={ productData?.thumb || img} alt='true' className='w-full min-h-[198px] max-h-[243px] object-contain'/>
                    <div className='product__label absolute top-[-10px] left-[-10px]'>
                        <div className='label__name box-border'>
                            <span className={`label w-[50px] h-[25px] pt-[6px] pb-[5px] bg-color-50-light text-white text-[10px] font-semibold text-center ${label ? "inline-block" : "hidden"}`}>
                                { label ? label : ''}
                            </span>
                        </div>
                    </div>
                    <ul className='action-button'>
                        <li className='wishlist'></li>
                        <li className='add-to-cart'></li>
                        <li className='quick-view'></li>
                        <li></li>
                    </ul>
                </div>
                <div className='pt-[15px] pb-[6px] truncate w-[190px] font-main text-[16px] font-normal hover:text-main' title={productData?.title}>{productData?.title}</div>
                <div className='product__price mb-[10px]'>
                    <span className='money font-main text-[16px] font-normal mb-[10px]'>
                        { new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productData.price) }
                    </span>
                </div>
                <div className='rating-star flex justify-start'>
                    <div className='pr-2 text-color-20-light text-[20px]'>
                        {
                            productData.totalRatings > 0 ? <PiShootingStarFill /> : <PiShootingStarLight />
                        }
                    </div>
                    <div className='text-[13px] text-pure-black'>{productData.totalRatings > 0 ? productData.totalRatings : 'No reviews yet'}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;