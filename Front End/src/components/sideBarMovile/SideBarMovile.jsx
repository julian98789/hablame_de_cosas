import { useEffect, useState } from "react";



export const SideBarMovile = ({state,setState}) => {

    
    return ( 
        <div className={`absolute flex w-full top-0 left-0 sm:hidden transform  duration-300
            ${state ? 'translate-x-0' : '-translate-x-full'}  

        `}>
            <div className=" w-80 h-screen flex flex-col bg-[rgba(0,29,50,255)]">  
                <div className="w-full h-14"></div>
                <div className="">dfasfsda</div>
            </div>
            <div onClick={()=>setState(!state)} 
            className={`h-screen w-[calc(100%-288px)] bg-[rgba(235,231,231,0.2)] 
            `}></div>
        </div> 
    );
}