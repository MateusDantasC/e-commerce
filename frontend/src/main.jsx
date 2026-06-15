import React    from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App      from './App.jsx';
import axios from 'axios';
import store from './store.js';
import { logout } from './slices/userSlice.js';
import { unloadCart } from './slices/cartSlice.js';

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const state = store.getState();
      if (state.user.userInfo) {
        store.dispatch(unloadCart());
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);