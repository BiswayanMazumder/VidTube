import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { arrayUnion, doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
export default function Communitypage() {
    const { userId } = useParams();
    const [currentuser, setcurrentuser] = useState(false);
    // const [currentuser, setcurrentuser] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setcurrentuser(uid === userId);
            } else {
                setcurrentuser(false);
            }
        });
    }, [userId]);
    const [commupload, setcommupload] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [subs, setSubs] = useState([]);
    const [vidData, setVidData] = useState([]);
    const [videoCount, setVideoCount] = useState(0);
    const [loading, setLoading] = useState(true);
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
            }
        };

        const fetchData = async () => {
            try {
                const docRef = doc(db, 'Global VIDs', 'VIDs');
                const docSnapshot = await getDoc(docRef);
                let count = 0;

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setVidData(data.VID);

                    for (let i = 0; i < data.VID.length; i++) {
                        const videoRef = doc(db, 'Global Post', data.VID[i]);
                        const videoDoc = await getDoc(videoRef);

                        if (videoDoc.exists()) {
                            const videoData = videoDoc.data();
                            const uploader = videoData['Uploaded UID'];

                            if (uploader === userId) {
                                count += 1;
                            }
                        } else {
                            console.log(`Video not found for VID: ${data.VID[i]}`);
                        }
                    }
                    setVideoCount(count);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUserData(), fetchData()]);
            setLoading(false);
        };

        loadData();
    }, [userId]);
    const fetchUserData = async () => {
        try {
            const docRef = doc(db, "Community Posts", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const subData = docSnap.data();
                setCommunityPosts(subData['Posts']); // Assuming 'Posts' is an array of objects
                // setcommupload(subData['Date of Upload']);
                console.log('Fetched data:', subData); // Log the fetched data
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        }
    };
    useEffect(() => {


        fetchUserData();
    }, [userId]);
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
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    const [commload, setcommload] = useState(false);
    return (
        <div className='webbody'>
            <div className="jnkmkkdkd">
                {
                    currentuser ? <div className="nmkvmlkd" style={{ height: "280px", display: 'flex', flexDirection: 'column' }}>
                        <div className="jfnvjfnv" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={dp} alt="" height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                            <div className="enmndv" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                                {name}
                            </div>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            style={{
                                flexGrow: 1,
                                marginTop: '10px',
                                border: 'none',
                                outline: 'none',
                                position: 'relative',
                                width: '95%',
                                lineHeight: '1.2',
                                boxShadow: 'none' // Remove any box-shadow if needed
                            }}
                            placeholder='What is on your mind?'
                        />
                        <div className="jrhkfjk">
                            <Link style={{ textDecoration: 'none', color: 'white', cursor: inputValue === '' ? 'not-allowed' : 'pointer' }} data-testid="subscribe-link">
                                <div className='hebfjenk' style={{ backgroundColor: inputValue === '' ? 'grey' : 'rgb(94, 94, 239)' }} onClick={async () => {
                                    if (inputValue === '') return; // Check if inputValue is empty

                                    const docRef = doc(db, 'Community Posts', auth.currentUser.uid);
                                    const dataToUpdate = {
                                        'Posts': arrayUnion({
                                            // 'Date of Upload': serverTimestamp(),
                                            'Posts': inputValue,
                                            'User ID': auth.currentUser.uid
                                        })
                                    };

                                    await setDoc(docRef, dataToUpdate, { merge: true });
                                    setInputValue('');
                                    await fetchUserData();
                                }}
                                >
                                    <center>Post</center>
                                </div>
                            </Link>
                        </div>
                    </div> : <></>
                }
                {

                    communityPosts.map((post, index) => (

                        <div key={index} className="nmkvmlkd">
                            <div className="jfnvjfnv">
                                <img src={dp} alt="" height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                <div className="enmndv" style={{ fontWeight: 'bold' }}>
                                    {name}
                                </div>
                                {/* <div className="enmndv">
                                    {formatTimeAgo(commupload[index])}
                                </div> */}
                            </div>
                            <p>{post.Posts}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
