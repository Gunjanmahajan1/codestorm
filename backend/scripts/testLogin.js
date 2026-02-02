require('dotenv').config({ path: __dirname + '/../.env' });
const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@codestrom.com',
      password: 'Admin@123',
    });

    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (e) {
    if (e.response) {
      console.error('Error response:', e.response.status, e.response.data);
    } else {
      console.error('Error:', e.message);
    }
  }
})();