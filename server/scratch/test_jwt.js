const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
console.log('Using Secret:', secret);

try {
  const token = jwt.sign({ id: 'test_user_id' }, secret, { expiresIn: '1h' });
  console.log('Generated Token:', token);
  
  const decoded = jwt.verify(token, secret);
  console.log('✅ Verification Successful:', decoded);
} catch (err) {
  console.error('❌ Verification Failed:', err.message);
}
