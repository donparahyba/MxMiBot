// puxa o SlashCommandBuilder
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // A definição dos comandos em slash feita com o command builder
    data: new SlashCommandBuilder()
    .setName('teste')
    .setDescription('Responde com alguma mensagem'),
    // O comando de facto
    async execute(interaction, client){
        await interaction.reply('O bot está funcional e trabalhando duro!');
    },
};