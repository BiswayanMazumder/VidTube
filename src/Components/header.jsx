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
    const [premium,setpremium]=useState(false);
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
        console.log('prem',premium);
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
                            <img src={premium?"https://as2.ftcdn.net/v2/jpg/04/69/69/17/1000_F_469691792_MfkrxlGuUkHsztMOuCo7CvADeyvhGihm.jpg":"https://vidtube-sable.vercel.app/assets/logo-koDzNJgp.png"} alt="" height={"30px"} width={"130px"} />
                        </div>
                    </Link>
                    <div className="searchbar">
                        <input type="text" placeholder='  Search' className="jjejfjekf" />
                    </div>
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
