import React from 'react'
//import {useState, useMemo} from 'react'

//npm install react-select
//npm install react-select-country-list
//import Select from 'react-select'
//import countryList from 'react-select-country-list'
import Country from './Country'

import classes from './SignUp.module.css'

function Phone() {

  return (
    <div className={classes.container}>
      <form>
        <Country />
        <div >
          <input className={classes.phonenumber} type='tel' placeholder='Phone Number'></input>
        </div>
      </form>
      <div className={classes.text}>
        We will call or text to confirm your number. Standard SMS rates will apply.
      </div>
    </div>
  )
}

export default Phone

//Test Code For Country Select (DONT DELETE)

//<Select options={options} value={value} onChange={changeHandler} />

/*

const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
  }

*/