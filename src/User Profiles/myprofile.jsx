import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import Header from '../Components/header';
import Aboutpage from './aboutpage';
import VideosHomepage from './videoshomepage';
import VideoSection from './videospage';
import Communitypage from './communitypage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Playlistpage from './playlistpage';

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
const db = getFirestore(app);
const auth = getAuth(app);
export default function Myprofile() {
    const { userId } = useParams();

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
    }, [userId])
    return (
        <div className='webbody'>
            <Header />
            <div className="jefkjc">
                <div className="dnhvjdfdkj">
                    <div className="ehfjf">
                        <img src={dp} alt="" height={'100px'} width={'100px'} style={{ borderRadius: '50%' }} />
                    </div>
                    <div className="fkdfjd">
                        <div>
                        {name}
                        </div>
                        <div className="kjfd" style={{marginTop: '10px',fontWeight: '300',display: 'flex',gap: '15px',flexDirection: 'row'}}>
                            <div>
                            @{auth.currentUser.displayName}
                            </div> 
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${auth.currentUser.uid}`}>
                                View Channel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
