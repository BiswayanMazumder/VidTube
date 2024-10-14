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
  const [user, setuser] = useState(false);
  const [photourl, setphotourl] = useState('');
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
  const [videoownername, setvideoownername] = useState('');
  const [videoownerpfp, setvideoownerpfp] = useState('');
  const [subscount, setsubs] = useState([]);
  const [videoupload, setvideoupload] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const videoRef = doc(db, 'Global Post', videoId);
      const videoDoc = await getDoc(videoRef);
      if (videoDoc.exists()) {
        const videoData = videoDoc.data();
        setvideolink(videoData['Video Link']);
        setvideoviews(videoData['Views']);
        setvideotitle(videoData['Caption']);
        setvideoupload(videoData['Uploaded At']);
        setvideoowner(videoData['Uploaded UID']); // Ensure this UID is valid
      }

      // After setting video owner, fetch user details
      if (videoowner) {
        const userRef = doc(db, 'User Details', videoowner);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setvideoownername(userData['Username']);
        }

        const profilePicRef = doc(db, 'User Profile Pictures', videoowner);
        const profilePicDoc = await getDoc(profilePicRef);
        if (profilePicDoc.exists()) {
          const profilePicData = profilePicDoc.data();
          setvideoownerpfp(profilePicData['Profile Pic']);
        }
        const subsRef = doc(db, 'Subscribers', videoowner);
        const subsDoc = await getDoc(subsRef);
        if (subsDoc.exists()) {
          const subsData = subsDoc.data();
          setsubs(subsData['Subscriber UIDs']);
        }
      }
    }
    fetchData();
  }, [videoId, videoowner]);
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
  const { userId } = useParams();
  // const [dp, setDp] = useState('');
  const [names, setName] = useState('');//
  const [bio, setBio] = useState('');
  const [coverPic, setCoverPic] = useState('');
  const [subs, setSubs] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [viewss, setViews] = useState([]);// 
  const [uploadDate, setUploadDate] = useState([]);
  const [videoLink, setVideoLink] = useState([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track hovered thumbnail index
  const [VIDs, setVIDs] = useState([]);//
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const docRef = doc(db, 'Global VIDs', 'VIDs');
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          // console.log('VID DAta', data.VID);
          const uniqueThumbnails = new Set();
          const uniqueCaptions = new Set();
          const Views = [];
          const UploadDates = [];
          const Videolink = [];
          const VideoID = [];
          if (data.VID.includes(videoId)) {
            data.VID = data.VID.filter(id => id !== videoId);
          }
          for (const vid of data.VID) {
            const videoRef = doc(db, 'Global Post', vid);
            const videoDoc = await getDoc(videoRef);
            // console.log('VID Data', vid);
            if (videoDoc.exists()) {
              const videoData = videoDoc.data();
              VideoID.push(vid);
              uniqueThumbnails.add(videoData['Thumbnail Link']);
              uniqueCaptions.add(videoData['Caption']);
              Views.push(videoData['Views']);
              UploadDates.push(videoData['Uploaded At']);
              Videolink.push(videoData['Video Link']);
              setVIDs(data.VID);

            }
          }

          setThumbnails(Array.from(uniqueThumbnails));
          setCaptions(Array.from(uniqueCaptions));
          setViews(Views);
          setVideoLink(Videolink);
          setUploadDate(UploadDates);
          console.log('VID DATA', VideoID)
          setVidData(VideoID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideos();
  }, [userId]);
  return (
    <div className='webbody'>
      <Header />
      <div className="videobody">
        <video width="100%" height="533" src={videolink} title={videotitle} controls autoPlay style={{ backgroundColor: "black" }} onContextMenu={(e) => e.preventDefault()}></video>
        <div className="nkmkv" style={{ margin: "10px", fontWeight: "bold", fontSize: "20px" }}>
          {videotitle}
          <div className="jjfndv" style={{ fontSize: "15px", color: "grey", fontWeight: "300", marginTop: "10px" }}>
            {formatViews(videoviwes)} views
          </div>
          <div className="jjfndv" style={{ fontSize: "15px", color: "grey", fontWeight: "300", marginTop: "10px" }}>
            Uploaded {formatTimeAgo(videoupload)}
          </div>
          <div className='ekhbfehfss' style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "20px" }}>
            <img src={videoownerpfp} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${videoowner}`}>
              <div className="jfvjnf" style={{ fontWeight: "300", fontSize: "15px", marginTop: "0px" }}>
                {videoownername}
              </div>
              <div className="jfvjnf" style={{ fontWeight: "300", fontSize: "15px", color: 'grey' }}>
                {subscount.length === 1 || subscount.length === 0 ? subscount.length + ' Subscriber' : subscount.length + ' Subscribers'}
              </div>
            </Link>

            {
              auth.currentUser && subscount.includes(auth.currentUser.uid) ? (
                <Link style={{ textDecoration: 'none', color: 'white' }} data-testid="subscribed-link">
                  <div className='hebfjenk' style={{ backgroundColor: '#f2dfdf', color: 'black', border: '1px solid black', fontSize: "15px", marginLeft: "50px", marginTop: "-8px" }}>
                    <center>Subscribed</center>
                  </div>
                </Link>
              ) : (
                <Link style={{ textDecoration: 'none', color: 'white', fontSize: "15px", marginLeft: "50px", marginTop: "-10px" }} data-testid="subscribe-link">
                  <div className='hebfjenk'>
                    <center>Subscribe</center>
                  </div>
                </Link>
              )
            }
          </div>
        </div>
        <div className="krkmvkrhgjr">
          <div className="commentsection">
            <h5>Comments</h5>
            <div className="jenfjekf" style={{ display: "flex", flexDirection: "row", gap: "15px", marginTop: "20px" }}>
              {
                user ? <div className='jdckdk'>
                  <img src={photourl} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                </div> : <div className='jdckdk'>
                  <img src="https://yt3.ggpht.com/a/default-user=s88-c-k-c0x00ffffff-no-rj" alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                </div>
              } <input type="text" placeholder='Add a comment...' />
             {
              user?<Link>
             <button className="commentbutton" style={{ width: "80px", height: "30px", borderRadius: "10px", marginTop: "5px", border: "1px solid grey" }}>Comment</button>
             </Link>:<></>
             }
            </div>
            <div className="ehgfehfjefn">

            </div>
          </div>
          <div className="relatedvideos">
            {
              thumbnails.map((thumbnail, index) => (
                <div className="jnfvkf">
                  <Link style={{ textDecoration: 'none', color: 'black' }} to={`/videos/${vidData[index]}`}>
                    <img src={thumbnails[index]} alt={captions[index]} height={"120px"}
                      width={"200px"} style={{ borderRadius: "10px" }} />
                  </Link>
                  <Link style={{ textDecoration: 'none', color: 'black', fontWeight: "600" }} to={`/videos/${vidData[index]}`}>
                    {captions[index]}
                  </Link>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
