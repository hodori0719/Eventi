const Event = require('../../schemas/event');
const User = require('../../schemas/user');
const mongoose = require('mongoose');
const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editevent')
        .setDescription('Edit an existing event.'),
    async execute(interaction, client) {
        let eventProfile = await Event.findOne({ threadId: interaction.channel.id });
        if (!eventProfile){
          await interaction.reply({
            content: '**ERROR**: you can only use this command in threads created by Eventi.',
            ephemeral: true,
          });
          return;
        }
        if (!eventProfile.organizers.includes(interaction.user.id)){
            await interaction.reply({
                content: '**ERROR**: you are not authorized to do that for this event.',
                ephemeral: true,
              });
              return;
        }
        let userProfile = await User.findOne({ userId: interaction.user.id });
        if (!userProfile.userTimeZone){
            await interaction.reply({
                content: '**ERROR**: you must set your timezone with /timezone before using this command.',
                ephemeral: true,
              });
              return;
        }

        const modal = new ModalBuilder()
            .setCustomId('edit-event')
            .setTitle('Edit Event Details');

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