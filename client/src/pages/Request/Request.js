import React from 'react'
import { useLocation, useParams } from 'react-router-dom';

function Request() {

  const { id } = useParams();
  const location = useLocation();
  const { data, listing } = location.state;

  console.log(data)
  console.log(listing)

  console.log(id)
  
  return (
    <div>Request</div>
  )
}

export default Request