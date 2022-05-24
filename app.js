const http = require("http");
const dotEnv = require("dotenv").config();
const weather = require("weather-js");
const { Client, Intents } = require("discord.js");
const discordToken = process.env.discord;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const cmd = "!weather";

client.login(discordToken);

client.once("ready", () => {
    console.log("Ready!");
});

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;

    if (msg.content.toLowerCase().startsWith(cmd)) {
        postWeather(msg);
    }
});

function postWeather(msg) {
    const location = msg.content.substring(cmd).trim().toLowerCase();

    if (location === "") {
        msg.reply("Please enter a city to get the weather for.");
        return;
    }

    weather.find({ search: location, degreeType: 'F' }, function (err, result) {
        if (err) return;

        if (result.length > 0) {
            const degreesC = Math.round((parseInt(result[0].current.temperature) - 32) * 5 / 9);
            msg.reply(`The weather in ${result[0].location.name} is ${result[0].current.skytext}. It is currently ` +
                `${result[0].current.temperature}${String.fromCharCode(176)} F / ${degreesC}${String.fromCharCode(176)} C.` +
                ` Taken at ${timeConvert(result[0].current.observationtime)} on ${dateConvert(result[0].current.date)}.`);
        } else {
            msg.reply(`Could not find weather for ${location}`);
        }
    });
}

function timeConvert(time) {
    let splitTime = time.split(":");
    let pm = false;

    if (splitTime[0] >= 12) {
        splitTime[0] -= splitTime[0] == 12 ? 0 : 12;
        pm = true;
    }

    return `${splitTime[0]}:${splitTime[1]} ${(pm ? "PM" : "AM")}`;
}

function dateConvert(dateString) {
    date = dateString.split("-");

    return date[1] + "/" + date[2] + "/" + date[0];
}
