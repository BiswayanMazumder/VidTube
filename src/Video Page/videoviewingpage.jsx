import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
import { doc, getDoc, getFirestore } from "firebase/firestore";
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
export default function Videoviewingpage() {
  const { videoId } = useParams();
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
              Uploader.push(videoData['Uploaded UID']);
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
  const [videolink, setvideolink] = useState('');
  const [videoviwes, setvideoviews] = useState(0);
  const [videotitle, setvideotitle] = useState('');
  const [videoowner, setvideoowner] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const videoRef = doc(db, 'Global Post', videoId);
      const videoDoc = await getDoc(videoRef);
      if (videoDoc.exists()) {
        const videoData = videoDoc.data();
        setvideolink(videoData['Video Link']);
        setvideoviews(videoData['Views']);
        setvideotitle(videoData['Caption']);
        setvideoowner(videoData['Uploaded UID']);
      }
    }
    fetchData();
  }, [videoId])
  return (
    <div className='webbody'>
      <Header />
      <div className="videobody">
        <iframe width="100%" height="533" src={videolink} title="I BOUGHT THE MOST EXPENSIVE PENS FROM AMAZON" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <div className="nkmkv" style={{margin:"10px",fontWeight:"bold",fontSize:"20px"}}>
        {videotitle}
        </div>
      </div>
    </div>
  )
}
