import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import Header from '../Components/header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CircularProgress } from '@mui/material';


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

export default function Subscribed_channels_viddeos() {
    const [subs,setSubs]=useState([]);
    const [vidData, setVidData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thumbnail, setthumbnail] = useState([]);
    const [caption, setcaption] = useState([]);
    const [views, setviews] = useState([]);
    const [uploaddate, setuploaddate] = useState([]);
    const [uploader, setuploader] = useState([]);
    const [dp, setdp] = useState([]);
    const [name, setname] = useState([]);
    const [VID, setVID] = useState([]);
    const [blockedcountry, setblockedcountry] = useState([]);
    const [countryname, setCountryname] = useState('');
    const [memberonly, setmemberonly] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching VID data..."); // Log fetching attempt
                const Subs = [];
                const subDocRef = doc(db, 'Subscribers', auth.currentUser.uid);
                const subDocSnapshot = await getDoc(subDocRef);
                
                if (subDocSnapshot.exists()) {
                    const subData = subDocSnapshot.data();
                    Subs.push(...subData['Subscriber UIDs']); // Use spread operator to add all UIDs
                    setSubs(subData['Subscriber UIDs']);
                }
    
                const docRef = doc(db, 'Global VIDs', 'VIDs');
                const docSnapshot = await getDoc(docRef);
    
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setVidData(data.VID);
    
                    const thumbnailLinks = [];
                    const Captions = [];
                    const Views = [];
                    const UploadDates = [];
                    const Uploader = [];
                    const Name = [];
                    const PFP = [];
                    const videoid=[];
                    const MembersOnly = [];
                    const blockcountry = [];
                    
                    // Filter videos based on Uploaded UID in Subs
                    for (let i = 0; i < data.VID.length; i++) {
                        const videoRef = doc(db, 'Global Post', data.VID[i]);
                        const videoDoc = await getDoc(videoRef);
    
                        if (videoDoc.exists()) {
                            const videoData = videoDoc.data();
    
                            // Only add video data if Uploader is in Subs
                            if (Subs.includes(videoData['Uploaded UID'])) {
                                videoid.push(data.VID[i]);
                                thumbnailLinks.push(videoData['Thumbnail Link']);
                                Captions.push(videoData['Caption']);
                                Views.push(videoData['Views']);
                                UploadDates.push(videoData['Uploaded At']);
                                Uploader.push(videoData['Uploaded UID']);
                                blockcountry.push(videoData['Country_Blocked']);
                                MembersOnly.push(videoData['membersonly'] || false);
                            }
                        } else {
                            console.log(`Video not found for VID: ${data.VID[i]}`);
                        }
                    }
    
                    setblockedcountry(blockcountry);
                    // Set video-related states
                    setVID(videoid);
                    setthumbnail(thumbnailLinks);
                    setcaption(Captions);
                    setviews(Views);
                    setuploaddate(UploadDates);
                    setuploader(Uploader);
    
                    // Fetch usernames and profile pictures only for filtered Uploaders
                    for (const uid of Uploader) {
                        const userRef = doc(db, 'User Details', uid);
                        const userDoc = await getDoc(userRef);
    
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            Name.push(userData['Username']);
                        } else {
                            console.log(`User not found for UID: ${uid}`);
                        }
    
                        const userProfilePicRef = doc(db, 'User Profile Pictures', uid);
                        const userProfilePicDoc = await getDoc(userProfilePicRef);
    
                        if (userProfilePicDoc.exists()) {
                            const userData = userProfilePicDoc.data();
                            PFP.push(userData['Profile Pic']);
                        } else {
                            console.log(`User profile picture not found for UID: ${uid}`);
                        }
                    }
    
                    // Set usernames and profile pictures states
                    setname(Name);
                    setdp(PFP);
                } else {
                    console.log('No such document!');
                }
            } catch (err) {
                setError(err);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
                console.log('Loading complete'); // Log when loading is complete
            }
        };
    
        fetchData();
    }, []);
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

    function formatViews(views) {
        if (views < 1000) return views;
        else if (views < 1000000) return (views / 1000).toFixed(1) + 'K';
        else if (views < 1000000000) return (views / 1000000).toFixed(1) + 'M';
        else return (views / 1000000000).toFixed(1) + 'B';
    }    
    return (
        <div className='webbody'>
            <div className="jdhfkdjf" style={{ display: "flex", flexDirection: "row", gap: "10px", flexWrap: "wrap" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw" }}>
                        <CircularProgress size={24} color="inherit" />
                    </div>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    thumbnail.map((video, index) => (
                        !video.membersOnly ? (
                            <div key={index} className={"thumbnail-item"}>
                                <Link
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    to={`/videos/${VID[index]}`} 
                                >
                                    <img
                                        src={thumbnail[index]}
                                        alt={`Thumbnail ${index}`}
                                        className="thumbnail-image"
                                        height={"150px"}
                                        width={"265px"}
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <div className="jefkfm">
                                        <div className="pfp">
                                            <Link to={`/profile/${uploader[index]}`}>
                                                <img
                                                    src={dp[index]}
                                                    alt=""
                                                    height={"40px"}
                                                    width={"40px"}
                                                    style={{ borderRadius: "50%" }}
                                                />
                                            </Link>
                                        </div>
                                        <div className="jjnjbhvf" style={{ color: 'black' }}>
                                            <h5>{caption[index]}</h5>
                                            <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                                                {name[index]}
                                            </div>
                                            <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                                                <p>
                                                    {views[index] > 0
                                                        ? `${formatViews(views[index])} View${formatViews(views[index]) > 1 ? 's' : ''}`
                                                        : "No views"}
                                                </p>
                                                •
                                                <p>
                                                    {uploaddate[index] && uploaddate[index].seconds
                                                        ? formatTimeAgo(uploaddate[index])
                                                        : "Unknown date"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ) : null
                    ))
                )}
            </div>
        </div>
    );
    
}
