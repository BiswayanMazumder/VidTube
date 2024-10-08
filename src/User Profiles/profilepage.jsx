// import React, { useEffect } from 'react'
import Header from '../Components/header'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
import { doc, getDoc, getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCUNVwpGBz1HUQs8Y9Ab-I_Nu4pPbeixmY",
    authDomain: "pixelprowess69.firebaseapp.com",
    projectId: "pixelprowess69",
    storageBucket: "pixelprowess69.appspot.com",
    messagingSenderId: "785469951781",
    appId: "1:785469951781:web:e5b45a44c5ec5f44d0d4cc",
    measurementId: "G-TZ5WZEQPZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export default function Profilepage() {
    const uploader = localStorage.getItem('userid')

    const [dp, setdp] = useState('');
    const [name, setname] = useState('');
    const [coverpic, setcoverpic] = useState('');
    // const [name, setname] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'User Details', uploader);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const videoData = docSnapshot.data();
                    setname(videoData.Username)
                }
                // console.log('Name',name)
            } catch (error) {
                console.log(error)
            }
            try {
                const docRefs = doc(db, 'User Cover Pictures', uploader);
                const docSnapshots = await getDoc(docRefs);
                if (docSnapshots.exists()) {
                    const videoDatas = docSnapshots.data();
                    setcoverpic(videoDatas['Cover Pic'])
                }
                // console.log('CP',coverpic)
            } catch (error) {
                console.log(error)
            }
            try {
                const docRefss = doc(db, 'User Profile Pictures', uploader);
                const docSnapshotss = await getDoc(docRefss);
                if (docSnapshotss.exists()) {
                    const videoDatass = docSnapshotss.data();
                    setdp(videoDatass['Profile Pic'])
                }
                // console.log('CP',dp)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    })
    useEffect(() => {
        document.title = `${name} - VidTube`
    })
    return (
        <div>
            <Header />
            <div className="videobody">
                <div className='coverpic'>
                    <img
                        src={coverpic}
                        alt=""
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                </div>
                <div className="coverpic" style={{marginTop:'-20px',display:'flex',flexDirection:'row',justifyContent:'start',alignItems:'start'}}>
                    <div className="profilepic">
                        <img src={dp} alt="" height={"150px"} width={"150px"} style={{borderRadius:'50%'}} />
                    </div>
                    <div className="jkfnjvjfkvkfl">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
