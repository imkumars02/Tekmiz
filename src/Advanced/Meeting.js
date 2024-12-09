import React, { useEffect } from 'react'
import UserHeader from '../Header/UserHeader'
import Working from '../Working'

const Meeting = () => {
    useEffect(()=>{
        document.title = 'Tekmiz-Meeting';
    })
  return (
    <div>
        <UserHeader/>
        <Working/>
    </div>
  )
}

export default Meeting