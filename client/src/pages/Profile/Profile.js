import React from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {

    const navigate = useNavigate()

    const goToListing = () => {
        navigate('/list')
    }

  return (
    <>
    <div>Profile</div>
    <button onClick={goToListing}>List a subLet</button>
    </>
  )
}

export default Profile