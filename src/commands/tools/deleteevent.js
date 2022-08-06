const Event = require('../../schemas/event');
const User = require('../../schemas/user');
const mongoose = require('mongoose');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteevent')
        .setDescription('Delete an existing event.'),
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

        const button = new ButtonBuilder()
            .setCustomId('delete-event')
            .setLabel('Delete Event')
            .setStyle(ButtonStyle.Danger);

            await interaction.reply({
                content: "Are you *SURE* you want to delete this event?",
                components: [new ActionRowBuilder().addComponents(button)],
                ephemeral: true,
            });
    }
}