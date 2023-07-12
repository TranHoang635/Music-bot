const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'play',
    description: 'Phát nhạc từ YouTube',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'song',
            description: 'Từ khóa hoặc liên kết YouTube của bài hát',
            type: 'STRING',
            required: true,
        },
    ],
    async run(client, interaction) {
        const song = interaction.options.getString('song');
        const voiceChannel = interaction.member.voice.channel;

        // Kiểm tra người dùng đã kết nối đến kênh thoại hay chưa
        if (!voiceChannel) {
            return interaction.reply({ content: 'Bạn phải tham gia một kênh thoại trước!', ephemeral: true });
        }

        if (!interaction.deferred || !interaction.replied) {
            await interaction.deferReply({ ephemeral: true });
        }

        try {
            // Tải thông tin video từ YouTube
            const songInfo = await ytdl.getInfo(song);
            const url = songInfo.videoDetails.video_url;
            const title = songInfo.videoDetails.title;
            const duration = songInfo.videoDetails.length_seconds * 1000;
            // Tải âm thanh từ YouTube
            const audioStream = ytdl(song, { filter: 'audioonly' });
            const resource = createAudioResource(audioStream);
            // Kết nối đến kênh thoại và phát nhạc
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);

            player.on('stateChange', async (oldState, newState) => {
                if (newState.status === 'idle') {
                    // Phát xong nhạc, hủy kết nối và gửi thông báo
                    connection.destroy();
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Phát nhạc')
                        .setDescription(`Đã phát xong nhạc từ ${title}: ${url}`)
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                }
            });
        } catch (error) {
            console.log(error);
            await interaction.editReply({ content: 'Có lỗi xảy ra khi phát nhạc!', ephemeral: true });
        }
    },
};