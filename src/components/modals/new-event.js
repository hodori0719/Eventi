const dayjs = require("dayjs");

module.exports = {
    data: {
        name: 'new-event'
    },
    async execute(interaction, client) {
        const thread = await interaction.channel.threads.create({
            name: `${interaction.fields.getTextInputValue('eventTitleInput')}`,
            autoArchiveDuration: 60,
            reason: `[Eventi] ${interaction.fields.getTextInputValue('eventTitleInput')}`,
        });

        let dateParse = interaction.fields.getTextInputValue('eventDateInput');
        let timeParse = interaction.fields.getTextInputValue('eventTimeInput');

        interaction.guild.scheduledEvents.create({
            name: `${interaction.fields.getTextInputValue('eventTitleInput')}`,
            scheduledStartTime: dateParse.substring(6,10) + '-' + dateParse.substring(0,2) + '-' + dateParse.substring(3,5) + 'T' + timeParse.substring(0,5) + ':00.000Z',
            scheduledEndTime: dateParse.substring(6,10) + '-' + dateParse.substring(0,2) + '-' + dateParse.substring(3,5) + 'T' + timeParse.substring(0,5) + ':59.000Z',
            entityType: 3,
            privacyLevel: 2,
            description: `${interaction.fields.getTextInputValue('eventDescInput')}`,
            channel: null,
            entityMetadata: {
                location: interaction.fields.getTextInputValue('eventLocInput'),
            }
        });

        await interaction.reply({
            content: `New event registered: ${interaction.fields.getTextInputValue('eventTitleInput')}. See <#${thread.id}>`
        });

        await thread.send(`<@${interaction.user.id}> created a new event at ${interaction.fields.getTextInputValue('eventLocInput')} on ${interaction.fields.getTextInputValue('eventDateInput')}, ${interaction.fields.getTextInputValue('eventTimeInput')}:\n\n"${interaction.fields.getTextInputValue('eventDescInput')}"`);
    }
}