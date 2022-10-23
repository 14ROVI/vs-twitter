const DISCORD_TOKEN = null;
const DISCORD_APPLICATION_ID = null;

if (!DISCORD_TOKEN) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!DISCORD_APPLICATION_ID) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.'
  );
}

main();
async function main() {
    const response = await fetch(
        `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${DISCORD_TOKEN}`,
        },
        method: "PUT",
        body: JSON.stringify([{
            "name": "sync",
            "description": "Syncs commands for the bot to Discord; can only be used by the bot's owner.",
        }]),
    });

    if (response.ok) {
        console.log("Registered all commands");
    } else {
        console.error("Error registering commands");
        const text = await response.text();
        console.error(text);
    }
}