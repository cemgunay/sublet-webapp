import api from "./api/axios";

export const loginCall = async (userCredentials, dispatch, setIsError)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const res = await api.post("auth/login", userCredentials)
        console.log(res)
        dispatch({type:"LOGIN_SUCCESS", payload: res.data });
    } catch (err){
        console.log(err)
        dispatch({type:"LOGIN_FAILURE", payload: err });

    }
};