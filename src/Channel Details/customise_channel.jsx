import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
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
const storage = getStorage(app);

export default function Customise_channel() {
    const { userId } = useParams();
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    // Create a storage reference
                    const storageRef = ref(storage, `${userId}/${type}-${Date.now()}.png`);
                    const uploadResult = await uploadString(storageRef, reader.result, 'data_url');

                    // Get the download URL
                    const downloadURL = await getDownloadURL(uploadResult.ref);

                    if (type === 'cover') {
                        setCoverPic(downloadURL);
                        const coverDocRef = doc(db, 'User Cover Pictures', userId);
                        await updateDoc(coverDocRef, { 'Cover Pic': downloadURL });
                        setMessage('Uploaded');
                    } else if (type === 'profile') {
                        setDp(downloadURL);
                        const profileDocRef = doc(db, 'User Profile Pictures', userId);
                        await updateDoc(profileDocRef, { 'Profile Pic': downloadURL });
                        setMessage('Uploaded');
                    }
                } catch (error) {
                    console.error(error);
                    setMessage('Failed to upload image. Please try again.');
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
                {/* {message && <div className="message">{message}</div>} */}
                {/* Rest of your component code */}
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
                            <div className="effkf" style={{ cursor: 'pointer' }}>{message ? message : 'Upload'}</div>
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
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '20px', width: '80vw' }} />
                    </div>
                </div>
                <br /><br /><br />
                
                <div  style={{ textDecoration: 'none', color: 'black',width:'120px' }}>
                            <div className="effkf" style={{ cursor: 'pointer',width:'140px' }} onClick={async()=>{
                                console.log('Name',name);
                                const docRef = doc(db, 'User Details', auth.currentUser.uid);
                                await updateDoc(docRef, { 'Username': name });
                                window.location.replace('/')
                            }}>Set new name</div>
                        </div>
                <br /><br /><br />
                <div className="heading">
                    <div className="jrhgrjg">Description</div>
                    <br />
                    <div className="sjjcc">
                        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} style={{ paddingLeft: '20px', height: '200px', marginBottom: '100px', width: '80vw' }} />
                    </div>
                </div>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                {/* <br /><br /><br /> */}
                <div  style={{ textDecoration: 'none', color: 'black',width:'120px' }}>
                            <div className="effkf" style={{ cursor: 'pointer',width:'140px' }} onClick={async()=>{
                                console.log('Name',name);
                                const docRef = doc(db, 'User Details', auth.currentUser.uid);
                                await updateDoc(docRef, { 'Bio': bio });
                                window.location.replace('/')
                            }}>Set new bio</div>
                        </div>
                <br /><br /><br />
                <div className="heading">
                    <div className="jrhgrjg">Email</div>
                    <br />
                    <div className="sjjcc">
                        Let people know your email for business inquiries
                    </div>
                    <br />
                    <div className="sjjcc">
                        <input type="text" value={auth.currentUser.email} disabled style={{ paddingLeft: '20px', width: '80vw' }} />
                    </div>
                </div>
                <br /><br /><br />
            </div>
        </div>
    );
}
