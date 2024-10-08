import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from '../Components/header'
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

export default function ProfilePage() {
    const { userId } = useParams(); // Get userId from the URL
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'User Details', userId);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setName(userData.Username);
                    setBio(userData.Bio);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                const coverDocRef = doc(db, 'User Cover Pictures', userId);
                const coverDocSnapshot = await getDoc(coverDocRef);
                if (coverDocSnapshot.exists()) {
                    const coverData = coverDocSnapshot.data();
                    setCoverPic(coverData['Cover Pic']);
                }
            } catch (error) {
                console.error(error);
            }

            try {
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
        fetchData();
    }, [userId]);

    useEffect(() => {
        document.title = `${name} - VidTube`;
    }, [name]);

    return (
        <div>
        <Header/>
            <div className="videobody">
                <div className='coverpic'>
                    <img
                        src={coverPic}
                        alt=""
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: "10px" }}
                    />
                </div>
                <div className="coverpic" style={{ marginTop: '-20px', display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'start' }}>
                    <div className="profilepic">
                        <img src={dp} alt="" height={"150px"} width={"150px"} style={{ borderRadius: '50%' }} />
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        <div style={{ fontWeight: "600", fontSize: "22px" }}>
                            {name}
                        </div>
                        <div style={{ marginTop: "10px", color: "gray", fontSize: "13px" }}>
                            {bio}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
