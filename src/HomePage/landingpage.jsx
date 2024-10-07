import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Header from '../Components/header';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
export default function Landingpage() {
    const [sidebar,setsidebar]=useState(true);
    return (
        <div className="webbody">
             <div className="heading">
                <div className="jjefjdf">
                    <Link>
                        <div className="ejjnejfkd" onClick={() => setsidebar(!sidebar)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" fill='black'><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path></svg>
                        </div>
                    </Link>
                    <Link to={"/"}>
                        <div className="kejfkf" >
                            <img src="https://vidtube-sable.vercel.app/assets/logo-koDzNJgp.png" alt="" height={"30px"} width={"130px"} />
                        </div>
                    </Link>
                    <div className="searchbar">
                        <input type="text" placeholder='  Search' className="jjejfjekf" />
                    </div>
                    <Link style={{ textDecoration: 'none', color: 'black' }}>
                    <div className="kjefkjfl">
                        Sign in
                    </div>
                    </Link>
                </div>
            </div>
            {
                sidebar?<Sidebar />:<ShortSidebar/>
            }
        </div>
    )
}
