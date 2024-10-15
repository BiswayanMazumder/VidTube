import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
export default function Header() {
    const [premium, setpremium] = useState(false);
    const [isnightmode, setnightmode] = useState(true);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const docRef = doc(db, 'Premium Users', auth.currentUser.uid);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const videoData = docSnapshot.data();
                    setpremium(videoData['Premium User']);
                }
            } catch (error) {
                console.error(error);
            }
        };
        console.log('prem', premium);
        fetchVideoData();
    })
    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // console.log('User signed in:', user);
            // You can save user data or redirect after sign-in
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };
    const [user, setuser] = useState(false);
    const [photourl, setphotourl] = useState('');
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                setuser(true);
                setphotourl(user.photoURL);              //...
                const uid = user.uid;
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    });
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully');
            window.location.replace('/');
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setuser(true);
                    setphotourl(user.photoURL);              //...
                    const uid = user.uid;
                    // ...
                } else {
                    // User is signed out
                    // ...
                    setuser(false);
                    // setphotourl('');
                }
            });
            // You can redirect or update UI after sign-out
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };
    const [isNightMode, setNightMode] = useState(true);
    useEffect(() => {
        const nightMode = localStorage.getItem('nightmode') === 'true';
        setNightMode(nightMode);
    }, []);

    const toggleNightMode = () => {
        setNightMode(prev => {
            const newNightMode = !prev;
            localStorage.setItem('nightmode', newNightMode);
            return newNightMode;
        });
    };
    return (

        <div className="heading">
            <div className="jjefjdf">
                <Link>
                    <div className="ejjnejfkd">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" fill='black'><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path></svg> */}
                    </div>
                </Link>
                <Link to={"/"}>
                    <div className="kejfkf" >
                        <img src={premium ? "https://as2.ftcdn.net/v2/jpg/04/69/69/17/1000_F_469691792_MfkrxlGuUkHsztMOuCo7CvADeyvhGihm.jpg" : "https://vidtube-sable.vercel.app/assets/logo-koDzNJgp.png"} alt="" height={"30px"} width={"130px"} />
                    </div>
                </Link>
                <div className="searchbar">
                    <input type="text" placeholder='  Search' className="jjejfjekf" />
                </div>
                {/* <div className="kenfkemn">
                    <Link onClick={toggleNightMode}>
                        { !isNightMode ? (
                            <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="black" d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path>
                            </svg>
                        ) : (
                            <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="white" d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"></path>
                            </svg>
                        )}
                    </Link>
                </div> */}

                <Link style={{ textDecoration: 'none', color: 'black' }}>

                    <div style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }} onClick={() => {
                        user ? handleSignOut() : handleSignIn();
                    }}>
                        {
                            user ? <div className='ekhbfehf'>
                                <img src={photourl} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                            </div> : <div className="kjefkjfl">
                                Sign in
                            </div>
                        }
                    </div>
                </Link>
            </div>
        </div>
    )
}
