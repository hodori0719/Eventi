const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

const { google } = require("googleapis");
require("dotenv").config();

const GOOGLE_PRIVATE_KEY = process.env.private_key;
const GOOGLE_CLIENT_EMAIL = process.env.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.project_number;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES,
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configure Eventi for your server (admin)'),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

        if (!guildProfile){
            var newCalendar = {
                summary: `${interaction.guild.name}`,
                description: `Eventi-managed calendar for ${interaction.guild.name}`,
            };

                await auth.getClient().then((auth) => {
                    calendar.calendars.insert({
                        auth: auth,
                        resource: newCalendar,
                    },
                    function (error, response) {
                        if (error) {
                          console.log("Something went wrong: " + err); // If there is an error, log it to the console
                          return;
                        }
                        console.log("Calendar created successfully.")
                        console.log("Calendar details: ", response.data); // Log the event details

                        guildProfile = new Guild({
                            _id: mongoose.Types.ObjectId(),
                            guildId: interaction.guild.id,
                            guildCal: response.data.id,
                        });
        
                        guildProfile.save().catch(console.error);
                    });
                });
                await interaction.reply('Server successfully configured');
        } else {
            interaction.reply('Server is already configured!');
            console.log(guildProfile);
        }
    }
}