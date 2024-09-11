import React, { memo } from "react";

/**
 * 
 * @returns 
 */
const CountDown = ({unit, number}) => {
    return (
        <div className="w-[30%] h-[60px] border border-basic flex flex-col justify-center items-center rounded-lg bg-[#f4f4f4]">
            <span className="text-[18px] text-gray-800">{ number }</span>
            <span className="text-xs text-gray-700">{ unit }</span>
        </div>
    )
}

export default memo(CountDown);