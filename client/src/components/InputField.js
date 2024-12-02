import React from 'react';

const InputField = ({value, setValue, nameKey, type, invalidFiedls, setInvalidFields} ) => {
  return (
    <div className='w-full relative'>
      {value.trim() !== '' && <label className='text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block bg-inherit px-2'>{nameKey}</label>}
      <input 
        type={type || 'text'}
        className='px-4 py-2 rounded-sm border border-basic outline-none w-full my-2 placeholder:text-sm placeholder:capitalize'
        placeholder={nameKey}
        value={value}
        onChange={(e) => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
      />
    </div>
  )
}

export default InputField;