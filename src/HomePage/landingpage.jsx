import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
import { doc, getDoc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import Header from '../Components/header';
import Uploadbutton from '../Components/uploadbutton';
import Trendingpage from '../Trending Page/trendingpage';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import Subscribed_channels_viddeos from '../Video Page/subscribed_channels_viddeos';
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
export default function Landingpage() {
    const { userId } = useParams();
    useEffect(() => {
        document.title = 'VidTube';
    })
    const [memberonly, setmemberonly] = useState([]);
    const [sidebar, setSidebar] = useState(true);
    const [user, setuser] = useState(false);
    const [photourl, setphotourl] = useState('');
    const [videoid, setvideoid] = useState([]);
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
    //   const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        const fetchCountry = async () => {
            try {
                const response = await axios.get('https://ipapi.co/json/');
                console.log('Country', response.data.country_name);
                setCountryname(response.data.country_name); // Get the country code
            } catch (err) {
                // setError('Failed to fetch country information');
                console.error('Error fetching country:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountry();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching VID data..."); // Log fetching attempt
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
                    const MembersOnly = [];
                    const blockcountry = [];
                    const finalblocked = [];
                    // console.log('VID',data.VID);
                    setVID(data.VID);
                    // Fetch video data
                    for (let i = 0; i < data.VID.length; i++) {

                        const videoRef = doc(db, 'Global Post', data.VID[i]);
                        const videoDoc = await getDoc(videoRef);

                        if (videoDoc.exists()) {
                            const videoData = videoDoc.data();
                            thumbnailLinks.push(videoData['Thumbnail Link']);
                            Captions.push(videoData['Caption']);
                            Views.push(videoData['Views']);
                            UploadDates.push(videoData['Uploaded At']);
                            setmemberonly(MembersOnly);
                            Uploader.push(videoData['Uploaded UID']);
                            blockcountry.push(videoData['Country_Blocked']);
                            MembersOnly.push(videoData['membersonly'] || false);
                        } else {
                            console.log(`Video not found for VID: ${data.VID[i]}`);
                        }
                    }

                    // console.log('Blocked',blockcountry);
                    setblockedcountry(blockcountry);
                    // Set video-related states
                    setthumbnail(thumbnailLinks);
                    setcaption(Captions);
                    setviews(Views);
                    setuploaddate(UploadDates);
                    setuploader(Uploader);

                    // Fetch usernames and profile pictures
                    for (let i = 0; i < Uploader.length; i++) {
                        const userRef = doc(db, 'User Details', Uploader[i]);
                        const userDoc = await getDoc(userRef);

                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            Name.push(userData['Username']);
                        } else {
                            console.log(`User not found for UID: ${Uploader[i]}`);
                        }
                    }

                    // Fetch profile pictures
                    for (let i = 0; i < Uploader.length; i++) {
                        const userRef = doc(db, 'User Profile Pictures', Uploader[i]);
                        const userDoc = await getDoc(userRef);

                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            PFP.push(userData['Profile Pic']);
                        } else {
                            console.log(`User profile picture not found for UID: ${Uploader[i]}`);
                        }
                    }

                    // Set usernames and profile pictures states
                    setname(Name);
                    setdp(PFP);

                    // console.log('Collected usernames:', Name);
                    // console.log('Collected profile pictures:', PFP);
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
    function formatViews(views) {
        if (views < 1000) return views;
        else if (views < 1000000) return (views / 1000).toFixed(1) + 'K';
        else if (views < 1000000000) return (views / 1000000).toFixed(1) + 'M';
        else return (views / 1000000000).toFixed(1) + 'B';
    }
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully');
            window.location.replace('/');
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
                    setuser(false);
                    // setphotourl('');
                }
            });
            // You can redirect or update UI after sign-out
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };
    const [nightmode, setnightmode] = useState(false);

    const fetchdarkmode = async () => {
        const nightmodee = localStorage.getItem('nightmode') === 'true'; // Ensure it's a boolean
        setnightmode(nightmodee);
        console.log('night mode', nightmodee); // Log the correct value
    };

    useEffect(() => {
        fetchdarkmode(); // Fetch the mode initially
        const interval = setInterval(fetchdarkmode, 1000); // Call the function every second

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);
    const [premium, setpremium] = useState(false);
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
        console.log('prem', premium);
        fetchVideoData();
    })
    const buypremium = async () => {
        try {
            const docref = doc(db, 'Premium Users', auth.currentUser.uid);
            const dataToUpdate = {
                'Premium User': true, // Add the random number to the array
                'Premium Started': Timestamp.now(),
                'Premium Expiry': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            };
            await setDoc(docref, dataToUpdate);
        } catch (error) {
            console.log(error);
        }
    }
    const joinpremium = async () => {
        const options = {
            key: 'rzp_test_5ujtbmUNWVYysI', // Your Razorpay Key ID
            amount: '14900', // Amount in paise
            currency: 'INR',
            name: 'VidTube',
            description: `Membership of ${name}`,
            image: 'https://vidtubee.vercel.app/favicon.ico', // Your logo URL
            handler: async (response) => {
                // Handle payment success
                // console.log(response.razorpay_payment_id);

                try {
                    buypremium();
                    window.location.reload();
                } catch (error) {
                    // console.error('Error adding to cart:', error);
                    // alert('Payment Successful, but failed to add to cart.');
                }
            },
            theme: {
                color: '#F37254'
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }
    const videocategories = [
        'All',
        'Trending',
        auth.currentUser ? 'Subscribed' : null,
    ].filter(Boolean); // This will remove any null values
    

    // Initialize selectedCategory with "All"
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleClick = (category) => {
        // If the clicked category is already selected, unselect it
        if (selectedCategory === category) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
    };
    const [vidDatas, setVidDatas] = useState([]);

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
                    const videoIdSet = new Set(); // To track unique video IDs

                    // Fetch video data
                    for (let i = 0; i < data.VID.length; i++) {
                        const videoId = data.VID[i]; // Unique video identifier
                        if (videoIdSet.has(videoId)) {
                            console.log(`Duplicate video ID skipped: ${videoId}`);
                            continue; // Skip processing if the video ID is already seen
                        }

                        const videoRef = doc(db, 'Global Post', videoId);
                        const videoDoc = await getDoc(videoRef);

                        if (videoDoc.exists()) {
                            videoIdSet.add(videoId); // Track the unique video ID
                            const videoData = videoDoc.data();
                            const videoInfo = {
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
                            console.log(`Video not found for VID: ${videoId}`);
                        }
                    }

                    // Log the raw video data array before sorting and slicing
                    // console.log("Raw video data array:", videoDataArray);

                    // Sort by views and get top 10 videos
                    videoDataArray.sort((a, b) => b.views - a.views);
                    const topVideos = videoDataArray.slice(0, 10);

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
                    const userMap = Object.fromEntries(userDetails.map(user => [user.uid, user]));

                    // Enrich video data with user details
                    const enrichedVideoData = topVideos.map(video => ({
                        ...video,
                        username: userMap[video.uploader]?.username || 'Unknown',
                        profilePic: userMap[video.uploader]?.profilePic || '',
                    }));

                    // Log enriched data to check for duplicates
                    // console.log("Enriched Video Data:", enrichedVideoData);

                    // Set state with enriched video data
                    setVidDatas(enrichedVideoData);
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

    return (
        <div className="webbody" style={{ backgroundColor: nightmode ? 'black' : 'white', color: nightmode ? 'white' : 'black' }} >
            <Header />
            <div className="videobody">
                {/* {
                    sidebar ? <Sidebar /> : <ShortSidebar />
                } */}
                <div className="jdbfjekfjkhef" style={{ width: "100vw",position:"relative" }}>
                    {
                        premium ? <></> : <Link>
                            <div className="jjnjfdkmvd" onClick={auth.currentUser ? null : null}>
                                <div className="ejkclsklksd">
                                    <img src="https://www.gstatic.com/youtube/img/promos/growth/premium_lp2_large_feature_MusicModuleSquare_tablet_640x550.webp" alt="" height="500px" width="50%" />
                                    <div className="image-container">
                                        <img src="https://www.gstatic.com/youtube/img/promos/growth/premium_lp2_large_feature_MusicModuleSquare_text_background_tablet_1284x1875.jpg" alt="" height="500px" width="100%" />
                                        <div className="overlay-text" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                            <h2>Try Premium now</h2>
                                            <div className="jdnjvnd" style={{ fontSize: "15px", fontWeight: "400" }}>
                                                Prepaid and monthly plans available. Starts at ₹149.00​/month. Free trials with monthly plans.
                                            </div>
                                            <br /><br />
                                            <div className="dnfmdm" style={{ fontSize: "15px", fontWeight: "400" }}>
                                                GET VIDETUBE PREMIUM
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    }

                    {
                        auth.currentUser ? <Uploadbutton /> : <></>
                    }
                    {/* <div className="thumbnail-container"> */}
                    <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
                        <div className="jdcndkcdc" style={{ height: "100px", overflowX: "auto", whiteSpace: "nowrap" }}>
                            <div style={{ display: "inline-flex", flexDirection: "row", gap: "30px", height: "100%" }}>
                                {
                                    videocategories.map((category) => (
                                        <Link style={{ textDecoration: 'none', color: 'black' }}>
                                            <div className="jdsncs" style={{ height: "50px", width: "100px", backgroundColor: selectedCategory === category ? "gray" : "black", display: "flex", textAlign: "center", color: "white", justifyContent: "center", alignItems: "center", borderRadius: "10px" }} key={category} onClick={() => handleClick(category)}>
                                                {category}
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {loading ?
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw" }}>
                            <CircularProgress size={24} color="black" />
                        </div> : selectedCategory == 'All' ? thumbnail.map((url, index) => (
                            !memberonly[index] ?
                                <div key={index} className={"thumbnail-item"}>
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to={`/videos/${VID[index]}`} onClick={(() => {
                                        localStorage.setItem("VID", VID[index]);
                                    })}>
                                        <img src={url} alt={`Thumbnail ${index}`} className="thumbnail-image" height={"150px"} width={"265px"} style={{ borderRadius: "10px" }} />
                                        <div className="jefkfm">
                                            <div className="pfp">
                                                <Link to={`/profile/${uploader[index]}`} onClick={(() => {
                                                    localStorage.setItem("userid", uploader[index]);
                                                })}>
                                                    <img src={dp[index]} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                                                </Link>
                                            </div>
                                            <div className="jjnjbhvf" style={{ color: nightmode ? 'white' : 'black' }}>
                                                <h5>{caption[index]}</h5>
                                                <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                                                    {name[index]}

                                                </div>
                                                <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                                                    <p>{
                                                        views[index] > 0 ?
                                                            views[index] === 1 ? formatViews(views[index]) + ' View' :
                                                                formatViews(views[index]) + ' Views' :
                                                            "No views"
                                                    }</p>
                                                    •
                                                    <p>{formatTimeAgo(uploaddate[index])}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div> : <></>
                        )

                        ) : selectedCategory=='Trending'?<Trendingpage/>:<Subscribed_channels_viddeos/>}
                </div>
                <div className="kdjdkcvd" style={{ height: "100px" }}></div>
            </div>
        </div>
    );
}
