import Message from 'App/Models/Message';
const { format } = require('date-fns');

export async function getChannelMessages(channel_id) {
    channel_id = parseInt(channel_id);

    const messages = await Message.query().where('channel', channel_id).orderBy('created_at', 'desc').exec();

    return messages;
}

export async function sendMessage(channel_id, text, user_id) {
    const message = new Message();
    channel_id = parseInt(channel_id);

    message.text = text;
    message.channel = channel_id;
    message.sender = user_id;

    const formattedTimestamp = format(new Date(), 'dd/MM HH:mm');
    message.createdAt = formattedTimestamp;

    await message.save();

    return message;
}