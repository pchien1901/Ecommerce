import React, { useState, useEffect } from 'react';
import { getProduct } from "../apis/product";
import { useDispatch, useSelector } from 'react-redux';
import ProductSlider from './ProductSlider';
import { getProductCategories } from '../store/app/asyncAction';

const NewArrivalsByCategory = () => {
    const { productCategories } = useSelector(state => state.app);
    const [products, setProducts] = useState(null);
    const [phones, setPhones] = useState(null);
    const [laptops, setLaptops] = useState(null);
    const [tablets, setTablets] = useState(null);
    const [ activeTab, setActiveTab ] = useState(0);

    let phone = null, laptop = null, tablet = null;
    let tabs = [];
    
    // phone = productCategories?.find(el => el.title.toUpperCase() === 'SMARTPHONE');
    // laptop = productCategories?.find(el => el.title.toUpperCase() === 'LAPTOP');
    // tablet = productCategories?.find(el => el.title.toUpperCase() === 'TABLET');

    tabs = [
        { id: 1, name: 'Smartphone', label:'New', _id: ''},
        { id: 2, name: 'Laptop', label:'New', _id: ''},
        { id: 3, name: 'Tablet', label:'New', _id: ''},
    ];

    /**
     * Gọi api
     */
    const fetchData = () => {
        console.log('productCategories: ', productCategories);
        if(productCategories?.length) {
            let phoneId = productCategories.find(el => el.title.toUpperCase() === 'SMARTPHONE');
            let laptopId = productCategories.find(el => el.title.toUpperCase() === 'LAPTOP');
            let tabletId = productCategories.find(el => el.title.toUpperCase() === 'TABLET');
            tabs[0]._id = phoneId._id;
            tabs[1]._id = laptopId._id;
            tabs[2]._id = tabletId._id;


            Promise.all([
                getProduct({ sort: '-createdAt', limit: '10', category: phoneId}), // Lấy 10 sản phẩm mới của smartphone
                getProduct({ sort: '-createdAt', limit: '10', category: laptopId}), // Lấy 10 sản phẩm mới của laptop
                getProduct({ sort: '-createdAt', limit: '10', category: tabletId}), // Lấy 10 sản phẩm mới của tablet
            ])
            .then(response => {
                setPhones(response[0].data);
                setLaptops(response[1].data);
                setTablets(response[2].data);
                setProducts(response[0].data);
            })
            .catch(error => {
                console.error(`Đã có lỗi khi gọi api tại NewArrivalsByCategory ${error}`);
            })
        }
        else {
            Promise.all([
                getProduct({ sort: '-createdAt', limit: '10'}), // Lấy 10 sản phẩm mới của smartphone
                getProduct({ sort: '-createdAt', limit: '10'}), // Lấy 10 sản phẩm mới của laptop
                getProduct({ sort: '-createdAt', limit: '10'}), // Lấy 10 sản phẩm mới của tablet
            ])
            .then(response => {
                setPhones(response[0].data);
                setLaptops(response[1].data);
                setTablets(response[2].data);
                setProducts(response[0].data);
            })
            .catch(error => {
                console.error(`Đã có lỗi khi gọi api tại NewArrivalsByCategory ${error}`);
            })
        }
    }

    // Gọi lần đầu khi component mount
    useEffect(() => {
        fetchData();
    }, []);

    // quản lý loại sản phẩm nào sẽ hiện trên slider
    useEffect(() => {
        console.log('tabs[0]._id: ', tabs[0]._id);
        // if(productCategories?.length && tabs[0]._id === '' && tabs[1]._id === '' && tabs[2]._id === '') {
        //     let phoneId = productCategories.find(el => el.title.toUpperCase() === 'SMARTPHONE');
        //     let laptopId = productCategories.find(el => el.title.toUpperCase() === 'LAPTOP');
        //     let tabletId = productCategories.find(el => el.title.toUpperCase() === 'TABLET');

        //     Promise.all([
        //         getProduct({ sort: '-createdAt', limit: '10', category: phoneId}), // Lấy 10 sản phẩm mới của smartphone
        //         getProduct({ sort: '-createdAt', limit: '10', category: laptopId}), // Lấy 10 sản phẩm mới của laptop
        //         getProduct({ sort: '-createdAt', limit: '10', category: tabletId}), // Lấy 10 sản phẩm mới của tablet
        //     ])
        //     .then(response => {
        //         setPhones(response[0].data);
        //         setLaptops(response[1].data);
        //         setTablets(response[2].data);
        //     })
        //     .catch(error => {
        //         console.error(`Đã có lỗi khi gọi api tại NewArrivalsByCategory ${error}`);
        //     })
        // }
        switch(activeTab) {
            case 0:
            case 1:
                phones && setProducts(phones);
                break;
            case 2:
                laptops && setProducts(laptops);
                break;
            case 3:
                tablets && setProducts(tablets);
                break;
            default:
                phones && setProducts(phones);
                break;
        }
    }, [activeTab, phones, laptops, tablets]);

    const tab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className='h-[100%]'>
            <div className='flex justify-between pb-4 border-b border-main overflow-x-auto'>
                <span className='text-gray-500 font-semibold uppercase text-[20px]'>New Arrivals</span>
                <div className=''>
                    {
                        tabs.map(el => (
                            <span 
                                key={el.id} 
                                className={`${activeTab === el.id ? 'text-main' : 'text-[#808080]'} text-sm pr-5 pl-3 border-r border-basic cursor-pointer`}
                                onClick={() => { setActiveTab(el.id);}}    
                            >
                                {el.name}
                            </span>
                        ))
                    }
                </div>
            </div>
            <div className='mt-4 max-w-[1220px]'>
                <ProductSlider products={products} tab={tab} size='lg' />
            </div>
        </div>
    );
}

export default NewArrivalsByCategory;