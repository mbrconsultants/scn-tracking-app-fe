import axios from 'axios';

let user = JSON.parse(localStorage.getItem("user"));
let token = ""
//if there is user in the localstorage get the token
if (user) {
  token = user.token;
  // console.log(token)
}
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: { Authorization: `${token}` },
});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('user')
    window.location.reload()
    return error;
  }
  throw error;
})

export default instance;

