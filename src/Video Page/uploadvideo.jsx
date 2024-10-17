import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/header';
// import './Uploadvideo.css'; // Ensure this is imported

export default function Uploadvideo() {
    const { userId } = useParams();
    const [imageSrc, setImageSrc] = useState('');
    const [videosrc, setvideosrc] = useState('');

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
                            <input type="text" style={{ width: '90%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
