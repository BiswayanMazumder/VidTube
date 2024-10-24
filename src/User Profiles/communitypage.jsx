import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar_Profile from '../Components/navbar_profile';

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
    const [currentuser, setCurrentUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setCurrentUser(uid === userId);
            } else {
                setCurrentUser(false);
            }
            setLoading(false); // Set loading to false after checking auth state
        });

        return () => unsubscribe(); // Clean up the subscription
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const docRef = doc(db, 'User Details', userId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setName(userData.Username);
            }

            const profileDocRef = doc(db, 'User Profile Pictures', userId);
            const profileDocSnapshot = await getDoc(profileDocRef);
            if (profileDocSnapshot.exists()) {
                const profileData = profileDocSnapshot.data();
                setDp(profileData['Profile Pic']);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchCommunityPosts = async () => {
        try {
            const docRef = doc(db, "Community Posts", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const subData = docSnap.data();
                setCommunityPosts(subData['Posts'] || []); // Default to empty array if no posts
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error("Error fetching community posts:", error);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchUserData();
            fetchCommunityPosts();
        }
    }, [loading, userId]);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handlePostSubmit = async () => {
        if (!auth.currentUser) return; // Ensure user is logged in
        if (inputValue === '') return; // Prevent empty posts

        const docRef = doc(db, 'Community Posts', auth.currentUser.uid);
        const dataToUpdate = {
            'Posts': arrayUnion({
                'Posts': inputValue,
                'User ID': auth.currentUser.uid,
            })
        };

        await setDoc(docRef, dataToUpdate, { merge: true });
        setInputValue('');
        fetchCommunityPosts(); // Refresh posts after adding
    };

    const handleDeletePost = async (index) => {
        if (!auth.currentUser) return; // Ensure user is logged in

        const docRef = doc(db, "Community Posts", userId);
        const dataToRemove = {
            'Posts': arrayRemove(communityPosts[index])
        };

        await updateDoc(docRef, dataToRemove);
        const updatedPosts = communityPosts.filter((_, i) => i !== index);
        setCommunityPosts(updatedPosts);
    };

    if (loading) return <div>Loading...</div>; // Loading state

    return (
        <div className='webbody'>
            <div className="ldlvjic" style={{ position: 'fixed', bottom: '0px', width: '100%', left: '0px' }}>
                <Navbar_Profile />
            </div>
            <div className="jnkmkkdkd">
                {currentuser && (
                    <div className="nmkvmlkd" style={{ height: "280px", display: 'flex', flexDirection: 'column' }}>
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
                                boxShadow: 'none'
                            }}
                            placeholder='What is on your mind?'
                        />
                        <div className="jrhkfjk">
                            <Link style={{ textDecoration: 'none', color: 'white', cursor: inputValue === '' ? 'not-allowed' : 'pointer' }}>
                                <div
                                    className='hebfjenk'
                                    style={{ backgroundColor: inputValue === '' ? 'grey' : 'rgb(94, 94, 239)' }}
                                    onClick={handlePostSubmit}
                                >
                                    <center>Post</center>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
                {communityPosts.map((post, index) => (
                    <div key={index} className="nmkvmlkd">
                        <div className="jfnvjfnv">
                            <img src={dp} alt="" height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                            <div className="enmndv" style={{ fontWeight: 'bold' }}>
                                {name}
                            </div>
                        </div>
                        <div className="nefjn" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: '10px' }}>
                            <p>{post.Posts}</p>
                            {auth.currentUser && currentuser && (
                                <Link>
                                    <div onClick={() => handleDeletePost(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="red">
                                            <path d="M3 6h18v2H3zm1 3h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V9zm3 3h2v6H7zm4 0h2v6h-2zm4 0h2v6h-2z"></path>
                                        </svg>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
