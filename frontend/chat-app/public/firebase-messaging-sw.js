// Import the necessary Firebase libraries
/* global importScripts, firebase*/
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFA1FxMt9ZkUG2FjSiuyN6BN9JJZBiuxw",
  authDomain: "chat-app-98cb2.firebaseapp.com",
  projectId: "chat-app-98cb2",
  storageBucket: "chat-app-98cb2.firebasestorage.app",
  messagingSenderId: "163334037484",
  appId: "1:163334037484:web:eb3965cd45cd5988642ac9",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
