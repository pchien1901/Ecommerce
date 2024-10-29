import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import icons from "../ultis/icon";

const HotCollections = () => {
  const { productCategories } = useSelector((state) => state.app);
  const tempCategories = { ...productCategories }; // tạo object mới để gắn thêm brand vào
  const [categories, setCategories] = useState(null);


  // icon
  const { FaAngleRight } = icons;

  return (
    <div className="h-[100%]">
      <div className="justify-between pb-4 border-b border-main ">
        <span className="text-gray-500 font-semibold uppercase text-[20px]">
          Hot Collections
        </span>
      </div>
      <div className="mt-4 h-[80%] overflow-y-auto home__sidebar">
        <div className="grid grid-cols-3 gap-5">
          {productCategories?.map((category) => (
            <div
              key={category._id}
              className="w-[1/3] h-[230px] flex p-[15px] box-border border border-basic"
            >
              <div className="left-image w-[100px] h-[100px] object-contain flex-1">
                <img src={category.image} alt="true" />
              </div>
              <div className="right-list pl-5 flex-1">
                <div className="mb-[5px] font-semibold">{category.title}</div>
                <ul className="h-[150px] overflow-auto home__sidebar">
                  {category?.brands?.map((el) => (
                    <li key={el._id} className="mb-[5px] flex items-center text-pure-black text-opacity-70 hover:text-main active:text-color-40-dark cursor-pointer">
                      <span>
                        <FaAngleRight />
                      </span>
                      {el.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotCollections;
