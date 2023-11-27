import Message from 'App/Models/Message';
import User from 'App/Models/User';

export async function getChannelMessages(channel_id) {
    const messages = await Message.query().where('channel', channel_id).orderBy('created_at', 'desc').limit(20);

    const updatesMessages = await Promise.all(messages.map(async (message) => {
        const user = await User.findOrFail(message.sender);
        return {...message.toJSON(), sender: user?.nickname}
    }));

    return updatesMessages.reverse();
}

export async function sendMessage(channel_id, text, user_id) {
    const message = new Message();
    const user = await User.findOrFail(user_id);
    
    message.text = text;
    message.channel = channel_id;
    message.sender = user_id;

    await message.save();

    message.sender = user?.nickname;

    return message;
}