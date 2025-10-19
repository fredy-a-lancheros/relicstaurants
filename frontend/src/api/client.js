import axios from 'axios';

const RESTAURANT_BASE =
  process.env.REACT_APP_RESTAURANT_SERVICE_URL || 'http://lvh.me:3001';
const MENU_BASE =
  process.env.REACT_APP_MENU_SERVICE_URL || 'http://lvh.me:3003';
const CHECKOUT_BASE =
  process.env.REACT_APP_CHECKOUT_SERVICE_URL || 'http://lvh.me:3002';

export const apiRestaurant = axios.create({ baseURL: RESTAURANT_BASE });
export const apiMenu = axios.create({ baseURL: MENU_BASE });
export const apiCheckout = axios.create({ baseURL: CHECKOUT_BASE });
