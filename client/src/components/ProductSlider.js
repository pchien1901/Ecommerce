import  React from 'react';
import Slider from 'react-slick';
import { ProductCard } from './index';

const settings = {
    dots: false, // dấu trắng dưới để biết đang ở đâu
    infinite: false, // có cho phép lướt vòng tròn không
    speed: 500, // Tốc độ lướt
    slidesToShow: 3, // số lượng item show
    slidesToScroll: 1 // số lượng item lướt
  };

/**
 * props:
 *  + products: mảng các sản phẩm sẽ hiển thị tại slider
 *  + tab: object thông tin về tab sản phẩm hiện tại { id: trường phân biệt, name: Tên hiển thị , label : Nhãn đưa vào product card}
 *  + size: kích thước của card
 */

/**
 * Component tạo slider sản phẩm
 * @prop {object} products - sản phẩm hiển thị,
 * @prop {object} tab - thông tin để tạo nhãn
 * @prop {object} size - kích thước của product card
 * Author: PMChien (22/09/2024)
 */
const ProductSlider = ({products, tab, size = 'md'}) => {
    return (
        <>
        {
            products && <Slider {...settings}>
            {
                products?.map(el => (
                    <ProductCard 
                        key={el._id}
                        productData={el}
                        label={tab? tab.label : 'Hot'}
                        size={size}
                    />
                ))
            }
            
        </Slider>
        }
        </>
    );
}

export default React.memo(ProductSlider);