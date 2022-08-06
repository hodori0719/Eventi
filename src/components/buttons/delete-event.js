const User = require('../../schemas/user');
const Event = require('../../schemas/event');
const mongoose = require('mongoose');
const { google } = require("googleapis");
require("dotenv").config();
const { GuildScheduledEvent } = require('discord.js');

const GOOGLE_PRIVATE_KEY = process.env.private_key;
const GOOGLE_CLIENT_EMAIL = process.env.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.project_number;
const GOOGLE_CALENDAR_ID = process.env.calendar_id;

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
    data: {
        name: 'delete-event'
    },
    async execute(interaction, client) {
        let eventProfile = await Event.findOne({ threadId: interaction.channel.id });

        let theEvent = await interaction.guild.scheduledEvents.fetch(eventProfile.eventId);

        await interaction.guild.scheduledEvents.delete(theEvent);

          const delCalendarEvent = async () => {
            auth.getClient().then((auth) => {
              calendar.events.delete(
                {
                  auth: auth,
                  calendarId: GOOGLE_CALENDAR_ID,
                  eventId: eventProfile.gcalId,
                },
                function (error, response) {
                  if (error) {
                    console.log("Something went wrong: " + error); // If there is an error, log it to the console
                    return;
                  }
                  console.log("Event deleted successfully.")
                  interaction.reply(`<@${interaction.user.id}> deleted this event. Thread will be archived after 1 hour of inactivity.`);
                  interaction.channel.edit({autoArchiveDuration: 60});
                }
              );
            });
          };
          
          await delCalendarEvent();
    }
}