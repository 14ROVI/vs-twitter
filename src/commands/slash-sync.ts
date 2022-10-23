import { commands, Env } from "..";
import { ApplicationCommandType, Interaction, InteractionResponseType } from "../utils/discord-types";
import { jsonResponse } from "../utils/response";
import { Command } from "./base";


export default class SlashSync implements Command {
    name = "sync";
    description = "Syncs all the commands this bot has. Can only be used by the bot's owner!";
    type = ApplicationCommandType.CHAT_INPUT;
    options = [];

    async execute(
        env: Env,
        interaction: Interaction
    ): Promise<Response> {
        const user = interaction.user || interaction.member?.user;
        if (user === undefined || user.id !== env.DISCORD_OWNER_ID) {
            return jsonResponse({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "You don't have permission to sync commands!",
                },
            });
        }
        
        const url = `https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/commands`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bot ${env.DISCORD_TOKEN}`,
            },
            method: "PUT",
            body: JSON.stringify(commands),
        });
    
        if (response.ok) {
            console.log("Synced all commands");
        } else {
            console.error("Error syncing commands");
            const text = await response.text();
            console.error(text);
        }
        
        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Synced all commands!",
            },
        });
    }
}