const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newevent')
        .setDescription('Register a new event.')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Where is your event?')
                .setRequired(true)
                .addChoices(
                    { name: 'Voice Channel', value: 'voice' },
                    { name: 'Somewhere Else', value: 'irl' },
                )
        ),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('new-event')
            .setTitle('Create New Event');

        const titlInput = new TextInputBuilder()
            .setCustomId('eventTitleInput')
            .setLabel('Event Topic')
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("What's your event?");

        const locInput = new TextInputBuilder()
            .setCustomId('eventLocInput')
            .setLabel('Location')
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Add a location, link, or channel name");

        const dateInput = new TextInputBuilder()
            .setCustomId('eventDateInput')
            .setLabel('Start Date')
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(10)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("MM/DD/YYYY");

        const timeInput = new TextInputBuilder()
            .setCustomId('eventTimeInput')
            .setLabel('Start Time')
            .setRequired(true)
            .setMinLength(8)
            .setMaxLength(8)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("XX:XX XM");

        const descInput = new TextInputBuilder()
            .setCustomId('eventDescInput')
            .setLabel('Description')
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)
            .setPlaceholder("Tell people a little more about your event. Markdown, new lines, and links are supported.");

        modal.addComponents(new ActionRowBuilder().addComponents(titlInput),
            new ActionRowBuilder().addComponents(locInput),
            new ActionRowBuilder().addComponents(dateInput),
            new ActionRowBuilder().addComponents(timeInput),
            new ActionRowBuilder().addComponents(descInput));

        await interaction.showModal(modal);
    }
}