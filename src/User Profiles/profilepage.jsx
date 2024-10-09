import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from '../Components/header';
import Aboutpage from './aboutpage';
import Videospage from './videoshomepage';
import VideosHomepage from './videoshomepage';
import VideoSection from './videospage';

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

export default function ProfilePage() {
    const { userId } = useParams();
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [subs, setSubs] = useState([]);
    const [vidData, setVidData] = useState([]);
    const [videoCount, setVideoCount] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
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

        const fetchData = async () => {
            try {
                console.log("Fetching VID data...");
                const docRef = doc(db, 'Global VIDs', 'VIDs');
                const docSnapshot = await getDoc(docRef);
                let count = 0;

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setVidData(data.VID);

                    for (let i = 0; i < data.VID.length; i++) {
                        const videoRef = doc(db, 'Global Post', data.VID[i]);
                        const videoDoc = await getDoc(videoRef);

                        if (videoDoc.exists()) {
                            const videoData = videoDoc.data();
                            const uploader = videoData['Uploaded UID'];

                            if (uploader === userId) {
                                count += 1;
                            }
                        } else {
                            console.log(`Video not found for VID: ${data.VID[i]}`);
                        }
                    }
                    setVideoCount(count);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const loadData = async () => {
            setLoading(true); // Start loading
            await Promise.all([fetchUserData(), fetchData()]);
            setLoading(false); // End loading
        };

        loadData();
    }, [userId]);

    useEffect(() => {
        document.title = `${name} - VidTube`;
    }, [name]);
    const [activeTab, setActiveTab] = useState('home');
    return (
        <div>
            <Header />
            {loading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '5px', backgroundColor: 'red', animation: 'loading 1s infinite'
                }} />
            )}
            <div className="videobody">
                <div className='coverpic'>
                    <img
                        src={coverPic}
                        alt=""
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: "10px" }}
                    />
                </div>
                <div className="coverpic" style={{ marginTop: '-20px', display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'start' }}>
                    <div className="profilepic">
                        <img src={dp} alt="" height={"150px"} width={"150px"} style={{ borderRadius: '50%' }} />
                    </div>
                    <div style={{ marginLeft: '10px', marginTop: "20px" }}>
                        <div style={{ fontWeight: "600", fontSize: "22px" }}>
                            {name}
                        </div>
                        <div style={{ marginTop: "10px", color: "gray", fontSize: "15px" }}>
                            {
                                subs.length === 0 ? 'No subscribers' : subs.length > 1 ? `${subs.length} subscribers` : `${subs.length} subscriber`
                            }   •   {
                                videoCount === 0 ? '    No videos' : videoCount > 1 ? `    ${videoCount} videos` : `    ${videoCount} video`
                            }
                        </div>
                        <div style={{ marginTop: "10px", color: "gray", fontSize: "15px" }}>
                            {bio}
                        </div>
                        <div className="knrgjnfkg">
                            <Link style={{ textDecoration: 'none', color: 'white' }}>
                                <div className='hebfjenk'>
                                    <center>Subscribe</center>
                                </div>
                            </Link>
                            <Link style={{ textDecoration: 'none', color: 'black' }}>
                                <div className='hebfjenk' style={{ backgroundColor: 'transparent', color: 'black', border: '0.5px solid black' }}>
                                    <center>Join</center>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="irfjkfjlvf">
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'home' ? 'black' : 'grey' }}
                        onClick={() => setActiveTab('home')}
                    >
                        <div className="jjnffkmkm">
                            Home
                            {activeTab === 'home' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'video' ? 'black' : 'grey' }}
                        onClick={() => {
                            setActiveTab('video')
                            console.log('Active',setActiveTab);
                        }}
                    >
                        <div className="jjnffkmkm">
                            Videos
                            {activeTab === 'video' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'comm' ? 'black' : 'grey' }}
                        onClick={() => setActiveTab('comm')}
                    >
                        <div className="jjnffkmkm">
                            Community
                            {activeTab === 'comm' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'about' ? 'black' : 'grey' }}
                        onClick={() => setActiveTab('about')}
                    >
                        <div className="jjnffkmkm">
                            About
                            {activeTab === 'about' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                </div>
                <div className="jhfjkfj">
                    {
                        activeTab === 'about' ? <Aboutpage /> :
                            activeTab === 'home' ? <VideosHomepage /> :
                                activeTab === 'video' ? <VideoSection /> :
                                    null
                    }
                </div>

            </div>
        </div>
    );
}
