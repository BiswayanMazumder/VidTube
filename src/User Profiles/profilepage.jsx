import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Header from '../Components/header';
import Aboutpage from './aboutpage';
import VideosHomepage from './videoshomepage';
import VideoSection from './videospage';
import Communitypage from './communitypage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

export default function ProfilePage() {
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

    const fetchData = async () => {
        try {
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
                    }
                }
                setVideoCount(count);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkSubscriptionStatus = async () => {
        if (auth.currentUser) {
            const subsRef = doc(db, 'Subscribers', userId);
            const subsDoc = await getDoc(subsRef);

            if (subsDoc.exists()) {
                const subsData = subsDoc.data();
                const subscriberUIDs = subsData['Subscriber UIDs'] || [];
                setSubscribed(subscriberUIDs.includes(auth.currentUser.uid));
                setSubs(subscriberUIDs);
            }
        }
    };

    const handleSubscribe = async () => {
        const subsRef = doc(db, 'Subscribers', userId);
        const subsDoc = await getDoc(subsRef);

        let subscriberUIDs = [];

        if (subsDoc.exists()) {
            subscriberUIDs = subsDoc.data()['Subscriber UIDs'] || [];
        }

        if (subscriberUIDs.includes(auth.currentUser.uid)) {
            subscriberUIDs = subscriberUIDs.filter(uid => uid !== auth.currentUser.uid);
        } else {
            subscriberUIDs.push(auth.currentUser.uid);
        }

        await updateDoc(subsRef, { 'Subscriber UIDs': subscriberUIDs });
        await checkSubscriptionStatus();
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchUserData(), fetchData(), checkSubscriptionStatus()]);
        setLoading(false);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setCurrentUser(uid === userId);
            } else {
                setCurrentUser(false);
            }
        });
    }, [userId]);

    useEffect(() => {
        loadData();
    }, [userId]);

    useEffect(() => {
        document.title = `${name} - VidTube`;
    }, [name]);

    const [activeTab, setActiveTab] = useState('home');
    const [communityPosts, setCommunityPosts] = useState([]);

    useEffect(() => {
        const fetchCommunityPosts = async () => {
            try {
                const docRef = doc(db, "Community Posts", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const subData = docSnap.data();
                    setCommunityPosts(subData['Posts']);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            }
        };

        fetchCommunityPosts();
    }, [userId]);

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
                            {name} {
                                subs.length > 0 ? <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24" width="15" focusable="false" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"></path></svg> : <></>
                            }
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
                            {
                                currentuser ? (
                                    <Link style={{ textDecoration: 'none', color: 'white' }} data-testid="subscribed-link" to={`/channel/${userId}/editing/profile`}>
                                        <div className='hebfjenk' style={{ backgroundColor: 'rgb(94, 94, 239)', color: 'white', border: '1px solid blue' }}>
                                            <center>Customize</center>
                                        </div>
                                    </Link>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {subscribed ? (
                                            <Link style={{ textDecoration: 'none', color: 'black' }} data-testid="subscribed-link">
                                            <div className='hebfjenk' style={{ backgroundColor: '#f2dfdf', color: 'black', border: '1px solid black' }} onClick={handleSubscribe}>
                                                <center>Subscribed</center>
                                            </div>
                                            </Link>
                                        ) : (
                                            <Link style={{ textDecoration: 'none', color: 'black' }} data-testid="subscribe-link">
                                            <div className='hebfjenk' onClick={handleSubscribe}>
                                                <center>Subscribe</center>
                                            </div>
                                            </Link>
                                        )}
                                        <Link style={{ textDecoration: 'none', color: 'black' }} data-testid="join-link">
                                            <div className='hebfjenk' style={{ backgroundColor: 'transparent', color: 'black', border: '0.5px solid black' }}>
                                                <center>Join</center>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="irfjkfjlvf">
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'home' ? 'black' : 'grey', padding: '10px' }}
                        onClick={() => setActiveTab('home')}
                        data-testid="home-link"
                    >
                        <div className="jjnffkmkm">
                            Home
                            {activeTab === 'home' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'video' ? 'black' : 'grey', padding: '10px' }}
                        onClick={() => setActiveTab('video')}
                        data-testid="video-link"
                    >
                        <div className="jjnffkmkm">
                            Videos
                            {activeTab === 'video' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'community' ? 'black' : 'grey', padding: '10px' }}
                        onClick={() => setActiveTab('community')}
                        data-testid="community-link"
                    >
                        <div className="jjnffkmkm">
                            Community
                            {activeTab === 'community' && <div className="nfjvf"></div>}
                        </div>
                    </Link>
                    <Link
                        style={{ textDecoration: 'none', color: activeTab === 'about' ? 'black' : 'grey', padding: '10px' }}
                        onClick={() => setActiveTab('about')}
                        data-testid="about-link"
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
                        activeTab === 'community' ? <Communitypage communityPosts={communityPosts} /> : <></>
                    }
                </div>
            </div>
        </div>
    );
}
