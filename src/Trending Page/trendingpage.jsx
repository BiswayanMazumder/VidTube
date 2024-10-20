import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from "firebase/firestore";
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

export default function TrendingPage() {
    const [vidData, setVidData] = useState([]);
    const [videoIds, setVideoIds] = useState([]); // State for video IDs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching VID data...");
                const docRef = doc(db, 'Global VIDs', 'VIDs');
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const videoDataArray = [];
                    const uploaderIds = new Set(); // To collect unique uploader IDs

                    // Fetch video data
                    for (let i = 0; i < data.VID.length; i++) {
                        const videoRef = doc(db, 'Global Post', data.VID[i]);
                        const videoDoc = await getDoc(videoRef);

                        if (videoDoc.exists()) {
                            const videoData = videoDoc.data();
                            const videoInfo = {
                                id: data.VID[i], // Store video ID
                                thumbnail: videoData['Thumbnail Link'],
                                caption: videoData['Caption'],
                                views: videoData['Views'],
                                uploadDate: videoData['Uploaded At'],
                                uploader: videoData['Uploaded UID'],
                                membersOnly: videoData['membersonly'] || false,
                            };
                            videoDataArray.push(videoInfo);
                            uploaderIds.add(videoData['Uploaded UID']); // Collect uploader IDs
                        } else {
                            console.log(`Video not found for VID: ${data.VID[i]}`);
                        }
                    }

                    // Sort by views and get top 10 videos
                    videoDataArray.sort((a, b) => b.views - a.views);
                    const topVideos = videoDataArray.slice(0, 5);

                    // Set video IDs
                    setVideoIds(topVideos.map(video => video.id)); // Store video IDs

                    // Fetch user details in parallel
                    const userDetails = await Promise.all(
                        Array.from(uploaderIds).map(async (uid) => {
                            const userRef = doc(db, 'User Details', uid);
                            const userDoc = await getDoc(userRef);
                            const profilePicRef = doc(db, 'User Profile Pictures', uid);
                            const profilePicDoc = await getDoc(profilePicRef);

                            return {
                                uid,
                                username: userDoc.exists() ? userDoc.data()['Username'] : null,
                                profilePic: profilePicDoc.exists() ? profilePicDoc.data()['Profile Pic'] : null,
                            };
                        })
                    );

                    // Create a mapping of user details by UID
                    const userMap = Object.fromEntries(userDetails.map(user => [user.uid, user])) ;

                    // Enrich video data with user details
                    const enrichedVideoData = topVideos.map(video => ({
                        ...video,
                        username: userMap[video.uploader]?.username || 'Unknown',
                        profilePic: userMap[video.uploader]?.profilePic || '',
                    }));

                    // Log enriched data to check for duplicates
                    console.log("Enriched Video Data:", enrichedVideoData);

                    // Set state with enriched video data
                    setVidData(enrichedVideoData);
                } else {
                    console.log('No such document!');
                }
            } catch (err) {
                setError(err);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
                console.log('Loading complete');
            }
        };

        fetchData();
    }, []);

    function formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const seconds = Math.floor((now - date) / 1000);
        // Time formatting logic...
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
                    vidData.map((video, index) => (
                        !video.membersOnly ? (
                            <div key={index} className={"thumbnail-item"}>
                                <Link
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    to={`/videos/${videoIds[index]}`} // Adjust link as necessary
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt={`Thumbnail ${index}`}
                                        className="thumbnail-image"
                                        height={"150px"}
                                        width={"265px"}
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <div className="jefkfm">
                                        <div className="pfp">
                                            <Link to={`/profile/${video.uploader}`}>
                                                <img
                                                    src={video.profilePic}
                                                    alt=""
                                                    height={"40px"}
                                                    width={"40px"}
                                                    style={{ borderRadius: "50%" }}
                                                />
                                            </Link>
                                        </div>
                                        <div className="jjnjbhvf" style={{ color: 'black' }}>
                                            <h5>{video.caption}</h5>
                                            <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                                                {video.username}
                                            </div>
                                            <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                                                <p>
                                                    {video.views > 0
                                                        ? `${formatViews(video.views)} View${formatViews(video.views) > 1 ? 's' : ''}`
                                                        : "No views"}
                                                </p>
                                                •
                                                <p>{formatTimeAgo(video.uploadDate)}</p>
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
