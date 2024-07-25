import { useEffect, useState } from "react";
import { IoLogoGithub } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { IoMail } from "react-icons/io5";


export const SideBarMovile = ({state,setState}) => {

    
    return ( 
        <div className={`absolute flex w-full top-0 left-0 sm:hidden transform  duration-300
            ${state ? 'translate-x-0' : '-translate-x-full'}   z-20

        `} >
            <div className=" w-80 h-screen flex flex-col bg-[rgba(0,29,50,255)]">  
                <div className="w-full h-14"></div>
                <div className="flex text-3xl font-macondo font-bold gap-2 mt-8 ml-10 text-[rgb(221,237,115,255)] text-aura-parentesis">/*</div>
                <div className="flex flex-col  items-center">
                <a
                        href="https://www.linkedin.com/in/juliangomez060/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLinkedin className="text-7xl text-white icon-shadow" />
                    </a>
                    <div className="flex text-3xl font-macondo font-bold gap-2 mt-2">
                        <div className=" text-[rgb(194,153,248,255)] cursor-default text-aura-parentesis">&#91; </div>
                        <div className=" text-white cursor-default text-aura1"> Linkedin</div>
                        <div className="text-[rgb(194,153,248,255)] cursor-default text-aura-parentesis">&#93;</div>
                    </div>
                    <a
                        href="https://github.com/julian98789"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IoLogoGithub className="text-7xl text-white icon-shadow mt-8" />
                    </a>
                    <div className="flex text-3xl font-macondo font-bold gap-2 mt-2">
                        <div className=" text-[rgb(175,211,102,255)] cursor-default text-aura-corchetes">&#40; </div>
                        <div className=" text-white cursor-default text-aura1"> Git Hub</div>
                        <div className="text-[rgb(175,211,102,255)] cursor-default text-aura-corchetes">&#41;</div>
                    </div>
                    <a href="mailto:julianestebangomez06@gmail.com">
                        <IoMail className="text-7xl text-white icon-shadow mt-8" />
                    </a>
                    <div className="flex text-3xl font-macondo font-bold gap-2 mt-2">
                        <div className=" text-[rgb(255,183,163,255)] cursor-default text-aura-menor-mayor">&lt; </div>
                        <div className=" text-white cursor-default text-aura1"> Correo</div>
                        <div className="text-[rgb(255,183,163,255)] cursor-default text-aura-menor-mayor">&gt;</div>
                    </div>
                    
                </div>
                <div className="flex text-3xl font-macondo font-bold gap-2 mt-2 ml-10 text-[rgb(221,237,115,255)] text-aura-parentesis">*/</div>

            </div>
            <div onClick={()=>setState(!state)} 
            className={`h-screen w-[calc(100%-288px)] bg-[rgba(235,231,231,0.2)] 
            `}></div>
        </div> 
    );
}