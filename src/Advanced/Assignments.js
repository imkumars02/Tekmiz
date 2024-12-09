import React, { useEffect } from 'react'
import UserHeader from '../Header/UserHeader'
import Working from '../Working'

const Assignments = () => {
    useEffect(()=>{
        document.title = 'Tekmiz-Assignments'
    });
  return (
    <div>
        <UserHeader/>
        <Working/>
    </div>
  )
}

export default Assignments