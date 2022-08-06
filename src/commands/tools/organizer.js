const { SlashCommandBuilder } = require('discord.js');
const Event = require('../../schemas/event');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addorganizer')
        .setDescription('Add a new organizer to the event for the current thread')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to make organizer')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        let eventProfile = await Event.findOne({ threadId: interaction.channel.id });
        if (!eventProfile){
            await interaction.reply(`ERROR: you can only use this command in threads created by Eventi.`);
            return;
        }
        if (interaction.channel.isThread()){
            console.log(interaction.options.getUser('user').id);
            console.log(eventProfile);
            if (eventProfile.organizers.includes(interaction.options.getUser('user').id)){
                await interaction.reply({
                    content: `${interaction.options.getUser('user')} is already an organizer!`,
                    ephemeral: true,
                  });
                  return;
            }

            await Event.updateOne( 
                { threadId : interaction.channel.id },
                { $push: { organizers: interaction.options.getUser('user').id } }
            )
    
            await interaction.reply(`${interaction.options.getUser('user')} is now an organizer for this event.`);
        } else {
            await interaction.reply(`ERROR: you can only use this command in threads created by Eventi.`);
        }
    },
};