import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUNVwpGBz1HUQs8Y9Ab-I_Nu4pPbeixmY",
    authDomain: "pixelprowess69.firebaseapp.com",
    projectId: "pixelprowess69",
    storageBucket: "pixelprowess69.appspot.com",
    messagingSenderId: "785469951781",
    appId: "1:785469951781:web:e5b45a44c5ec5f44d0d4cc",
    measurementId: "G-TZ5WZEQPZE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Videospage() {
    const { userId } = useParams();
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [subs, setSubs] = useState([]);
    const [vidData, setVidData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [thumbnails, setThumbnails] = useState([]);
    const [captions, setCaptions] = useState([]);
    const [views, setViews] = useState([]);
    const [uploadDate, setUploadDate] = useState([]);
    const [videoLink, setVideoLink] = useState([]);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null); // Track hovered thumbnail index

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
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const docRef = doc(db, 'Global VIDs', 'VIDs');
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setVidData(data.VID);

                    const uniqueThumbnails = new Set();
                    const uniqueCaptions = new Set();
                    const Views = [];
                    const UploadDates = [];
                    const Videolink = [];
                    for (const vid of data.VID) {
                        const videoRef = doc(db, 'Global Post', vid);
                        const videoDoc = await getDoc(videoRef);

                        if (videoDoc.exists()) {
                            const videoData = videoDoc.data();
                            if (videoData['Uploaded UID'] === userId) {
                                uniqueThumbnails.add(videoData['Thumbnail Link']);
                                uniqueCaptions.add(videoData['Caption']);
                                Views.push(videoData['Views']);
                                UploadDates.push(videoData['Uploaded At']);
                                Videolink.push(videoData['Video Link']);
                            }
                        }
                    }

                    setThumbnails(Array.from(uniqueThumbnails));
                    setCaptions(Array.from(uniqueCaptions));
                    setViews(Views);
                    setVideoLink(Videolink);
                    setUploadDate(UploadDates);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchVideos();
    }, [userId]);

    function formatViews(views) {
        if (views < 1000) return views;
        else if (views < 1000000) return (views / 1000).toFixed(1) + 'K';
        else if (views < 1000000000) return (views / 1000000).toFixed(1) + 'M';
        else return (views / 1000000000).toFixed(1) + 'B';
    }

    function formatTimeAgo(timestamp) {
        if (!timestamp || !timestamp.seconds) return "Unknown time ago"; // Safety check
        const now = new Date();
        const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);

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

    return (
        <div className='webbody'>
            <div className="jkgflmlv">
                <video 
                    src={videoLink[activeVideoIndex]} 
                    height={"238px"} 
                    width={"438px"} 
                    autoPlay 
                    loop 
                    muted
                    controls 
                    style={{ borderRadius: "10px" }} 
                />
                <div className="kenfkrmfl">
                    {captions[activeVideoIndex]}
                    <div className="jnjvfmv" style={{ fontWeight: "300", fontSize: "15px", color: "grey" }}>
                        {
                            formatViews(views[activeVideoIndex]) + " views • " + formatTimeAgo(uploadDate[activeVideoIndex])
                        }
                    </div>
                </div>
            </div>
            <div className="jdbfjekfjkhef">
                {thumbnails.map((url, index) => (
                    <div 
                        key={index} 
                        className="thumbnail-item" 
                        onMouseEnter={() => setHoveredIndex(index)} 
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => setActiveVideoIndex(index)}
                    >
                        <Link to="#" style={{ textDecoration: 'none', color: 'black' }}>
                            <div className="jjfmenmd">
                                {hoveredIndex === index ? (
                                    <video 
                                        src={videoLink[index]} 
                                        height={"150px"} 
                                        width={"265px"} 
                                        autoPlay 
                                        muted 
                                        loop 
                                         
                                        style={{ borderRadius: "10px" }} 
                                    />
                                ) : (
                                    <img 
                                        src={url} 
                                        alt={`Thumbnail ${index}`} 
                                        className="thumbnail-image" 
                                        height={"150px"} 
                                        width={"265px"} 
                                        style={{ borderRadius: "10px" }} 
                                    />
                                )}
                            </div>
                            <div className="jefkfm">
                                <div className="pfp">
                                    <Link>
                                        <img src={dp} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                                    </Link>
                                </div>
                                <div className="jjnjbhvf">
                                    <div className="jehfej" style={{ color: "black", fontSize: "15px", display: "flex", flexDirection: "column", gap: "1px", fontWeight: "500" }}>
                                        <h5>{captions[index]}</h5>
                                        <div className="jnfjvnkfv" style={{ color: "black", fontSize: "15px", display: "flex", flexDirection: "row", gap: "5px" }}>
                                            <p style={{ fontSize: "12px", color: "grey" }}>{views[index] === 0 ? 'No Views' : formatViews(views[index]) + ' Views'}</p> •
                                            <p style={{ fontSize: "12px", color: "grey" }}>{formatTimeAgo(uploadDate[index])}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
