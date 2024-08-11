import React, { useState, useEffect } from 'react';
//import { getAllProductCategories } from '../apis/app';
import { NavLink } from 'react-router-dom';
import { createSlug } from '../ultis/helper';
import icons from "../ultis/icon";
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { productCategories } = useSelector(state => state.app);
    //let productCategories = null;
    const { TfiMenuAlt } = icons;
    return (
        <div className='flex flex-col h-[100%] border border-basic'>
            <div className='flex items-center text-base font-semibold bg-main text-white px-5 py-[10px]'>
                <span  className='pr-[10px]'>
                    <TfiMenuAlt />
                </span>
                <span>ALL COLLECTIONS</span>
            </div>
            <div className='overflow-y-auto flex flex-col flex-1 home__sidebar'>
                {
                    productCategories?.map(el => (
                        <NavLink 
                            key={el._id} 
                            to={createSlug(el.title)}
                            className={({ isActive }) => `px-5 pt-[15px] pb-[14px] text-[14px] hover:text-main ${ isActive ? 'text-main' : ''}`}
                        >
                            {el.title}
                        </NavLink>
                        
                    ))
                }
                {
                    productCategories?.map(el => (
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
        </div>
    );
}

export default Sidebar;