import axios from 'axios';
import { setPosts} from '../redux/postSlice';
const API_URL = 'http://localhost:8800';

export const API = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

export const apiRequest = async (options) => {
  const { url, token, data, method } = options;
  try {
    const result = await API(url, {
      method: method || 'GET',
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return result?.data;
  } catch (error) {
    const err = error.response ? error.response.data : error;
    console.error(err);
    return { status: 'failed', message: err.message || 'An error occurred' };
  }
};


export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append('file', uploadFile);
  formData.append('upload_preset', 'social-media');
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || '/posts',
      token: token,
      method: 'POST',
      data: data || {},
    });
    dispatch(setPosts(res?.data));
    return;
  } catch (error) {
    console.error(error);
  }
};

export const likePost = async ({ uri, token }) => {
  try {
    const res = await apiRequest({
      url: uri,
      token: token,
      method: 'POST',
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async ({ id, token }) => {
  try {
    const res = await apiRequest({
      url: `/posts/${id}`,
      token: token,
      method: 'DELETE',
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getUserInfo = async ({ id, token }) => {
  try {
    const uri = id === undefined ? '/users/get-user' : `/users/get-user/${id}`;
    const res = await apiRequest({
      url: uri,
      token: token,
      method: 'POST',
    });
    if (res?.message === 'Authentication failed') {
      localStorage.removeItem('user');
      window.alert("User session expired. Login again.");
      window.location.replace('/login');
    }
    return res?.user;
  } catch (error) {
    console.error(error);
  }
};

export const sendFriendRequest = async ({ id, token }) => {
  try {
    const res = await apiRequest({
      url: '/users/friend-request/',
      token: token,
      method: 'POST',
      data: { requestTo: id },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const viewUserProfile = async ({ id, token }) => {
  try {
    const res = await apiRequest({
      url: '/users/profile-view/',
      token: token,
      method: 'POST',
      data: { id },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
