import { verifyKey } from 'discord-interactions';
import { jsonResponse } from './utils/response';
import { InteractionType, InteractionResponseType, APIInteraction } from 'discord-api-types/v10';

import MessageGet from './commands/message-get';
import SlashGet from './commands/slash-get';
import SlashSync from './commands/slash-sync';


export interface Env {
    DISCORD_APPLICATION_ID: string;
    DISCORD_PUBLIC_KEY: string;
    DISCORD_SECRET: string;
    DISCORD_TOKEN: string;
    TWITTER_API_KEY: string;
    TWITTER_API_SECRET: string;
    TWITTER_BEARER_TOKEN: string;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        if (request.method === "POST") {
            const signature = request.headers.get("x-signature-ed25519") || "";
            const timestamp = request.headers.get("x-signature-timestamp") || "";
            const body = await request.clone().arrayBuffer();
            const isValidRequest = verifyKey(
                body,
                signature,
                timestamp,
                env.DISCORD_PUBLIC_KEY
            );
            if (isValidRequest) {
                return handleInteraction(request, env, ctx);
            } else {
                return new Response("Bad request signature.", { status: 401 });
            }
        }

        return new Response("Post requests only please :)", { status: 405 });
    }
}


export const commands = [
    new MessageGet(),
    new SlashGet(),
    new SlashSync(),
];

async function handleInteraction(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const interaction: APIInteraction = await request.json();
    console.log(interaction);

    if (interaction.type === InteractionType.Ping) {
        console.log("Handling Ping request");
        return jsonResponse({
            type: InteractionResponseType.Pong,
        });
    }
            
    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = commands.find(c => c.name.toLowerCase() === interaction.data.name.toLowerCase() && c.type == interaction.data.type);
        
        if (command !== undefined) {
            return await command.execute(env, interaction);
        } else {
            console.error("Unknown Command");
            return jsonResponse({ error: "Unknown Command" }, { status: 404 });
        }
    }
            
    console.error("Unknown Type");
    return jsonResponse({ error: "Unknown Type" }, { status: 400 });
}