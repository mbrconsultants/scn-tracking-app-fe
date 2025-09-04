import {  toast } from 'react-toastify';

// export default function ForgotPassword() {
export const SuccessAlert = (msg) => {
    // window.alert("Invalid Credentials");
    toast.success(msg, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

    });
}

export const ErrorAlert = (message) => {
    // window.alert("Invalid Credentials");
    toast.error(message, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
  
    });
  }