import Message from 'App/Models/Message';
import User from 'App/Models/User';

export async function sendMessage(channel_id, text, user_id) {
    const message = new Message();
    const user = await User.findOrFail(user_id);
    
    message.text = text;
    message.channel = channel_id;
    message.sender = user_id;

    await message.save();

    message.sender = user?.nickname;

    return {message: message, status: user.status};
}