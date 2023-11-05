// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";


class UserController {
  async create({ request, response }) {
    const userData = request.all();

      const user = new User();
      user.fill(userData); // Fill the user model with the provided data

      // Save the user to the database
      await user.save();
      const userR = await User.findBy('email', userData.email);
      // Return a success response
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
          response.status(200).json({message: "User exists"})
        } else {
          return response.status(404).json({ message: 'User not found' });
        }
      }
  

  }
  
  module.exports = UserController