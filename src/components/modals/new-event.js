const User = require('../../schemas/user');
const Event = require('../../schemas/event');
const mongoose = require('mongoose');
const { google } = require("googleapis");
require("dotenv").config();
const dayjs = require("dayjs");
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

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
        name: 'new-event'
    },
    async execute(interaction, client) {
        let userProfile = await User.findOne({ userId: interaction.user.id });

        let dateParse = interaction.fields.getTextInputValue('eventDateInput');
        let timeParse = interaction.fields.getTextInputValue('eventTimeInput');
        let dateParsed = dateParse.substring(6,10) + '-' + dateParse.substring(0,2) + '-' + dateParse.substring(3,5) + 'T' + timeParse.substring(0,5) + ':00.000Z';
        let endParsed = dateParse.substring(6,10) + '-' + dateParse.substring(0,2) + '-' + dateParse.substring(3,5) + 'T' + timeParse.substring(0,5) + ':59.000Z';

        if (!(dayjs(dateParsed).isValid())){
            await interaction.reply({
                content: '**ERROR**: invalid event date & time. Please follow the format in the boxes. Event not scheduled.',
                ephemeral: true,});
            return;
        }
        if (dayjs.tz(dateParsed, userProfile.userTimeZone).isBefore(dayjs())){
            await interaction.reply({
                content: '**ERROR**: event cannot start in the past. Event not scheduled.',
                ephemeral: true,});
            return;
        }

        const thread = await interaction.channel.threads.create({
            name: `${interaction.fields.getTextInputValue('eventTitleInput')}`,
            autoArchiveDuration: 4320,
            reason: `[Eventi] ${interaction.fields.getTextInputValue('eventTitleInput')}`,
        });

        const newEvent = await interaction.guild.scheduledEvents.create({
            name: `${interaction.fields.getTextInputValue('eventTitleInput')}`,
            scheduledStartTime: dayjs.tz(dateParsed, userProfile.userTimeZone),
            scheduledEndTime: dayjs.tz(endParsed, userProfile.userTimeZone),
            entityType: 3,
            privacyLevel: 2,
            description: `${interaction.fields.getTextInputValue('eventDescInput').trim()}`,
            channel: null,
            entityMetadata: {
                location: interaction.fields.getTextInputValue('eventLocInput'),
            }
        });

        await interaction.reply({
            content: `A new event has been created: ${interaction.fields.getTextInputValue('eventTitleInput')}. See <#${thread.id}>`
        });

        var calendarEvent = {
            summary: `${interaction.fields.getTextInputValue('eventTitleInput')}`,
            description: `${interaction.fields.getTextInputValue('eventDescInput').trim()}`,
            location: `${interaction.fields.getTextInputValue('eventLocInput')}`,
            visibility: 'public',
            organizer: {
              displayName: `${interaction.user.id}`,
            },
            start: {
              dateTime: dayjs.tz(dateParsed, userProfile.userTimeZone),
              timeZone: `${userProfile.userTimeZone}`,
            },
            end: {
              dateTime: dayjs.tz(endParsed, userProfile.userTimeZone),
              timeZone: `${userProfile.userTimeZone}`,
            },
            attendees: [],
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };
          
          const addCalendarEvent = async () => {
            auth.getClient().then((auth) => {
              calendar.events.insert(
                {
                  auth: auth,
                  calendarId: GOOGLE_CALENDAR_ID,
                  resource: calendarEvent,
                },
                function (error, response) {
                  if (error) {
                    console.log("Something went wrong: " + err); // If there is an error, log it to the console
                    return;
                  }
                  console.log("Event created successfully.")
                  console.log("Event details: ", response.data); // Log the event details
                  thread.send(`<@${interaction.user.id}> created a new event at ${interaction.fields.getTextInputValue('eventLocInput')} on ${interaction.fields.getTextInputValue('eventDateInput')}, ${interaction.fields.getTextInputValue('eventTimeInput')} (user time):\n\n"${interaction.fields.getTextInputValue('eventDescInput').trim()}"\n\nSubscribe to the event at ${response.data.htmlLink}`);
                  eventProfile = new Event({
                    _id: mongoose.Types.ObjectId(),
                    eventId: newEvent.id,
                    threadId: thread.id,
                    gcalId: response.data.id,
                    organizers: [interaction.user.id],
                  });
                  console.log(eventProfile);
                    eventProfile.save().catch(console.error);
                }
              );
            });
          };
          
          await addCalendarEvent();
    }
}