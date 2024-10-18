import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/header';
import { initializeApp } from 'firebase/app';
import { arrayUnion, doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
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

export default function Uploadvideo() {
    const { userId } = useParams();
    const [imageSrc, setImageSrc] = useState('');
    const [videosrc, setvideosrc] = useState('');
    const [title, setTitle] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

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
        // Check if all required fields are filled
        setIsFormValid(imageSrc && videosrc && title);
    }, [imageSrc, videosrc, title]);

    const showFileName = (event) => {
        const file = event.target.files[0];
        const fileName = document.getElementById('file-name');

        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            fileName.textContent = file.name;
        } else {
            setImageSrc('');
            fileName.textContent = '';
        }
    };

    const showFileNameVideo = (event) => {
        const file = event.target.files[0];
        const fileName = document.getElementById('file-inputvideo-name');

        if (file) {
            const url = URL.createObjectURL(file);
            setvideosrc(url);
            fileName.textContent = file.name;
        } else {
            setvideosrc('');
            fileName.textContent = '';
        }
    };
    const [randomNumber, setRandomNumber] = useState(0);
  const generateRandomNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  };

  useEffect(() => {
    // Set a random number when the component mounts
    setRandomNumber(generateRandomNumber());
    // console.log('Rand',randomNumber);
  }, []);
  const uploadcommentid = async () => {
    try {
      // Create a reference to the document in Firestore
      const docRef = doc(db, 'Global VIDs', "VIDs");

      // Prepare the data to upload, including the random number
      const dataToUpdate = {
        VID: arrayUnion(randomNumber.toString()), // Add the random number to the array
      };

      // Update the document with merge: true to keep existing fields
      await setDoc(docRef, dataToUpdate, { merge: true });
      console.log('Updated Comment ID document successfully.');
      console.log('Comment ID uploaded successfully:', randomNumber.toString());
    } catch (error) {
      console.error('Error uploading comment ID:', error);
    }
  };
//   const uploadcomment = async () => {
//     await uploadcommentid();
//     try {
//       const commentred = doc(db, 'Comment Details', randomNumber.toString());
//       const commentdetails = {
//         title: commentText,
//         commenter: auth.currentUser.uid,
//         VideoID: videoId,
//         timestamp: serverTimestamp(),
//         likes: 0,
//         dislikes: 0,
//       };

//       // Log the comment details before writing
//       console.log('Comment Details:', commentdetails);

//       await setDoc(commentred, commentdetails);
//     } catch (error) {
//       console.log('Error:', error);
//     }
//   }
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
                        <div
                            className="djjvdndnv"
                            style={{
                                width: '90%',
                                backgroundColor: isFormValid ? '#4285F4' : '#cccccc',
                                height: '50px',
                                borderRadius: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontFamily: "'Poppins', sans-serif",
                                cursor: isFormValid ? 'pointer' : 'not-allowed'
                            }}
                            onClick={() => {
                                if (isFormValid) {
                                    generateRandomNumber();
                                    // uploadcommentid();
                                    console.log('Rand',randomNumber);
                                    console.log('Title',title);
                                }
                            }}
                        >
                            PUBLISH
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
