import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
const db = getFirestore(app);

export default function Customise_channel() {
    const { userId } = useParams();
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Channel customization - Vidtube Studio';
        if (!auth.currentUser) {
            window.location.replace('/');
        }
    }, []);

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

            const profileDocRef = doc(db, 'User Profile Pictures', userId);
            const profileDocSnapshot = await getDoc(profileDocRef);
            if (profileDocSnapshot.exists()) {
                const profileData = profileDocSnapshot.data();
                setDp(profileData['Profile Pic']);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false after data fetch
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'cover') {
                    setCoverPic(reader.result);
                    // Handle the upload logic for cover pic here
                } else if (type === 'profile') {
                    setDp(reader.result);
                    // Handle the upload logic for profile pic here
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <div className="loading-bar"></div>; // Show a loading message or spinner
    }

    return (
        <div className='webbody'>
            <Header />
            <div className="rjgjrgrkjg">
                <div className="heading">
                    <div className="jrhgrjg">Banner Image</div>
                    <br />
                    <div className="sjjcc">
                        This image will appear across the top of your channel
                    </div>
                </div>
                <br />
                <div className="ehfejkej">
                    <div className="ehjehdj" style={{ borderRadius: '10px' }}>
                        <img src={coverPic} alt="Cover" height={'160px'} width={'290px'} style={{ borderRadius: '10px' }} />
                    </div>
                    <div className="hhbjhdn">
                        For the best results on all devices, use an image that’s at least 2048 x 1152 pixels and 6MB or less.
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="cover-upload"
                            onChange={(e) => handleFileChange(e, 'cover')}
                        />
                        <label htmlFor="cover-upload" style={{ textDecoration: 'none', color: 'black' }}>
                            <div className="effkf" style={{ cursor: 'pointer' }}>Upload</div>
                        </label>
                    </div>
                </div>
                <br /><br />
                <div className="heading">
                    <div className="jrhgrjg">Picture</div>
                    <br />
                    <div className="sjjcc">
                        Your profile picture will appear where your channel is presented on VidTube, like next to your videos and comments
                    </div>
                </div>
                <br />
                <div className="ehfejkej">
                    <div className="ehjehdj" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px' }}>
                        <img src={dp} alt="Profile" height={'100px'} width={'100px'} style={{ borderRadius: '50%' }} />
                    </div>
                    <div className="hhbjhdn">
                        It’s recommended to use a picture that’s at least 98 x 98 pixels and 4MB or less.
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-upload"
                            onChange={(e) => handleFileChange(e, 'profile')}
                        />
                        <label htmlFor="profile-upload" style={{ textDecoration: 'none', color: 'black' }}>
                            <div className="effkf" style={{ cursor: 'pointer' }}>Upload</div>
                        </label>
                    </div>
                </div>
                <br /><br />
                <div className="heading">
                    <div className="jrhgrjg">Name</div>
                    <br />
                    <div className="sjjcc">
                        Choose a name that justifies your content
                    </div>
                    <br />
                    <div className="sjjcc">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '20px' }} />
                    </div>
                </div>
                <br /><br /><br />
                <div className="heading">
                    <div className="jrhgrjg">Description</div>
                    <br />
                    
                    {/* <br /> */}
                    <div className="sjjcc">
                        <input type="text" value={bio} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '20px',height:'200px',marginBottom:'100px' }}  />
                    </div>
                </div>
                <br /><br /><br />
            </div>
        </div>
    );
}
