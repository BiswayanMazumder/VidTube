import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/header';
import { initializeApp } from 'firebase/app';
import { arrayUnion, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import Navbar_upload from '../Components/Navbar_upload';

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
const storage = getStorage(app);

export default function Uploadvideo() {
    const { userId } = useParams();
    const navigate = useNavigate(); // Use navigate for redirection
    const [imageSrc, setImageSrc] = useState('');
    const [videosrc, setvideosrc] = useState('');
    const [title, setTitle] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [accessType, setAccessType] = useState('public'); // Default to 'public'
    const [isLoading, setIsLoading] = useState(false); // Loading state

    useEffect(() => {
        const checkAuth = () => {
            if (auth.currentUser) {
                onAuthStateChanged(auth, (user) => {
                    if (!user) {
                        window.location.replace('/');
                    }
                });
            } else {
                window.location.replace('/');
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        setIsFormValid(imageSrc && videosrc && title);
    }, [imageSrc, videosrc, title]);

    const showFileName = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setThumbnailFile(file);
        } else {
            setImageSrc('');
            setThumbnailFile(null);
        }
    };

    const showFileNameVideo = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setvideosrc(url);
            setVideoFile(file);
        } else {
            setvideosrc('');
            setVideoFile(null);
        }
    };

    const [randomNumber, setRandomNumber] = useState(0);
    const generateRandomNumber = () => Math.floor(1000000000 + Math.random() * 9000000000);

    useEffect(() => {
        setRandomNumber(generateRandomNumber());
    }, []);

    const uploadFiles = async () => {
        const thumbnailRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
        const videoRef = ref(storage, `videos/${videoFile.name}`);

        // Upload thumbnail
        await uploadBytes(thumbnailRef, thumbnailFile);
        const thumbnailURL = await getDownloadURL(thumbnailRef);

        // Upload video
        await uploadBytes(videoRef, videoFile);
        const videoURL = await getDownloadURL(videoRef);

        return { thumbnailURL, videoURL };
    };

    const uploadvideoid = async () => {
        const docRef = doc(db, 'Global VIDs', "VIDs");
        const dataToUpdate = {
            VID: arrayUnion(randomNumber.toString()),
        };
        await setDoc(docRef, dataToUpdate, { merge: true });
    };

    const uploadvideo = async () => {
        setIsLoading(true); // Start loading
        await uploadvideoid();
        try {
            const { thumbnailURL, videoURL } = await uploadFiles();
            const commentred = doc(db, 'Global Post', randomNumber.toString());
            const commentdetails = {
                Caption: title,
                'Uploaded UID': auth.currentUser.uid,
                'Thumbnail Link': thumbnailURL,
                'Video Link': videoURL,
                Country_Blocked: arrayUnion('Pakistan'),
                'Uploaded At': serverTimestamp(),
                Views: 0,
                membersonly: accessType === 'member', // Set to true if 'Members Only' is selected
            };

            await setDoc(commentred, commentdetails);
            console.log('Video uploaded successfully:', commentdetails);
            navigate('/'); // Redirect to home screen after upload
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className='webbody'>
            <Header />
            <Navbar_upload/>
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
                            <input
                                type="text"
                                style={{ width: '90%', paddingLeft: '10px' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="rjjnvnv">
                        Video Type
                        <div className="jjmjskjk">
                            <div>
                                <label style={{ marginRight: '50px' }}>
                                    <input 
                                        type="radio" 
                                        name="access" 
                                        value="public" 
                                        checked={accessType === 'public'}
                                        onChange={() => setAccessType('public')} 
                                        style={{ width: '12px', height: '12px' }} 
                                    />
                                    Public
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="access" 
                                        value="member" 
                                        checked={accessType === 'member'}
                                        onChange={() => setAccessType('member')} 
                                        style={{ width: '12px', height: '12px' }} 
                                    />
                                    Members Only
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="jjmjskjk">
                        <div
                            className="djjvdndnv"
                            style={{
                                width: '90%',
                                backgroundColor: isFormValid && !isLoading ? '#4285F4' : '#cccccc',
                                height: '50px',
                                borderRadius: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontFamily: "'Poppins', sans-serif",
                                cursor: isFormValid && !isLoading ? 'pointer' : 'not-allowed'
                            }}
                            onClick={() => {
                                if (isFormValid && !isLoading) {
                                    uploadvideo();
                                }
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" /> // Show loading indicator
                            ) : (
                                'PUBLISH'
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
