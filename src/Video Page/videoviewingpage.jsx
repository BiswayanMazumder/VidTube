import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '../Components/sidebar';
import ShortSidebar from '../Components/shortsidebar';
import { arrayRemove, arrayUnion, doc, Firestore, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import Header from '../Components/header';
import { CircularProgress } from '@mui/material';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';
import axios from 'axios';
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export default function Videoviewingpage() {
  const { videoId, userId } = useParams();
  // const { userId } = useParams();
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
  const [videothumbnail, setvideothumbnail] = useState('');
  const [videoviwes, setvideoviews] = useState(0);
  const [videotitle, setvideotitle] = useState('');
  const [videoowner, setvideoowner] = useState('');
  const [videoownername, setvideoownername] = useState('');
  const [videoownerpfp, setvideoownerpfp] = useState('');
  const [subscount, setsubs] = useState([]);
  const [videoupload, setvideoupload] = useState([]);
  const [currentmemberonly, setcurrentsetmemberonly] = useState([]);
  const [videoDatas, setVideoData] = useState(null);
  const fetchData = async () => {
    const videoRef = doc(db, 'Global Post', videoId);
    const videoDoc = await getDoc(videoRef);
    var usersubsed = false;
    var ismemberonly = false;
    if (videoDoc.exists()) {
      const videoData = videoDoc.data();
      setVideoData(videoData);
      setcurrentsetmemberonly(videoData['membersonly'] || false);
      setvideolink(videoData['Video Link']);
      setvideothumbnail(videoData['Thumbnail Link']);
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
  const [savedvideos, issaved] = useState(false)
  const saveVideoToCache = async (videoId, videoData) => {
    const db = await openDB('video-store', 1, {
      upgrade(db) {
        db.createObjectStore('videos', { keyPath: 'id' });
      },
    });
    await db.put('videos', { id: videoId, data: videoData });
    console.log('Video data saved successfully.');
  };

  // Function to check if video data exists in IndexedDB
  const checkIfVideoExists = async (videoId) => {
    const db = await openDB('video-store', 1);
    const video = await db.get('videos', videoId);
    return video !== undefined;
  };

  // Function to delete video data from IndexedDB
  const deleteVideoFromCache = async (videoId) => {
    const db = await openDB('video-store', 1);
    await db.delete('videos', videoId);
    console.log('Video data deleted successfully.');
  };

  // Function to handle button click
  const handleSaveClick = async () => {
    if (!videoDatas) {
      await fetchData(); // Ensure video data is fetched first
    }

    if (videoDatas) {
      const exists = await checkIfVideoExists(videoId);
      issaved(exists); // Update isSaved state

      if (exists) {
        await deleteVideoFromCache(videoId);
        issaved(false); // Update state to indicate the video is no longer saved
        // alert('Video has been deleted from offline storage.');
      } else {
        await saveVideoToCache(videoId, videoDatas);
        issaved(true); // Update state to indicate the video is saved
        // alert('Video saved for offline viewing!');
      }
    } else {
      // alert('No video data available to save.');
    }
  };

  // Check if the video is already saved on component mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      const exists = await checkIfVideoExists(videoId);
      issaved(exists); // Update isSaved state
    };

    checkSavedStatus();
  }, [videoId]);
  useEffect(() => {
    const uploadViewing = async () => {
      try {
        const docRef = doc(db, 'Watching History', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // If "Watch History On" is true, update the VID
          if (data['Watch History On']) {
            const updatedData = {
              'VID': arrayUnion(videoId),
            };
            await setDoc(docRef, updatedData, { merge: true });
          }
        } else {
          // If document doesn't exist, create it with the initial data
          const initialData = {
            'VID': [videoId],
            'Watch History On': true,
          };
          await setDoc(docRef, initialData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (auth.currentUser) {
      uploadViewing();
    }
  }, [videoId]); // Include videoId in dependencies
  const [blockedcountry, setblockedcountry] = useState([]);
  const [countryname, setCountryname] = useState('');
  //   const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchCountry = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        console.log('Country name', response.data.country_name);
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
  const changevisibility = async () => {
    const videoRef = doc(db, 'Global Post', videoId);
    const videoDoc = await getDoc(videoRef);
    if (videoDoc.exists()) {
      const videoData = videoDoc.data();
      if (videoData['membersonly']) {
        setcurrentsetmemberonly(false);
        await updateDoc(videoRef, { 'membersonly': false });
      } else {
        setcurrentsetmemberonly(true);
        await updateDoc(videoRef, { 'membersonly': true });
      }
    }
  }
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
  // const { userId } = useParams();
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
  const [memberonly, setmemberonly] = useState([]);
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
          const MembersOnly = [];
          const blockcountry = [];
          const membervideo = false;
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
              setmemberonly(MembersOnly);
              blockcountry.push(videoData['Country_Blocked']);
              // setblockedcountry(videoData['Country_Blocked']);
              MembersOnly.push(videoData['membersonly'] || false);
              UploadDates.push(videoData['Uploaded At']);
              Videolink.push(videoData['Video Link']);
              setVIDs(data.VID);

            }
          }
          // console.log('BLocked Country', blockcountry);

          setThumbnails(Array.from(uniqueThumbnails));
          setblockedcountry(blockcountry);
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
        likes: [],
        dislikes: [],
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
  const [loadingcomment, setLoadingcomment] = useState(true);
  const [commentliked, setcommentliked] = useState([]);
  const [commentdisliked, setcommentdisliked] = useState([]);
  const fetchcomments = async () => {
    setLoadingcomment(true); // Set loading to true at the start
    try {
      const docRef = doc(db, 'Comment ID', 'Comment ID Generated');
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const CommentIDs = data.commentId || []; // Ensure this is an array
        setcommentdataid(CommentIDs);

        const fetchedComments = [];
        const commenterdetails = [];
        const commentpfp = [];
        const commentvideoid = [];
        const commentownerid = [];
        const commentupload = [];

        for (const commentID of CommentIDs) {
          const commentRef = doc(db, 'Comment Details', commentID.toString());
          const commentDoc = await getDoc(commentRef);

          if (commentDoc.exists()) {
            const commentData = commentDoc.data();
            commentupload.push(commentData.timestamp);
            fetchedComments.push(commentData.comment);
            commentvideoid.push(commentData.VideoID);
            commentownerid.push(commentData.commenter);

            // Fetch likes and dislikes directly for logging
            const likes = commentData.likes;
            const dislikes = commentData.dislikes;

            setcommentliked(likes);
            setcommentdisliked(dislikes);

            // Fetch commenter details
            const commenterRefs = doc(db, 'User Details', commentData.commenter);
            const commenterDocs = await getDoc(commenterRefs);
            if (commenterDocs.exists()) {
              const commenterData = commenterDocs.data();
              commenterdetails.push(commenterData.Username);
            } else {
              console.log(`Commenter not found for UID: ${commentData.commenter}`);
            }

            // Fetch profile picture
            const commenterRefss = doc(db, 'User Profile Pictures', commentData.commenter);
            const commenterDocss = await getDoc(commenterRefss);
            if (commenterDocss.exists()) {
              const commenterDatas = commenterDocss.data();
              commentpfp.push(commenterDatas['Profile Pic']);
            }
          } else {
            console.log(`No comment found for ID: ${commentID}`);
          }
        }

        setComments(fetchedComments);
        setcommentpfp(commentpfp); // Set profile pictures separately
        setcommentername(commenterdetails);
        setcomentowners(commentownerid);
        setcommentdate(commentupload);
        setcommentedvideo(commentvideoid);
        console.log('Liked final one', commentliked);
      } else {
        console.log('No Comment ID document found!');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingcomment(false); // Set loading to false after data fetching is complete
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
          // setcommentdate(data.timestamp);
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
  const [savevideo, setsaved] = useState(false);
  useEffect(() => {
    const fetchsavedvideos = async () => {
      try {
        const docref = doc(db, 'Global Playlists', auth.currentUser.uid);
        const docSnapshot = await getDoc(docref);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const savedvideos = data['VID'];
          if (savedvideos.includes(videoId)) {
            setsaved(true);
          }
        }
      } catch (error) {

      }
    }
    fetchsavedvideos();
  }, [])
  const savevideos = async () => {
    try {
      const docref = doc(db, 'Global Playlists', auth.currentUser.uid);
      const dataToUpdate = {
        'VID': arrayUnion(videoId), // Add the random number to the array
      };

      // Update the document with merge: true to keep existing fields
      await setDoc(docref, dataToUpdate, { merge: true });
      setsaved(true);
    } catch (error) {
      console.log(error);
    }
  }
  const removevideos = async () => {
    try {
      const docref = doc(db, 'Global Playlists', auth.currentUser.uid);
      const dataToUpdate = {
        'VID': arrayRemove(videoId), // Add the random number to the array
      };

      // Update the document with merge: true to keep existing fields
      await setDoc(docref, dataToUpdate, { merge: true });
      setsaved(false);
    } catch (error) {
      console.log(error);
    }
  }
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(''); // For displaying selected image
  const [uploading, setuploading] = useState(false);

  const showFileName = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url); // Show selected image
      setThumbnailFile(file);
    } else {
      setImageSrc(''); // Reset if no file
      setThumbnailFile(null);
    }
  };

  const uploadFiles = async () => {
    console.log('Firestore uploading...');
    const thumbnailRef = ref(storage, `thumbnails/${thumbnailFile.name}`);

    // Upload thumbnail to Firebase Storage
    await uploadBytes(thumbnailRef, thumbnailFile);

    // Get the download URL
    const thumbnailURL = await getDownloadURL(thumbnailRef);
    return { thumbnailURL };
  };

  const uploadthumbnail = async () => {
    setuploading(true);
    try {
      const { thumbnailURL } = await uploadFiles();

      // Reference to the document in Firestore
      const commentRef = doc(db, 'Global Post', videoId);
      const commentDetails = {
        'Thumbnail Link': thumbnailURL, // Store the thumbnail URL in Firestore
      };

      // Set the document in Firestore
      await updateDoc(commentRef, commentDetails, { merge: true }); // Use merge to update or create

      console.log('Video uploaded successfully:', commentDetails);
      setuploading(false);
      window.location.replace('/'); // Redirect after successful upload
    } catch (error) {
      console.error('Error uploading to Firestore:', error); // Log specific upload errors
      setuploading(false); // Stop loading on error
    }
  };
  const [likedcomment, setlikedcomment] = useState(false);
  const [dislikedcomment, setdislikecomment] = useState(false);
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
              Uploaded {videoupload && videoupload.seconds
                ? formatTimeAgo(videoupload)
                : "Unknown date"}
            </div>
            <div className='ekhbfehfss' style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "20px" }}>
              <Link to={`/profile/${videoowner}`}>
                <img src={videoownerpfp} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
              </Link>
              <Link style={{ textDecoration: 'none', color: 'black' }} to={`/profile/${videoowner}`}>
                <div className="jfvjnf" style={{ fontWeight: "300", fontSize: "15px", marginTop: "0px" }}>
                  {videoownername}
                </div>
                <div className="jfvjnf" style={{ fontWeight: "300", fontSize: "15px", color: 'grey' }}>
                  {subscount.length === 1 || subscount.length === 0 ? subscount.length + ' Subscriber' : subscount.length + ' Subscribers'}
                </div>
              </Link>

              {
                auth.currentUser ? auth.currentUser.uid === videoowner ? <Link style={{ textDecoration: 'none', color: 'white', fontSize: "15px", marginLeft: "50px", marginTop: "-10px" }} data-testid="subscribe-link" to={`/channel/${auth.currentUser.uid}/editing/profile`} className='jenfjenfkmk'>
                  <div className="jfjdnkf" style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                    <div className='hebfjenk' >
                      <center>Customize</center>
                    </div>
                    <Link to="#" onClick={toggleModal} style={{ textDecoration: 'none', color: 'white' }}>
                      <div className='hebfjenk'>
                        <center>Edit Video</center>
                      </div>
                    </Link>

                    {isModalOpen && (
                      <div className="modal-overlay" onClick={toggleModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                          <h2>Edit Video</h2>
                          <div className="ejfkmedkf" style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                            <img
                              src={imageSrc || videothumbnail} // Replace with your default thumbnail URL
                              alt="Thumbnail Preview"
                              height={"150px"}
                              width={"100%"}
                              style={{ borderRadius: "10px" }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={showFileName}
                              style={{ display: 'none' }}
                              id="file-input"
                              onClick={uploading ? null : uploadthumbnail}
                            />
                            <label htmlFor="file-input" style={{ textDecoration: 'none', color: 'white' }} onClick={uploading && imageSrc != null ? null : uploadthumbnail} >
                              <div className='hebfjenk' style={{ width: "fit-content", paddingLeft: "10px", paddingRight: "10px", cursor: 'pointer' }} onClick={uploading && imageSrc != null ? null : uploadthumbnail} >
                                <center>{uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Thumbnail'}</center>
                              </div>
                            </label>
                            <Link to="#" onClick={uploading && imageSrc != null ? null : uploadthumbnail} style={{ display: 'none' }}>
                              <div />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                    <Link style={{ textDecoration: 'none', color: 'white' }}>
                      <div className='hebfjenk' style={{ marginTop: "10px" }} onClick={handleSaveClick}>
                        <center>
                          {/* <?xml version="1.0" encoding="utf-8"?> */}
                          {savedvideos ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="800px" viewBox="0 0 20 20" fill="#ffffff" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" stroke-width="0" />
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                              <title>Remove Saved</title>
                              <rect x="0" fill="none" width="20" height="20" />
                              <g>
                                <path d="M15.3 5.3l-6.8 6.8-2.8-2.8-1.4 1.4 4.2 4.2 8.2-8.2" />
                              </g>
                            </g>
                          </svg>
                            : <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3 15.2346C3.15224 14.7446 3.35523 14.3552 3.15224 14.1522C3 14 3 14 4.23463 14H4.2346M12 15V4M12 15L9 12M12 15L15 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>}
                        </center>
                      </div>

                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white' }} >
                      <div className='hebfjenk' style={{ width: "fit-content", paddingLeft: "10px", paddingRight: "10px" }} onClick={changevisibility}>
                        <center>{currentmemberonly ? 'Make Public' : 'Make Members Only'}</center>
                      </div>
                    </Link>

                  </div>
                </Link> : subscount.includes(auth.currentUser.uid) ? (
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <Link style={{ textDecoration: 'none', color: 'white' }} data-testid="subscribed-link">
                      <div className='hebfjenk' style={{ backgroundColor: '#f2dfdf', color: 'black', border: '1px solid black', fontSize: "15px", marginLeft: "50px", marginTop: "-5px" }} onClick={handleSubscribe}>
                        <center>Subscribed</center>
                      </div>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white' }}>
                      <div className='hebfjenk' style={{ marginTop: "-3px" }} onClick={handleSaveClick}>
                        <center>
                          {/* <?xml version="1.0" encoding="utf-8"?> */}
                          {savedvideos ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="800px" viewBox="0 0 20 20" fill="#ffffff" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" stroke-width="0" />
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                              <title>Remove Saved</title>
                              <rect x="0" fill="none" width="20" height="20" />
                              <g>
                                <path d="M15.3 5.3l-6.8 6.8-2.8-2.8-1.4 1.4 4.2 4.2 8.2-8.2" />
                              </g>
                            </g>
                          </svg>
                            : <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3 15.2346C3.15224 14.7446 3.35523 14.3552 3.15224 14.1522C3 14 3 14 4.23463 14H4.2346M12 15V4M12 15L9 12M12 15L15 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>}
                        </center>
                      </div>

                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <Link style={{ textDecoration: 'none', color: 'white', fontSize: "15px", marginLeft: "50px", marginTop: "-15px" }} data-testid="subscribe-link">
                      <div className='hebfjenk' onClick={handleSubscribe} >
                        <center>Subscribe</center>
                      </div>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'white' }}>
                      <div className='hebfjenk' style={{ marginTop: "-3px" }} onClick={handleSaveClick}>
                        <center>
                          {/* <?xml version="1.0" encoding="utf-8"?> */}
                          {savedvideos ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="800px" viewBox="0 0 20 20" fill="#ffffff" stroke="#ffffff">

                            <g id="SVGRepo_bgCarrier" stroke-width="0" />

                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                            <g id="SVGRepo_iconCarrier"> <rect x="0" fill="none" width="20" height="20" /> <g> <path d="M15.3 5.3l-6.8 6.8-2.8-2.8-1.4 1.4 4.2 4.2 8.2-8.2" /> </g> </g>

                          </svg> : <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3 15.2346C3.15224 14.7446 3.35523 14.3552 3.15224 14.1522C3 14 3 14 4.23463 14H4.2346M12 15V4M12 15L9 12M12 15L15 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>}
                        </center>
                      </div>

                    </Link>
                  </div>

                ) : <></>
              }
              {
                auth.currentUser && auth.currentUser.uid != videoowner ? <Link style={{ textDecoration: 'none', color: 'white' }}>
                  <div className='hebfjenk' onClick={() => {
                    savevideo ? removevideos() : savevideos();
                  }} style={{ marginTop: "-3px" }}>
                    {
                      !savevideo ? <svg aria-label="Save" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg> : <svg aria-label="Remove" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Remove</title><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>
                    }
                  </div>

                </Link> : <></>
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
                    <img src={photourl} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
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
                        window.location.reload();
                      }}>Comment</button> : <></>
                    }
                  </Link> : <></>
                }
              </div>

              <div className="ehgfehfjefn" style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "50px" }}>
                {
                  loadingcomment ? <div style={{ display: "flex", justifyContent: "center" }}><CircularProgress size={24} color="#4285F4" /></div> :
                    comments.map((comment, index) => (
                      commentedvideo[index] == videoId ? <div className="jefjkf" style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "10px", flexDirection: 'row', gap: "10px", fontWeight: "500", fontSize: "15px" }} key={index}>
                        <div className="bnbnfnv" style={{ height: "40px", width: "40px", borderRadius: "50%", backgroundColor: "grey" }}>
                          <img src={commentpfp[index]} alt="" height={"40px"} width={"40px"} style={{ borderRadius: "50%" }} />
                        </div>
                        <div className="knkfnvk" style={{ display: "flex", flexDirection: "column", marginTop: "2px", gap: "5px", fontWeight: "600", fontSize: "15px" }}>
                          <div className="vkfk" style={{ display: "flex", flexDirection: "row", gap: "15px", fontWeight: "600", fontSize: "15px" }}>

                            <Link style={{ textDecoration: 'none', color: 'black', marginTop: "5px" }} to={`/profile/${commentowners[index]}`}>
                              <div className="jjhfkjfk" style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                {commentername[index]}
                                <div className="jedhjef" style={{ marginLeft: "5px", color: "grey", fontSize: "12px", marginTop: "2px" }}>
                                  {formatTimeAgo(commenrdate[index])}
                                </div>
                              </div>
                            </Link>
                            <div onClick={async () => {
                              const docRef = doc(db, 'Comment ID', "Comment ID Generated");
                              // Prepare the data to upload, including the random number
                              const dataToUpdate = {
                                commentId: arrayRemove(commentataid[index]), // Add the random number to the array
                              };

                              // Update the document with merge: true to keep existing fields
                              await setDoc(docRef, dataToUpdate, { merge: true });
                              window.location.reload();
                            }} style={{ textDecoration: 'none', color: 'black' }}>
                              {
                                user ? commentowners[index] === auth.currentUser.uid ? <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="red"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <path d="M3 6h18v2H3zm1 3h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V9zm3 3h2v6H7zm4 0h2v6h-2zm4 0h2v6h-2z" />
                                </svg> : <></> : <></>
                              }
                            </div>
                          </div>
                          {/* </Link> */}
                          <div className="vkfk" style={{ fontWeight: "300", fontSize: "12px", display: "flex", flexDirection: "column", gap: "5px" }}>
                            <div className="dhjs">
                              {comments[index]}
                            </div>
                            <div className="idkjcd" style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
                              {/* <div className="likecomment" onClick={() => {
                                if (commentliked[index]) {
                                  setlikedcomment(false);
                                }
                                else {
                                  setlikedcomment(true);
                                  setdislikecomment(false);
                                }
                              }}>
                                <svg stroke={commentliked[index].includes(auth.currentUser.uid) ? "green" : "black"} fill={commentliked[index].includes(auth.currentUser.uid) ? "green" : "black"} stroke-width="5" viewBox="0 0 1024 1024" height="15" width="15" xmlns="http://www.w3.org/2000/svg" class="text-green-500"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg>
                              </div>
                              <div className="dislikecomment" onClick={() => {
                                if (commentdisliked[index]) {
                                  setdislikecomment(false);

                                }
                                else {
                                  setdislikecomment(true);
                                  setlikedcomment(false);
                                }
                              }}>
                                <svg stroke={"black"} fill={"black"} stroke-width="5" viewBox="0 0 1024 1024" height="15" width="15" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4z"></path></svg>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div> : <></>
                    ))}
              </div>

            </div>
            <div className="relatedvideos">
              {
                thumbnails.map((thumbnail, index) => (
                  !memberonly[index] ? <div className="jnfvkf">
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

                        <p>{uploaddate[index] && uploaddate[index].seconds
                          ? formatTimeAgo(uploaddate[index])
                          : "Unknown date"}</p>
                      </div>
                    </div>

                  </div> : <></>
                ))
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}