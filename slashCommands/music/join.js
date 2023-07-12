const { joinVoiceChannel } = require('@discordjs/voice');

 module.exports = {
    name: 'join',
    description: 'Gọi bot vào voice',
    type: 'CHAT_INPUT',
    run: (client, interaction) => {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({
                content: 'Hãy join voice rồi thử lại !',
                ephemeral: true,
            });
        }
         try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            return interaction.reply(`Successfully joined: **${voiceChannel.name}**`);
        } catch (error) {
            logger.error(error);
            return interaction.reply({
                content: 'Có lỗi xảy ra khi tham gia kênh thoại!',
                ephemeral: true,
            });
        }
    },
};