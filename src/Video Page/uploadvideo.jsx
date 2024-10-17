import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Components/header';

export default function Uploadvideo() {
    const {userId}=useParams();
  return (
    <div>
      <Header/>
    </div>
  )
}
