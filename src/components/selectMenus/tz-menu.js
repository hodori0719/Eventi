module.exports = {
    data: {
        name: 'tz-menu'
    },
    async execute(interaction, client){
        if (interaction.values[0] == 'Other') {
            await interaction.reply({
                content: 'Enter your timezone as an offset from UTC'
            });
        }
        else await interaction.reply({
            content: `Timezone ${interaction.values[0]} selected. Your current time is `
        });
    }
}