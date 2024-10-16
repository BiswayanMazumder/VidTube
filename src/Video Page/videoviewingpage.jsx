import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
import { arrayRemove, arrayUnion, doc, Firestore, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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
      setLoading(true);
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
  const [subscribed, issubscribed] = useState(false);
  const [videolink, setvideolink] = useState('');
  const [videoviwes, setvideoviews] = useState(0);
  const [videotitle, setvideotitle] = useState('');
  const [videoowner, setvideoowner] = useState('');
  const [videoownername, setvideoownername] = useState('');
  const [videoownerpfp, setvideoownerpfp] = useState('');
  const [subscount, setsubs] = useState([]);
  const [videoupload, setvideoupload] = useState([]);

  const fetchData = async () => {
    const videoRef = doc(db, 'Global Post', videoId);
    const videoDoc = await getDoc(videoRef);
    var usersubsed = false;
    if (videoDoc.exists()) {
      const videoData = videoDoc.data();
      setvideolink(videoData['Video Link']);
      setvideoviews(videoData['Views']);
      setvideotitle(videoData['Caption']);
      setvideoupload(videoData['Uploaded At']);
      setvideoowner(videoData['Uploaded UID']); // Ensure this UID is valid

      // Increment views
      const newviews = videoData['Views'] + 1; // Get the current views from videoData
      console.log('Views', newviews);
      const viewsdoc = doc(db, 'Global Post', videoId);
      const viewsdetails = {
        Views: newviews,
      };

      // Log the view update details before writing
      console.log('View Update Details:', viewsdetails);

      await updateDoc(viewsdoc, viewsdetails);
      setvideoviews(newviews); // Update state to reflect the new view count
    }

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

        if (subsData['Subscriber UIDs'].includes(auth.currentUser.uid)) {
          issubscribed(true);
          usersubsed = true;
        }
        console.log('subs', usersubsed);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [videoId, videoowner]);
  const [pfp, setpfp] = useState('');
  const fetchdp = async () => {
    //   await fetchData();
    if (auth.currentUser) {
      const profileDocRef = doc(db, 'User Profile Pictures', auth.currentUser.uid);
      const profileDocSnapshot = await getDoc(profileDocRef);
      if (profileDocSnapshot.exists()) {
        const profileData = profileDocSnapshot.data();
        setpfp(profileData['Profile Pic']);
      }
    }
  }
  useEffect(() => {
    fetchdp();
  },[])
  const handleSubscribe = async () => {
    await fetchData();
    const subsRef = doc(db, 'Subscribers', videoowner);
    const subsDoc = await getDoc(subsRef);

    if (subsDoc.exists()) {
      const subsData = subsDoc.data();
      let subscriberUIDs = subsData['Subscriber UIDs'] || [];

      if (subscriberUIDs.includes(auth.currentUser.uid)) {
        // User is currently subscribed, remove their UID
        subscriberUIDs = subscriberUIDs.filter(uid => uid !== auth.currentUser.uid);
        console.log('User unsubscribed:', auth.currentUser.uid);
      } else {
        // User is not subscribed, add their UID
        subscriberUIDs.push(auth.currentUser.uid);
        console.log('User subscribed:', auth.currentUser.uid);
      }

      // Update the document with the new subscriber list
      await updateDoc(subsRef, { 'Subscriber UIDs': subscriberUIDs });

      // Update state to reflect the subscription status
      setsubs(subscriberUIDs);
      issubscribed(!subscriberUIDs.includes(auth.currentUser.uid)); // Toggle subscription status
    }
  };

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
          // console.log('VID DATA', VideoID)
          setVidData(VideoID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideos();
  }, [userId]);

  const [randomNumber, setRandomNumber] = useState(0);
  const generateRandomNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  };

  useEffect(() => {
    // Set a random number when the component mounts
    setRandomNumber(generateRandomNumber());
    // console.log('Rand',randomNumber);
  }, []);
  const [commentText, setCommentText] = useState('');
  const uploadcommentid = async () => {
    try {
      // Create a reference to the document in Firestore
      const docRef = doc(db, 'Comment ID', "Comment ID Generated");

      // Prepare the data to upload, including the random number
      const dataToUpdate = {
        commentId: arrayUnion(randomNumber), // Add the random number to the array
      };

      // Update the document with merge: true to keep existing fields
      await setDoc(docRef, dataToUpdate, { merge: true });
      console.log('Updated Comment ID document successfully.');
      console.log('Comment ID uploaded successfully:', randomNumber.toString());
    } catch (error) {
      console.error('Error uploading comment ID:', error);
    }
  };
  const uploadcomment = async () => {
    await uploadcommentid();
    try {
      const commentred = doc(db, 'Comment Details', randomNumber.toString());
      const commentdetails = {
        comment: commentText,
        commenter: auth.currentUser.uid,
        VideoID: videoId,
        timestamp: serverTimestamp(),
        likes: 0,
        dislikes: 0,
      };

      // Log the comment details before writing
      console.log('Comment Details:', commentdetails);

      await setDoc(commentred, commentdetails);
    } catch (error) {
      console.log('Error:', error);
    }
  }
  const [commentataid, setcommentdataid] = useState([]);
  const [commentowner, setcommentowner] = useState([]);
  const [commenrdate, setcommentdate] = useState([]);
  const [commentdata, setcommentdata] = useState([]);
  const [commentlike, setcommentlike] = useState([]);
  const [commentdislike, setcommentdislike] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentpfp, setcommentpfp] = useState([]);
  const [commentername, setcommentername] = useState([]);
  const [commentowners, setcomentowners] = useState([]);
  const [commentedvideo, setcommentedvideo] = useState([]);
  const fetchcomments = async () => {
    try {
      const docRef = doc(db, 'Comment ID', "Comment ID Generated");
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const CommentIDs = data.commentId || []; // Ensure this is an array

        const fetchedComments = [];
        const commenterdetails = [];
        const commentpfp = [];
        const commentvideoid = [];
        const commentownerid = [];
        for (const commentID of CommentIDs) {//comment
          const commentRef = doc(db, 'Comment Details', commentID.toString());
          const commentDoc = await getDoc(commentRef);
          if (commentDoc.exists()) {
            const commentData = commentDoc.data();
            fetchedComments.push(commentData.comment);
            commentvideoid.push(commentData.VideoID);
            commentownerid.push(commentData.commenter);
            // Fetch commenter details
            const commenterRefs = doc(db, 'User Details', commentData.commenter);//name
            const commenterDocs = await getDoc(commenterRefs);
            let commenterData;

            if (commenterDocs.exists()) {
              commenterData = commenterDocs.data();
              commenterdetails.push(commenterData.Username);
            } else {
              console.log(`Commenter not found for UID: ${commentData.commenter}`);
            }

            // Fetch profile picture
            const commenterRefss = doc(db, 'User Profile Pictures', commentData.commenter);//pfp
            const commenterDocss = await getDoc(commenterRefss);
            let commenterDatas;

            if (commenterDocss.exists()) {
              commenterDatas = commenterDocss.data();
              commentpfp.push(commenterDatas['Profile Pic']);
            } else {
              // console.log(`Profile picture not found for UID: ${commentData.commenter}`);
            }

            // Log the comment details


          } else {
            // console.log(`No comment found for ID: ${commentID}`);
          }
        }

        setComments(fetchedComments);
        setcommentpfp(commentpfp); // Set profile pictures separately
        setcommentername(commenterdetails);
        setcomentowners(commentownerid);
        setcommentedvideo(commentvideoid);
      } else {
        console.log('No Comment ID document found!');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };



  // Call fetchcomments in a useEffect
  useEffect(() => {
    fetchcomments();
  }, []);
  const fetchcommentdata = async () => {
    await fetchcomments();
    try {
      for (var i = 0; i < commentataid.length; i++) {
        const docRef = doc(db, 'Comment Details', commentataid[i].toString());
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setcommentdata(data.comment);
          setcommentowner(data.commenter);
          setcommentdate(data.timestamp);
          setcommentlike(data.likes);
          setcommentdislike(data.dislikes);

          // Log the fetched comment data
          console.log('Fetched comment data:', {
            comment: data.comment,
            commenter: data.commenter,
            timestamp: data.timestamp,
            likes: data.likes,
            dislikes: data.dislikes
          });
        }
      }
    } catch (error) {
      console.error('Error fetching comment data:', error);
    }
  };

  useEffect(() => {
    fetchcomments();
    console.log('Comment pfp', commentpfp)
  }, []);
  useEffect(() => {
    // fetchcommentdata();
  }, []);
  const [liked, isliked] = useState(false);
  const [disliked, isdisliked] = useState(false);
  const [likecount, setlikecount] = useState(0);
  const [dislikecount, setdislikecount] = useState(0);
  const likevideo = async () => {
    try {
      const docRef = doc(db, 'Liked Videos', videoId.toString());

      // Check the existing document
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      // Prepare the data to update
      const dataToUpdate = isliked
        ? { UIDs: arrayUnion(auth.currentUser.uid) }  // Add UID
        : { UIDs: arrayRemove(auth.currentUser.uid) }; // Remove UID

      // Update the document
      await updateDoc(docRef, dataToUpdate);
      console.log(`UID ${isliked ? 'added to' : 'removed from'} the document.`);

    } catch (error) {
      console.log("Error updating document: ", error);
    }
  };

  return (
    <div className='webbody'>
      <Header />
      {
        loading ? <div className="loading-bar"></div> : <div className="videobody">
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
                    <div className='hebfjenk' style={{ backgroundColor: '#f2dfdf', color: 'black', border: '1px solid black', fontSize: "15px", marginLeft: "50px", marginTop: "-8px" }} onClick={handleSubscribe}>
                      <center>Subscribed</center>
                    </div>
                  </Link>
                ) : (
                  <Link style={{ textDecoration: 'none', color: 'white', fontSize: "15px", marginLeft: "50px", marginTop: "-10px" }} data-testid="subscribe-link">
                    <div className='hebfjenk' onClick={handleSubscribe} >
                      <center>Subscribe</center>
                    </div>
                  </Link>
                )
              }
              {/* <Link style={{ textDecoration: 'none', color: 'white' }} data-testid="subscribed-link">
                <div className='hebfjenkd' style={{ backgroundColor: 'black', color: 'black', border: '1px solid black', fontSize: "15px", marginLeft: "50px", marginTop: "0px", width: "fit-content", gap: "50px", paddingLeft: "10px", paddingRight: "10px" }}>
                  <div className="rbrn" style={{ color: "white", display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                    <div className="jnf" onClick={() => {
                      if (liked) {
                        isliked(false);
                        // setcommentlike(commentlike - 1);
                      } else {
                        // likevideo();
                        isliked(true);
                        setlikecount(likecount + 1)
                        isdisliked(false);
                        dislikecount > 0 ? setdislikecount(dislikecount - 1) : setdislikecount(0);
                        // setcommentlike(commentlike + 1);
                      }
                    }}>
                      {
                        liked ? <svg stroke="green" fill="green" stroke-width="1" viewBox="0 0 1024 1024" height="28" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg> : <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 1024 1024" height="28" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg>
                      }
                    </div>
                    {likecount} Likes
                  </div>
                  <div className="enfjne" style={{ color: "white", display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                    <div className="jnf" onClick={() => {
                      if (disliked) {
                        isdisliked(false);

                        // setcommentlike(commentlike - 1);
                      } else {
                        isdisliked(true);
                        isliked(false);
                        setdislikecount(dislikecount + 1);
                        likecount > 0 ? setlikecount(likecount - 1) : setlikecount(0);
                        // setcommentlike(commentlike + 1);
                      }
                    }}>
                      {
                        disliked ? <svg stroke="red" fill="red" stroke-width="1" viewBox="0 0 1024 1024" height="28" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4z"></path></svg> : <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 1024 1024" height="28" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4z"></path></svg>
                      }
                    </div>

                    {dislikecount} Dislikes
                  </div>
                </div>
              </Link> */}
            </div>
          </div>
          <div className="krkmvkrhgjr">
            <div className="commentsection">
              <h5>Comments</h5>
              <div className="jenfjekf" style={{ display: "flex", flexDirection: "row", gap: "15px", marginTop: "20px" }}>
                {
                  user ? <div className='jdckdk'>
                    <img src={pfp} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                  </div> : <div className='jdckdk'>
                    <img src="https://yt3.ggpht.com/a/default-user=s88-c-k-c0x00ffffff-no-rj" alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                  </div>
                } <input
                  type="text"
                  placeholder='Add a comment...'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                {
                  auth.currentUser ? <Link>
                    {
                      commentText.length > 0 ? <button className="commentbutton" style={{ width: "80px", height: "30px", borderRadius: "10px", marginTop: "5px", border: "1px solid grey" }} onClick={() => {
                        uploadcomment();
                        fetchcomments();
                        setCommentText('');
                      }}>Comment</button> : <></>
                    }
                  </Link> : <></>
                }
              </div>

              <div className="ehgfehfjefn" style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "50px" }}>
                {comments.map((comment, index) => (
                  commentedvideo[index] == videoId ? <div className="jefjkf" style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "10px", flexDirection: 'row', gap: "10px", fontWeight: "500", fontSize: "15px" }} key={index}>
                    <div className="bnbnfnv" style={{ height: "40px", width: "40px", borderRadius: "50%", backgroundColor: "grey" }}>
                      <img src={commentpfp[index]} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                    </div>
                    <div className="knkfnvk" style={{ display: "flex", flexDirection: "column", marginTop: "2px", gap: "5px", fontWeight: "600", fontSize: "15px" }}>
                      {/* <Link style={{ textDecoration: 'none', color: 'black' }} > */}
                      <div className="vkfk" style={{ display: "flex", flexDirection: "row", gap: "15px", fontWeight: "600", fontSize: "15px" }}>

                        <Link style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${commentowners[index]}`}>
                          {commentername[index]}
                        </Link>
                        {
                          user ? commentowners[index] === auth.currentUser.uid ? <svg aria-label="Conversation information" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="15" role="img" viewBox="0 0 24 24" width="15"><title>More Options</title><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><circle cx="11.819" cy="7.709" r="1.25"></circle><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10.569" x2="13.432" y1="16.777" y2="16.777"></line><polyline fill="none" points="10.569 11.05 12 11.05 12 16.777" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg> : <></> : <></>
                        }
                      </div>
                      {/* </Link> */}
                      <div className="vkfk" style={{ fontWeight: "300", fontSize: "12px" }}>
                        {comments[index]}
                      </div>
                    </div>
                  </div> : <></>
                ))}
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
                    <div className="jefeffkfm" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Link style={{ textDecoration: 'none', color: 'black', fontWeight: "600" }} to={`/videos/${vidData[index]}`}>
                        {captions[index]}
                      </Link>
                      <Link style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${uploader[index]}`}>
                        <div className="jefjnf" style={{ color: "grey", fontSize: "12px" }}>
                          {name[index]}
                        </div>
                      </Link>
                      <div className="jehfej" style={{ color: "grey", fontSize: "12px" }}>
                        <p>{
                          views[index] > 0 ?
                            views[index] === 1 ? formatViews(views[index]) + ' View' :
                              formatViews(views[index]) + ' Views' :
                            "No views"
                        }</p>

                        <p>{formatTimeAgo(uploaddate[index])}</p>
                      </div>
                    </div>

                  </div>
                ))
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}
