import React from 'react'
import { useNavigate } from 'react-router-dom'

function List() {

    const navigate = useNavigate()

    const goToPostAListing = () => {
        navigate('/list/postlisting')
    }

  return (
    <>
    <div>Use subLet</div>
    <div>You could save $XCAD / month</div>
    <div>The above number will be based on the address they input below</div>
    <div>Enter Location - estimate will be more accurate based on if they enter an actual address or a city obvi cuz itll be the average of whats seen in that google maps area</div>
    <div>A map of current listings in area</div>
    <div>subLet Insurance</div>
    <div>Write about everything that we insure - see sample on airbnb website</div>
    <div>3% fee and guests will also be charged a fee</div>
    <button onClick={goToPostAListing}>Start subLetting</button>
    </>
  )
}

export default List