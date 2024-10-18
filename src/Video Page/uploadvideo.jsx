import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/header';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
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
// import './Uploadvideo.css'; // Ensure this is imported

export default function Uploadvideo() {
    const { userId } = useParams();
    const [imageSrc, setImageSrc] = useState('');
    const [videosrc, setvideosrc] = useState('');
    useEffect(() => {
        if (auth.currentUser) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/auth/user
                    const uid = user.uid;

                    // ...
                } else {
                    // User is signed out

                    // ...
                }
            });
        }
        else {
            window.location.replace('/');
        }
    })
    const showFileName = (event) => {
        const file = event.target.files[0];
        const fileName = document.getElementById('file-name');

        if (file) {
            // Create a URL for the selected image
            const url = URL.createObjectURL(file);
            setImageSrc(url); // Set the image source to display it
            fileName.textContent = file.name; // Display the file name
        } else {
            setImageSrc(''); // Clear the image source if no file is selected
            fileName.textContent = ''; // Clear if no file is selected
        }
    };

    const showFileNameVideo = (event) => {
        const file = event.target.files[0];
        const fileName = document.getElementById('file-inputvideo-name');

        if (file) {
            // Create a URL for the selected video
            const url = URL.createObjectURL(file);
            setvideosrc(url); // Set the video source to display it
            fileName.textContent = file.name; // Display the file name
        } else {
            setvideosrc(''); // Clear the video source if no file is selected
            fileName.textContent = ''; // Clear if no file is selected
        }
    };

    return (
        <div className='webbody'>
            <Header />
            <div className="dffjdnmn">
                <div className="rjkjvkvk">
                    <div className="njvnnvm">
                        <h3>Upload Thumbnail</h3>
                        <div className="djkdmv">
                            <input
                                id="file-input"
                                className="file-input"
                                accept='image/*'
                                type='file'
                                onChange={showFileName}
                                style={{ display: 'none' }} // Hide the default input
                            />
                            <label htmlFor="file-input" className="file-label" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}>
                                {imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        alt="Selected"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '20px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    'No file selected'
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="rjjnvnv">
                        Select Video
                        <div className="djkdmv">
                            <input
                                id="file-inputvideo"
                                className="file-input"
                                accept='video/*'
                                type='file'
                                onChange={showFileNameVideo}
                                style={{ display: 'none' }} // Hide the default input
                            />
                            <label htmlFor="file-inputvideo" className="file-label" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}>
                                {videosrc ? (
                                    <video
                                        src={videosrc}
                                        alt="Selected"
                                        controls
                                        autoPlay
                                        loop
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '20px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    'No file selected'
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="rjjnvnv">
                        Title
                        <div className="jjmjskjk">
                            <input type="text" style={{ width: '90%',paddingLeft:'10px' }}/>
                        </div>
                    </div>
                    <div className="rjjnvnv">
                        Video Type
                        <div className="jjmjskjk">
                            <div>
                                <label style={{ marginRight: '50px' }}>
                                    <input type="radio" name="access" value="public" defaultChecked style={{ width: '12px', height: '12px' }} />
                                    Public
                                </label>
                                <label>
                                    <input type="radio" name="access" value="member" style={{ width: '12px', height: '12px' }} />
                                    Members Only
                                </label>
                            </div>
                        </div>

                    </div>
                    <div className="jjmjskjk">
                            <div className="djjvdndnv" style={{ width: '90%',backgroundColor:'#4285F4',height:'50px',borderRadius:'20px',display:'flex',justifyContent:'center',alignItems:'center',color:'white',fontFamily:"'Poppins', sans-serif"}}>
                            PUBLISH
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}
