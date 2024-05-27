const { REST, Routes } = require('discord.js'); // Importa as classes REST e Routes do módulo discord.js
const { clientId, guildId, token } = require('./configs.json'); // Importa as coisas do configs.json
const fs = require('node:fs'); // Módulo de sistema de arquivos do node.js, permite ler a pasta comandos
const path = require('node:path'); // Módulo path do node.js, ajuda a construir caminhos de diretórios

const commands = []; // Cria um array para armazenar os comandos
const commandsPath = path.join(__dirname, 'comandos'); // Constroi o caminho para a pasta 'comandos'
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Lê todos os arquivos na pasta 'comandos' que terminam com '.js'

// Itera sobre cada arquivo de comando encontrado
for (const file of commandFiles) {
    const command = require(`./comandos/${file}`); // Importa o arquivo de comando
    commands.push(command.data.toJSON()); // Adiciona o comando convertido para JSON ao array de comandos
}

const rest = new REST({ version: '10' }).setToken(token); // Cria uma instância do REST client do discord.js e define o token de autenticação

(async () => {
    try {
        console.log('Colocando para funcionar os Slash commands.'); // Loga uma mensagem indicando que os comandos slash estão sendo configurados

        // Envia uma requisição PUT para registrar os comandos de slash na guilda especificada
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Recarregando os Slash commands.'); // Loga uma mensagem indicando que os comandos foram recarregados
    } catch (error) {
        console.error(error); // Loga qualquer erro que ocorrer durante o processo
    }
})();