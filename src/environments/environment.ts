import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB0UEpkeraZqdS_arGhvGv6j3k_ET8XVEQ',
  authDomain: 'product-management-5970e.firebaseapp.com',
  projectId: 'product-management-5970e',
  storageBucket: 'product-management-5970e.appspot.com',
  messagingSenderId: '601719783393',
  appId: '1:601719783393:web:2535748f453ed3c01adca0',
  measurementId: 'G-GCZTYBQN3F',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
