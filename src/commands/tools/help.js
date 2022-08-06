const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get the list of available commands'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('List of Eventi commands')
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: interaction.user.displayAvatarURL(),
                text: 'Requested by ' + interaction.user.tag
            })
            .addFields([
                {
                    name: '/timezone',
                    value: 'Configures the user timezone. **REQUIRED** before using other commands.',
                    inline: false
                },
                {
                    name: '/newevent',
                    value: 'Schedules a new event.',
                    inline: false
                },
                {
                    name: '/editevent',
                    value: 'Edits an event. **MUST** be used by organizers in the event thread.',
                    inline: false
                },
                {
                    name: '/deleteevent',
                    value: 'Deletes an event. **MUST** be used by organizers in the event thread.',
                    inline: false
                },
                {
                    name: '/addorganizer',
                    value: 'Adds an organizer to the event. **MUST** be used in the event thread.',
                    inline: false
                }
            ]);
        
        await interaction.reply({
            embeds: [embed]
        });
    }
}