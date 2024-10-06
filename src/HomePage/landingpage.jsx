import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../Components/header';
import Sidebar from '../Components/sidebar';
export default function Landingpage() {
    return (
        <div className="webbody">
            <Header />
            <Sidebar />
        </div>
    )
}
