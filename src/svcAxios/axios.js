/**
 * Axios Client Wrapper with Authentication Support
 * ================================
 * This module sets up a reusable Axios client configured with optional authentication, handling
 * successful and error responses, and managing the `Authorization` header based on the current user's JWT token.
 */

import axios from 'axios';
// import { store } from '../services/store';

const API_URL = 'https://api.envio.co.id/dev/pos';

// Create an Axios instance with predefined configurations
const client = axios.create({
  baseURL: API_URL,
});

/**
 * Sends an HTTP request using the configured Axios client.
 *
 * This function will attach an `Authorization` header with the JWT token from the Redux store if available.
 * If no token is found, the request will be sent without the authorization header.
 *
 * @param {object} options - The configuration options for the HTTP request.
 * @returns {Promise<any>} A promise that resolves with the response data or rejects with the error.
 */
export const request = async options => {
  let token = '';

  // // Get the state from the Redux store
  // const state = store.getState();
  // const userState = state?.Auth?.data;

  // // Check if user is authenticated and extract JWT token
  // if (userState) {
  //   const { jwt } = userState;
  //   token = jwt;
  // }

  // // Set or clear the Authorization header based on token availability
  // if (token) {
  //   client.defaults.headers.common.Authorization = `Bearer ${token}`;
  // } else {
  //   delete client.defaults.headers.common.Authorization;
  // }

  // Handles a successful response
  const onSuccess = response => {
    return response.data;
  };

  // Handles an error response
  const onError = error => {
    return Promise.reject(error.response?.data || error.message);
  };

  // Send the HTTP request and handle response or error
  return client(options).then(onSuccess).catch(onError);
};
