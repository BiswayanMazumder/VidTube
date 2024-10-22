import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import Header from '../Components/header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import Playlistpage from './playlistpage';
import { openDB } from 'idb';
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
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [watchHistPaused, setWatchHistPaused] = useState(false);
    const [videoIds, setVideoIds] = useState([]); // State to store video IDs

    const fetchUserData = async (uid) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'User Details', uid);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setName(userData.Username);
                setBio(userData.Bio);
            }

            const coverDocRef = doc(db, 'User Cover Pictures', uid);
            const coverDocSnapshot = await getDoc(coverDocRef);
            if (coverDocSnapshot.exists()) {
                const coverData = coverDocSnapshot.data();
                setCoverPic(coverData['Cover Pic']);
            }

            const subDocRef = doc(db, 'Subscribers', uid);
            const subDocSnapshot = await getDoc(subDocRef);
            if (subDocSnapshot.exists()) {
                const subData = subDocSnapshot.data();
                setSubs(subData['Subscriber UIDs']);
            }

            const profileDocRef = doc(db, 'User Profile Pictures', uid);
            const profileDocSnapshot = await getDoc(profileDocRef);
            if (profileDocSnapshot.exists()) {
                const profileData = profileDocSnapshot.data();
                setDp(profileData['Profile Pic']);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchUserData(userId);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        const getWatchingStatus = async () => {
            if (currentUser) {
                const docRef = doc(db, 'Watching History', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setWatchHistPaused(data['Watch History On']);
                }
            }
        };

        getWatchingStatus();
    }, [currentUser]);
    const pauseWatchHistory = async () => {
        if (currentUser) {
            const docRef = doc(db, 'Watching History', currentUser.uid);
            const updatedata = {
                'Watch History On': !watchHistPaused
            };
            await updateDoc(docRef, updatedata);
            setWatchHistPaused(!watchHistPaused);
        }
    };
    const [thumbnail, setthumbnail] = useState([]);
    const [title, settitle] = useState([]);
    useEffect(() => {
        const getVideoIds = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'Watching History', userId);
                const docSnap = await getDoc(docRef);
                const videoIDs = [];

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Spread the array into videoIDs
                    videoIDs.push(...data['VID']);
                }

                setVideoIds(videoIDs);
                console.log('Video IDs', videoIDs);

                // Create arrays to hold thumbnails and titles
                const thumbnails = [];
                const titles = [];

                for (let videoId of videoIDs) {
                    const docRef = doc(db, 'Global Post', videoId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        thumbnails.push(data['Thumbnail Link']);
                        titles.push(data['Caption']);
                    }
                }

                // Set the state for thumbnails and titles
                setthumbnail(thumbnails);
                settitle(titles);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getVideoIds();
    }, [userId]); // Add userId to the dependency array
    const [subsname, setsubsname] = useState([]);
    const [subspic, setsubspic] = useState([]);
    useEffect(() => {
        const fetchsubscriptions = async () => {
            const subsuid = [];
            const docRef = doc(db, 'Subscribers', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const subscriberUids = data['Subscriber UIDs'];
                // console.log('Subs',subsuid);
                // Check if subscriberUids is an array or a single value
                if (Array.isArray(subscriberUids)) {
                    subsuid.push(...subscriberUids);
                } else if (typeof subscriberUids === 'string') {
                    subsuid.push(subscriberUids); // if it's a single string
                } else {
                    console.error('Subscriber UIDs is neither an array nor a string:', subscriberUids);
                }
                console.log('Subs',subsuid);
                setSubs(subsuid);
            }

            for (let i = 0; i < subsuid.length; i++) {
                const docRef = doc(db, 'User Details', subsuid[i]);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setsubsname(prevSubs => [...prevSubs, data.Username]);
                }
            }

            for (let i = 0; i < subsuid.length; i++) {
                const docRef = doc(db, 'User Profile Pictures', subsuid[i]);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setsubspic(prevSubs => [...prevSubs, data['Profile Pic']]);
                }
            }
        };

        fetchsubscriptions();
    }, [userId]);
    const [videoData, setVideoData] = useState(null);
    const [videos, setVideos] = useState([]);

    // Fetch all videos from IndexedDB
    const fetchAllVideos = async () => {
      const db = await openDB('video-store', 1);
      const allVideos = await db.getAll('videos');
    //   console.log('Videos', allVideos);
      setVideos(allVideos); // Store fetched videos in state
    };
  
    // Delete a video from IndexedDB
    const deleteVideoFromCache = async (videoId) => {
      const db = await openDB('video-store', 1);
      await db.delete('videos', videoId);
      console.log('Video data deleted successfully.');
      fetchAllVideos(); // Refresh the list after deletion
    };
  
    useEffect(() => {
      fetchAllVideos(); // Fetch videos on component mount
    }, []);
    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", marginTop: '50px' }}>
            <CircularProgress size={24} color="inherit" />
        </div>
    );
    function formatViews(views) {
        if (views < 1000) return views;
        else if (views < 1000000) return (views / 1000).toFixed(1) + 'K';
        else if (views < 1000000000) return (views / 1000000).toFixed(1) + 'M';
        else return (views / 1000000000).toFixed(1) + 'B';
    }
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

        const seconds = Math.floor((now - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
        return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
    }
    if (!currentUser) return window.location.replace('/');

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
                        <div className="kjfd" style={{ marginTop: '10px', fontWeight: '300', display: 'flex', gap: '15px', flexDirection: 'row' }}>
                            <div>
                                @{name}
                            </div>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${userId}`}>
                                View Channel
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="jjhfef">
                    <div className="jefenfvdnw">
                        <div>
                            History
                        </div>
                        <Link style={{ textDecoration: 'none', color: 'black' }} onClick={pauseWatchHistory}>
                            <div className='jbfjdnfkj'>
                                {watchHistPaused ? 'Pause Watch History' : 'Resume Watch History'}
                            </div>
                        </Link>
                    </div>
                    <div className="kkrgkkv">
                        {
                            thumbnail.map((data, index) =>
                                <Link style={{ textDecoration: 'none', color: 'black' }} to={`/videos/${videoIds[index]}`}>
                                    <div className="thumbnail-item" key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
                                        <img src={thumbnail[index]} alt="" className="thumbnail-image"
                                            height={"150px"}
                                            width={"265px"}
                                            style={{ borderRadius: "10px" }} />
                                        <div className='kwjdkwjdj' style={{ fontWeight: '300', fontSize: '15px', marginTop: '20px' }}>
                                            {title[index]}
                                            <br /><br />
                                            <Link style={{ textDecoration: 'none', color: 'red' }} onClick={async () => {
                                                const docRef = doc(db, 'Watching History', userId);
                                                const updatedata = {
                                                    'VID': arrayRemove(videoIds[index]) // Add the random number to the array
                                                }
                                                await updateDoc(docRef, updatedata, { merge: true });
                                                window.location.reload();
                                            }}>
                                                Remove from watch history
                                            </Link>
                                        </div>
                                    </div>
                                </Link>
                            )
                        }
                    </div>
                    <div style={{ marginTop: '40px' }} className='jefenfvdnw'>
                        Your Subscribers
                    </div>
                    <div className="kdmvkdv" style={{ marginTop: '20px', fontWeight: '300', display: 'flex', justifyContent: 'start', alignItems: 'start', flexWrap: 'wrap', gap: '50px' }}>
                        {subs.map((data, index) =>
                            <Link key={index} style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${subs[index]}`}>
                                <div className="kknfkmv" style={{ height: '200px', width: '200px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', color: 'black', margin: '20px', padding: '10px' }}>
                                    <div>
                                    <img src={subspic[index]} alt="" height={'200px'} width={'200px'} style={{ borderRadius: '50%', marginBottom: '10px' }} />
                                    </div>
                                    <div style={{ fontWeight: '500',marginBottom: '50px' }}>
                                    {subsname[index]}
                                    </div>
                                    <br /><br /><br />
                                </div>
                            </Link>
                        )}
                    </div>
                    <div style={{ marginTop: '40px' }} className='jefenfvdnw'>
                        Your Downloads
                    </div>
                    <div className="kkrgkkv">
                        {
                            videos.map((video) =>
                                <Link style={{ textDecoration: 'none', color: 'black' }} to={`/videos/${video.id}`}>
                                    <div className="thumbnail-item" key={video.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
                                        <img src={video['data']['Thumbnail Link']} alt="" className="thumbnail-image"
                                            height={"150px"}
                                            width={"265px"}
                                            style={{ borderRadius: "10px" }} />
                                        <div className='kwjdkwjdj' style={{ fontWeight: '300', fontSize: '15px', marginTop: '20px' }}>
                                            {video['data']['Caption']}
                                            <br /><br />
                                            <div className="dmkdm" style={{ display: 'flex', flexDirection: 'row', gap: '10px',color: 'grey' }}>
                                            <div>
                                                {video['data']['Views']>1?formatViews(video['data']['Views'])+' views':formatViews(video['data']['Views'])+' view'}
                                            </div>
                                            <div>
                                               Uploaded {formatTimeAgo(video['data']['Uploaded At'])}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}
