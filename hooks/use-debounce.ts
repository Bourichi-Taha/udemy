import React, { useEffect, useState } from 'react'

export function UseDebounce<T>(value:T,delay?:number): T {
  
    const [debounceValue,setDebounceValue] = useState<T>(value);

    useEffect(()=> {
        const timer = setTimeout(()=> setDebounceValue(value), delay || 500);
        return ()=>{
            clearTimeout(timer);
        }
    },[value,delay]);

    return debounceValue;


}

export default UseDebounce