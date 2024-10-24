import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

export default function Playlistpage() {
    const { userId } = useParams();
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching VID data..."); // Log fetching attempt
                const docRef = doc(db, 'Global Playlists', auth.currentUser.uid);
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
                            // setmemberonly(MembersOnly);
                            Uploader.push(videoData['Uploaded UID']);
                            MembersOnly.push(videoData['membersonly'] || false);
                        } else {
                            console.log(`Video not found for VID: ${data.VID[i]}`);
                        }
                    }

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
    function formatViews(views) {
        if (views < 1000) return views;
        else if (views < 1000000) return (views / 1000).toFixed(1) + 'K';
        else if (views < 1000000000) return (views / 1000000).toFixed(1) + 'M';
        else return (views / 1000000000).toFixed(1) + 'B';
    }
  return (
    <div className='webbody'>
      <div className="jdbfjekfjkhef">
      {thumbnail.map((url, index) => (
                       
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
                                   <div className="jjnjbhvf" style={{ color:  'black', fontSize: "15px" }}>
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
                       </div>
               ))}
      </div>
    </div>
  )
}
