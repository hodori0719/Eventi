const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get the list of Eventi commands'),
    async execute(interaction, client) {
        const message =  await interaction.deferReply({
            fetchReply: true
        });

        const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({
            content: newMessage
        });
    }
}