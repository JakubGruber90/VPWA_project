// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import bcrypt from 'bcrypt'



class UserController {
  async create({ request, response }) {
    const userData = request.all();

      userData.password = await bcrypt.hash(request.all().password, 10)
      const user = new User();
      user.fill(userData); 

      await user.save();

      console.log(user)
      
      const userR = await User.findBy('email', userData.email);
      return response.status(201).json({
       user: userR, 
      });
  }

      async findOne({ request, response }) {
        const nickname = request.headers().username;
        const email = request.headers().email;

        const user = await User.query()
        .where('nickname', nickname)
        .orWhere('email', email)
        .first();

        if (user) {
          response.status(400).json({message: "User exists"})
        } else {
          return response.status(200).json({ message: 'ok' });
        }
      }

      async setPersonalNotification({request, response}){
        let user = await User.find(request.userId);
        if(user){ 
          user.personal_notification = request.all().state; 
          await user.save()
          response.status(200).json({user: user})
        }
        else{
          return response.status(400).json({ message: 'err' });
        }     
      }
      
      async getPersonalNotification({request, response}){
        const user = await User.find(request.userId);
        if(user){ 
          response.status(200).json({personal_notification: user.personal_notification})
        }
        else{
          return response.status(400).json({ message: 'err' });
        } 
      }

  }
  
  module.exports = UserController