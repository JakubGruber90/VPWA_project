import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
const { parse, verify } = require('jsonwebtoken');


export default class Auth {
  public async handle({request, response}, next) {
    const header = request.headers().authorization;

    if (header) {
      const token = header.replace('Bearer ', '');
      const secret = 'JSOfbdl8qDMgUw3dV7/rBlFw55KsNZeq498NxAkN30EI0Hq3Msdn4nlbkTqsqPhberPr6E00Qwf83t06tj8OPA=='; 
      try {
        const decodedToken = verify(token, secret);
        const id = decodedToken.sub;

        request.userId = id;
        await next();
      } 
      catch (error) {
        console.error('JWT verification failed:', error);
        return response.status(401).json({ message: 'Unauthorized' });
      }
    } 
    else {
        return response.status(401).json({ message: 'Unauthorized' });
    }
  }
}
