const User = require('../../schemas/user');
const mongoose = require('mongoose');
const dayjs = require("dayjs");
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
    data: {
        name: 'tz-menu'
    },
    async execute(interaction, client){
        userProfile = new User({
            _id: mongoose.Types.ObjectId(),
            userId: interaction.user.id,
            userTimeZone: interaction.values[0],
        });

        userProfile.save().catch(console.error);

        if (interaction.values[0] == 'Other') {
            await interaction.reply({
                content: 'Enter your timezone as an exact TZ database name (e.g. America/New_York). You can find a full list at <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones> '
            });
        }
        else await interaction.reply({
            content: `Timezone ${interaction.values[0]} selected. Your current time is ${dayjs().tz(interaction.values[0]).format('hh:mm A, MMM D, YYYY')}`
        });
        console.log(userProfile);
    }
}