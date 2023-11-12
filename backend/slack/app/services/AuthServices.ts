const jwt = require('jsonwebtoken');


const SECRET_KEY = 'JSOfbdl8qDMgUw3dV7/rBlFw55KsNZeq498NxAkN30EI0Hq3Msdn4nlbkTqsqPhberPr6E00Qwf83t06tj8OPA==';

export function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.sub; 
  } catch (error) {
    console.error('Error decoding token:', error.message);
    throw new Error('Invalid token');
  }
}