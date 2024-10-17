import React from 'react'
import { Link, useParams } from 'react-router-dom';

export default function Uploadbutton() {
  const { userId } = useParams();
  return (
    <div className='upload-button'>
      <Link to={`/channel/uploadvideo`} style={{ textDecoration: 'none',color: 'white' }}>
      <div className="button-content" >
        {/* Button content goes here */}
        <svg stroke="currentColor" fill="currentColor" height="30px" width="30px" stroke-width="0" viewBox="0 0 24 24" class="w-7 h-7" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z"></path></svg>
      </div>
      </Link>
    </div>
  )
}
