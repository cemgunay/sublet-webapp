import axios from "axios"

export default axios.create({
    baseURL: 'http:localhost:8080'
});

export const loginCall = async (userCredentials, dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const res = await axios.post("auth/login", userCredentials);
        dispatch({type:"LOGIN_SUCCESS", payload: res.data });
    } catch (err){
        dispatch({type:"LOGIN_FAILURE", payload: err });
    }
};