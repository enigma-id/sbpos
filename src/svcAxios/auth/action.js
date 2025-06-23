/**
 * Authentication Module
 * =====================
 * This module provides utility functions and Redux actions for user authentication,
 * including login, registration, logout, and resetting the authentication state.
 */

import { createAction } from '@reduxjs/toolkit';
import { request } from '../axios';
export const MODULE = 'Auth';

export const $reset = createAction(`${MODULE}/reset`);

export const $logout = createAction(`${MODULE}/signout`);

export const $login = async payload => {
  const options = {
    method: 'POST',
    url: '/auth/signin',
    data: payload,
  };

  return request(options);
};
