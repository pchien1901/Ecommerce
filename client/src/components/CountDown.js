import React, { memo } from "react";

/**
 * props :
 *  + unit : tag thời gian hiển thị
 *  + number: giá trị thời gian hiển thị
 */

/**
 * component hiển thị thành phần hiển thị giá trị thời gian và tag thời tian
 * @returns {jsx} CountDown
 * @author PMChien()
 */
const CountDown = ({unit = 'time', number = 0}) => {
    return (
        <div className="w-[30%] h-[60px] border border-basic flex flex-col justify-center items-center rounded-lg bg-[#f4f4f4]">
            <span className="text-[18px] text-gray-800">{ number ? number : 0 }</span>
            <span className="text-xs text-gray-700">{ unit ? unit : 'time' }</span>
        </div>
    )
}

export default memo(CountDown);