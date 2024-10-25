import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from '../Components/header';
import Navbar_mobile from '../Components/navbar_mobile';
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default function Aboutpage() {
    const { userId } = useParams();
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [subs, setSubs] = useState([]);
    const [vidData, setVidData] = useState([]);
    const [videoCount, setVideoCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [instaacc, setinstaacc] = useState('');
    const [xacc, setxacc] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'User Details', userId);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setName(userData.Username);
                    setBio(userData.Bio);
                    setinstaacc(userData.Instagram || 'No Instagram account available');
                    setxacc(userData.X || 'No X account available');
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

                setLoading(false); // All data is loaded
            } catch (error) {
                console.error(error);
                setLoading(false); // Even if there's an error, stop loading
            }
        };

        fetchUserData();
    }, [userId]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching VID data...");
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
                    // console.log('Total videos uploaded by user:', count);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [userId]);
    return (
        <div className='webbody'>
            <div className="ldlvjic" style={{ position: 'fixed', bottom: '0px', width: '100%', left: '0px' }}>
                <Navbar_Profile />
            </div>
            <div className="jhcdjkj">
                Channel Details
            </div>
            <br /><br />
            <div className="jhcdjkj">
                Bio
            </div>
            <br />
            <div className="jdhfjk">
                {bio}

            </div>
            <br /><br />
            <div className="jhcdjkj">
                Subscribers
            </div>
            <br />
            <div className="jdhfjk">
                {subs.length > 1 ? subs.length + " Subscribers" : subs.length + " Subscriber"}
            </div>
            <br /><br />
            <div className="jhcdjkj">
                Videos
            </div>
            <br />
            <div className="jdhfjk">
                {videoCount > 1 ? videoCount + " Videos" : videoCount + " Video"}
            </div>
            <br /><br />
            <div className="jhcdjkj">
                Channel URL
            </div>
            <br />
            <a
                href={document.URL}
                style={{ textDecoration: 'none', color: 'black' }}
                target="_blank"
                rel="noopener noreferrer"
            >
                {document.URL}
            </a>
            {
                instaacc != 'No Instagram account available' ? <div>
                    <br /><br />
                    <div className="jhcdjkj" style={{display:"flex",flexDirection:"row",gap:"10px"}}>
                    <img src="https://encrypted-tbn3.gstatic.com/favicon-tbn?q=tbn:ANd9GcQSlK46mwDDaUXGvco9TRBnKyzSycwlQHp3G-PyMNHw0XcUw-Uh_2tlI2D3vj7F1vLzXeNfKclfaw5EwOqlfA6a15Kct8yeChp_WcbdMDSBZcLbUbYigg" alt="" height={"20px"} width={"20px"} style={{marginTop:"2px"}} />
                        Instagram   
                    </div>
                    <br />
                    <a
                        href={instaacc}
                        style={{ textDecoration: 'none', color: 'black' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {instaacc}
                    </a>
                </div> : <></>
            }
            <br /><br />
            {
                xacc != 'No X account available' ? <div>
                    <div className="jhcdjkj" style={{display:"flex",flexDirection:"row",gap:"10px"}}>
                    <img src="https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn:ANd9GcS2QyngJ3CEbdBgAkNjyoe2UhJSeW99hiQFfdlhpSl99gGL7jEN3BuuHDrtdKNeT2LakbGYpgHO3Sl4CWrfgEsXa2lsti2iKgGsW8HvgrMhHA" alt="" height={"20px"} width={"20px"} style={{marginTop:"2px"}}/>
                        Twitter
                        
                    </div>
                    <br />
                    <a
                        href={xacc}
                        style={{ textDecoration: 'none', color: 'black' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {xacc}
                    </a>
                </div> : <></>
            }
        </div>

    )
}
