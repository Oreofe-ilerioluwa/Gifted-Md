const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'Gifted;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUE4cGJsQ0xEbmU1TXNvSzdSTE54ck9xMWp4OVE4eldBUnNwQTB4ZDgzdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSlAxVDRYR280NVFNRlNPdTU5VjRjbDdpSTNNMmhtb2tBWS90MDhaalBqND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwTk4ySVZwcGZCMlNZUURNN3NuRVZ1T2N5cy9vQlNaR1B0T01GRlRteUdNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ6ZVkrV04wWEZTMzgrQVFXeCsxNXZ5bURYSHR0NEFTbXVIVjB5b3Q3aUE4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVNdkw0SHE0SUhZcFNoekVzaHJyQkJxNDN3L0xVNDY3Y2QzRGF1WmplMlE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjV6bGJiWVhBMmt3TEhPdC9nd3QzdytrTGt5L3hrU1BRTDhna0NyVzQvZzA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0ptWk5GVStMWktIRXc1UzVneUdUL1JTNTZ0MFh0OWtESU5vdzJJUjVuND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM21DN01pNmJGZk9ZcFdIaHB3bEI3OW40SzE3ZDMvNHZNOGtnaGNnMUp3ND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpOckRWTExHNitKMUVJOHoyM3ZHQXZHYWdKVzVDTDl1cjZwdmZ3emVBS1Nwbjl6elA0VkNYY25pdmJyTWNKQUd1Q2RaZXBGcEM3TkR6NGw0c1FSL0FBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjQ3LCJhZHZTZWNyZXRLZXkiOiIzaFZLR0dSbFVRcHB2Zi82RURTVzRpYU1HanVlTWFHYVkxVkl3UG1mVWtJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzIsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMiwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJCY0tzSU9wX1IwS1lsd1J6Y3I1TktBIiwicGhvbmVJZCI6ImRlZWRkMGU4LWY4NDEtNDY0Mi04YWJkLTQ4NTAxZTBjNTUyNiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBUHBBeDhCTkdUc21pUDFMNWRzbVFnaDdwaGs9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibitidWwvd3FRMGJKWi96bzMxVmJKY1VjeUc0PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjREREZYNVZBIiwibWUiOnsiaWQiOiIyMzQ5MTIxODgxMzQzOjE0QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IkN5cGhlciDDjGzDqXLDrW9sw7p3YSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT2pCc2c4UTI1UzRzZ1lZQmlBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiM2ptQ2pHN1NQcFNKdW43Y1QwWTRYRFcvU1ZBemtqay9xbkt2WmFPcSt4az0iLCJhY2NvdW50U2lnbmF0dXJlIjoiZ204VEdpNjhCZGk0dDh1Z2hoc25BR0lnSThPMXRBc3FFcmlUUFArYUFpcEpUZkZ2U21OSi9Edy81akl0OHhUdXlQYzBJVjBOVGpCR0wrbFJJWDRuaHc9PSIsImRldmljZVNpZ25hdHVyZSI6InYyM3JkUmFJMFJtdExSdGo2bVN6Tm1uYnVHWGhpazhyOUpIc2tUREsxcDlGU1BPelREN2plYU1KSVRJOGNVNzhzdUIzbUY2c0Y5MTBhWnlJWVVGc0FBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0OTEyMTg4MTM0MzoxNEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJkNDVnb3h1MGo2VWlicCszRTlHT0Z3MXYwbFFNNUk1UDZweXIyV2pxdnNaIn19XSwicGxhdGZvcm0iOiJzbWJpIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzE2MzkwNTAzLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUJ3SSJ9',
    PREFIXE: process.env.PREFIX || ",",
    OWNER_NAME: process.env.OWNER_NAME || "Cypher Ìléríolúwa🤖🌹🍀",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "2349121881343", 
             
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
CHATBOT: process.env.CHAT_BOT || "no",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'ɢɪғᴛᴇᴅ-ᴍᴅ',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/ec6ea1aef6f229cf76909.mp4',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '5' ,
    PRESENCE : process.env.PRESENCE || 'online',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

