import React from 'react';

/**
 * Component hình tròn hiện ra khi ProductCard được hover (máy tính) và active (mobile)
 * @param {object} props 
 * {
 *      icon: icon hiển thị trong component,
 *      className: tên class định nghĩa,
 *      title: Tên hiển thị khi hover lâu
 * }
 * @returns element được render
 * @author : PMChien (03/09/2024)
 */
const SelectOption = ({ icon, className, title }) => {
    return (
        <div 
            className={`${className ? className : ''} w-10 h-10 flex justify-center items-center rounded-full shadow-md border border-basic bg-pure-white text-color-50-light hover:bg-color-10-light hover:text-pure-white active:bg-color-20-dark active:text-pure-white cursor-pointer`} 
            title={`${title ? title : ''}`}
        >
            { icon }
        </div>
    )
}

export default SelectOption;