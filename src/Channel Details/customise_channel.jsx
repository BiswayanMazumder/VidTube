import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
import { arrayRemove, arrayUnion, doc, Firestore, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import Header from '../Components/header';
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

export default function Customise_channel() {
    const { userId } = useParams();
    useEffect(() => {
        document.title = 'Channel customization - Vidtube Studio'
        if (!auth.currentUser) {
            window.location.replace('/')
        }
    })
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [subs, setSubs] = useState([]);
    const [vidData, setVidData] = useState([]);
    const [videoCount, setVideoCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentuser, setCurrentUser] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const fetchUserData = async () => {
        try {
            const docRef = doc(db, 'User Details', userId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setName(userData.Username);
                setBio(userData.Bio);
            }

            const coverDocRef = doc(db, 'User Cover Pictures', userId);
            const coverDocSnapshot = await getDoc(coverDocRef);
            if (coverDocSnapshot.exists()) {
                const coverData = coverDocSnapshot.data();
                setCoverPic(coverData['Cover Pic']);
            }

            const subDocRef = doc(db, 'Subscribers', userId);
            const subDocSnapshot = await getDoc(subDocRef);
            if (subDocSnapshot.exists()) {
                const subData = subDocSnapshot.data();
                setSubs(subData['Subscriber UIDs']);
            }

            const profileDocRef = doc(db, 'User Profile Pictures', userId);
            const profileDocSnapshot = await getDoc(profileDocRef);
            if (profileDocSnapshot.exists()) {
                const profileData = profileDocSnapshot.data();
                setDp(profileData['Profile Pic']);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, [userId]);
    return (
        <div className='webbody'>
            <Header />
            <div className="rjgjrgrkjg">
                <div className="heading">
                    <div className="jrhgrjg">
                        Banner Image
                    </div>
                    <br />
                    <div className="sjjcc">
                        This image will appear across the top of your channel
                    </div>
                </div>
                <br />
                <div className="ehfejkej">
                    <div className="ehjehdj" style={{borderRadius: '10px'}}>
                        <img src={coverPic} alt="" height={'160px'} width={'290px'} style={{borderRadius: '10px'}}/>
                    </div>
                    <div className="hhbjhdn">
                        For the best results on all devices, use an image that’s at least 2048 x 1152 pixels and 6MB or less.
                        <Link style={{ textDecoration: 'none', color: 'black' }}>
                            <div className="effkf">
                                Upload
                            </div>
                        </Link>
                    </div>
                </div>
                <br /><br />
                <div className="heading">
                    <div className="jrhgrjg">
                        Picture
                    </div>
                    <br />
                    <div className="sjjcc">
                        Your profile picture will appear where your channel is presented on VidTube, like next to your videos and comments
                    </div>
                </div>
                <br />
                <div className="ehfejkej">
                    <div className="ehjehdj" style={{display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius: '10px'}}>
                        <img src={dp} alt="" height={'100px'} width={'100px'} style={{ borderRadius: '50%' }}/>
                    </div>
                    <div className="hhbjhdn">
                    It’s recommended to use a picture that’s at least 98 x 98 pixels and 4MB or less. 
                        <Link style={{ textDecoration: 'none', color: 'black' }}>
                            <div className="effkf">
                                Upload
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
