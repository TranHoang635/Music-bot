const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'exit',
    description: 'Exit voice',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({
                content: 'Bạn phải ở trong một voice channel để ngắt kết nối!',
                ephemeral: true,
            });
        }

        const connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            return await interaction.reply({
                content: 'Hãy vào voice trước đã!',
                ephemeral: true,
            });
        }

        try {
            connection.destroy();
            // console.log(`Bot đã ngắt kết nối với voice channel: ${voiceChannel.name}`);
            return await interaction.reply(`Successfully disconnect voice: **${voiceChannel.name}**`);
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                content: 'Có lỗi xảy ra khi ngắt kết nối với voice channel!',
                ephemeral: true,
            });
        }
    },
};