const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Returns an embed'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Event name')
            .setDescription('Event description')
            .setImage(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: interaction.user.displayAvatarURL(),
                text: 'Created by ' + interaction.user.tag
            })
            .setURL('https://google.com')
            .addFields([
                {
                    name: 'Time',
                    value: 'Value 1',
                    inline: true
                },
                {
                    name: 'Location',
                    value: 'Value 2',
                    inline: true
                }
            ]);
        
        await interaction.reply({
            embeds: [embed]
        });
    }
}