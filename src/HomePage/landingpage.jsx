import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';

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

export default function Landingpage() {
    const [sidebar, setSidebar] = useState(true);
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

    return (
        <div className="webbody">
            <div className="heading">
                <div className="jjefjdf">
                    <div className="ejjnejfkd" onClick={() => setSidebar(!sidebar)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" fill='black'>
                            <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path>
                        </svg>
                    </div>
                    <Link to={"/"}>
                        <div className="kejfkf">
                            <img src="https://vidtube-sable.vercel.app/assets/logo-koDzNJgp.png" alt="" height={"30px"} width={"130px"} />
                        </div>
                    </Link>
                    <div className="searchbar">
                        <input type="text" placeholder='  Search' className="jjejfjekf" />
                    </div>
                    <Link>
                        <div className="inkfjekfe">
                            <div className="jfnjjwdw">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true"><path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z"></path></svg>
                            </div>
                        </div>
                    </Link>
                    <div style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }} onClick={() => {
                        user ? <></> : handleSignIn();
                    }}>

                        {
                            user ? <div className='ekhbfehf'>
                                <img src={photourl} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                            </div> : <div className="kjefkjfl">
                                Sign in
                            </div>
                        }
                    </div>
                </div>
            </div>
            {
                sidebar ? <Sidebar /> : <ShortSidebar />
            }
        </div>
    );
}
