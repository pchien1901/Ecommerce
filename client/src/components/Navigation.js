import React from 'react';
import { navigation } from '../ultis/constant';
import { NavLink } from 'react-router-dom';
import icons from '../ultis/icon';

const Navigation = () => {
    const { RiArrowDropDownFill } = icons
    return (
        <div className='w-main h-[48px] py-2 border text-sm flex items-center'>
            {
                navigation.map(el => (
                    <NavLink 
                        to={el.path}
                        key={el.id}  
                        className={
                            ({ isActive }) => isActive ? 'pr-[30px] flex items-center text-main hover:text-main' : 'pr-[30px] flex items-center hover:text-main'
                        }  
                    >
                        {el.value}
                        <RiArrowDropDownFill className='pl-[5px] text-[25px]' />
                    </NavLink>
                    )            
                )
            }
        </div>
    );
}

export default Navigation;