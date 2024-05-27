const fs = require('node:fs'); // Módulo de sistema de arquivos do node.js, permite ler a pasta comandos
const path = require('node:path'); // Módulo path do node.js, ajuda a construir caminhos de diretórios
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js'); // Importa classes e constantes do módulo discord.js
const { token } = require('./configs.json'); // Importa o token do bot do arquivo configs.json

// Cria uma nova instância do cliente do Discord com as intenções especificadas
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, // Intenção para eventos relacionados a guildas
        GatewayIntentBits.GuildMessages, // Eventos relacionados a mensagens em guildas
        GatewayIntentBits.MessageContent // Acessar o conteúdo das mensagens
    ] 
});

client.commands = new Collection(); // Cria uma nova coleção para armazenar os comandos

const commandsPath = path.join(__dirname, 'comandos'); // Constroi o caminho para a pasta 'comandos' com o path
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Lê todos os arquivos na pasta 'comandos' que terminam com '.js' com o fs

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file); // Constroi o caminho completo para o arquivo de comando
    const command = require(filePath); // Importa o arquivo de comando
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command); // Adiciona o comando à coleção se tiver as propriedades 'data' e 'execute'
    } else {
        console.log(`[OPA!!!] O comando em ${filePath} está faltando uma propriedade execute ou data.`); // Loga um aviso se o comando não tiver as propriedades necessárias
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`${readyClient.user.tag} pronta pra ajudar!!!`); // Loga uma mensagem quando o cliente estiver pronto
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return; // Ignora interações que não sejam comandos de entrada de chat
    const command = interaction.client.commands.get(interaction.commandName); // Obtém o comando a partir do nome da interação

    if (!command) {
        console.error(`Nenhum comando chamado ${interaction.commandName} foi encontrado!`); // Loga um erro se o comando não for encontrado
        return;
    }

    try {
        await command.execute(interaction); // Tenta executar o comando
    } catch (error) {
        console.error(error); // Loga o erro se a execução do comando falhar
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Houve um erro tentando executar este comando!!!', ephemeral: true }); // Envia uma mensagem de acompanhamento se a interação já foi respondida ou adiada
        } else {
            await interaction.reply({ content: 'Houve um erro tentando executar este comando!!!', ephemeral: true }); // Envia uma resposta de erro se a interação ainda não foi respondida
        }
    }
});

client.on(Events.MessageCreate, message => {
    if (message.content === "shts12") {
        if (message.author.id === '271339039624265729') {
            client.destroy(); // Desconecta o bot se eu escrever shts12
        }
    }
});

client.login(token); // Faz login no Discord com o token
