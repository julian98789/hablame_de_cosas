import { SideBarMovile } from "../../components/sideBarMovile/SideBarMovile";
import { SideBar } from "../../components/sideBar/SideBar";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Chat } from "../../components/chat/Chat";



export const Home = () => {

    const [stateSideBar, setStateSideBar] = useState(false)

    return (
        <div className="flex  relative  ">
            <SideBarMovile state={stateSideBar} setState={setStateSideBar} />
            <SideBar state={stateSideBar} setState={setStateSideBar} />
            <div className="flex flex-col w-full">
                <div className="w-full h-14 md:h-5 px-3 flex gap-4 items-center">
                    <div
                        onClick={() => setStateSideBar(!stateSideBar)}
                        className="z-30  sm:hidden ">
                        <IoMenu className={`text-4xl ${stateSideBar ? 'text-neutral-200 ' : ''} `} />
                    </div>
                    <div className="z-30 sm:hidden text-2xl font-macondo font-bold">
                        {stateSideBar ? (
                            <>
                                <div className="flex items-center  gap-2">
                                    <div className="text-[rgb(93,211,209)] cursor-default text-aura2 inline">
                                        &#123;
                                    </div>
                                    <div className="text-white cursor-default text-aura1 inline mx-1">
                                        Hablame de cosas
                                    </div>
                                    <div className="text-[rgb(93,211,209)] cursor-default text-aura2 inline">
                                        &#125;
                                    </div>
                                </div>
                            </>
                        ) : (
                            'Hablame de cosas'
                        )}</div>
                </div>
                <div className=""><Chat /></div>
            </div>
        </div>
    );
}