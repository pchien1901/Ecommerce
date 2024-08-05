import React, { useState, useEffect } from 'react';
import { getAllProductCategories } from '../apis/app';
import { NavLink } from 'react-router-dom';
import { createSlug } from '../ultis/helper';

const Sidebar = () => {
    const [categories, setCategories] = useState(null);

    // Gọi api lấy tất cả product categories
    let getProductCategories = async () => {
        try {
            let allProductCategories = await getAllProductCategories();
            if(allProductCategories?.success) {
                setCategories(allProductCategories.data);
            }
        } catch (error) {
            console.error( `Đã xảy ra lỗi ${error}`);
        }
    }
    useEffect( () => {
        getProductCategories();
    }, []);
    return (
        <div className='flex flex-col'>
            {
                categories?.map(el => (
                    <NavLink 
                        key={el._id} 
                        to={createSlug(el.title)}
                        className={({ isActive }) => `px-5 pt-[15px] pb-[14px] text-[14px] hover:text-main ${ isActive ? 'text-main' : ''}`}
                    >
                        {el.title}
                    </NavLink>
                ))
            }
        </div>
    );
}

export default Sidebar;