const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone')
        .setDescription('Configure your timezone'),
    async execute(interaction, client) {
        const menu = new SelectMenuBuilder()
            .setCustomId('tz-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(
                new SelectMenuOptionBuilder({
                    label: 'Eastern',
                    value: 'US/Eastern',
                }), new SelectMenuOptionBuilder({
                    label: 'Central',
                    value: 'US/Central',
                }), new SelectMenuOptionBuilder({
                    label: 'Mountain',
                    value: 'US/Mountain',
                }), new SelectMenuOptionBuilder({
                    label: 'Pacific',
                    value: 'US/Pacific',
                }), new SelectMenuOptionBuilder({
                    label: 'Alaska',
                    value: 'US/Alaska',
                }), new SelectMenuOptionBuilder({
                    label: 'Hawaii-Aleutian',
                    value: 'US/Aleutian',
                }), new SelectMenuOptionBuilder({
                    label: 'Other',
                    value: 'Other',
                })
            );
        
        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)],
        });
    },
}