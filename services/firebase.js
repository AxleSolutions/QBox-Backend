const admin = require('firebase-admin');

// Initialize Firebase Admin
// Note: You need to set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable
// with the content of your service account JSON file, or provide the path to it.

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : require('../config/firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin Initialized');
} catch (error) {
  console.error('❌ Firebase Admin Initialization Error:', error.message);
  console.log('⚠️ Notifications will not be sent until Firebase is properly configured.');
}

/**
 * Send a push notification to a specific device
 * @param {string} token - The FCM token of the target device
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Optional data payload
 */
const sendNotification = async (token, title, body, data = {}) => {
  if (!token) return;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
};
