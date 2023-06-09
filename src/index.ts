import { verifyKey } from 'discord-interactions';
import { jsonResponse } from './utils/response';
import { decodeUrl } from './utils/encoded-url';

import MessageGet from './commands/message-get';
import SlashGet from './commands/slash-get';
import SlashSync from './commands/slash-sync';
import { Interaction, InteractionResponseType, InteractionType } from './utils/discord-types';
import HTML from './index.html';
import getMedia from "./utils/twitter";


export interface Env {
    DISCORD_OWNER_ID: string;
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
        else if (request.method === "GET") {
            let redirect = decodeUrl(request.url);
            if (redirect) {
                return Response.redirect(redirect, 301);
            }
            
            let inline = await getMedia(env.TWITTER_BEARER_TOKEN, request.url);
            if (typeof inline === "string") {
                return new Response(inline, {
                    headers: {"Content-Type": "text/html;charset=UTF-8"},
                    status: 200
                });
            }
            else if (inline.length > 0) {
                return Response.redirect(inline[0], 301);
            }

            return new Response(HTML, {
                headers: {"Content-Type": "text/html;charset=UTF-8"},
                status: 200
            });
        }
        return new Response("POST or GET please :)", { status: 405 });
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
    _ctx: ExecutionContext
): Promise<Response> {
    const interaction: Interaction = await request.json();

    if (interaction.type === InteractionType.PING) {
        return jsonResponse({
            type: InteractionResponseType.PONG,
        });
    }
            
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const command = commands.find(c => c.name.toLowerCase() === interaction.data?.name.toLowerCase() && c.type == interaction.data.type);
        
        if (command !== undefined) {
            return await command.execute(env, interaction);
        } else {
            return jsonResponse({ error: "Unknown Command" }, { status: 404 });
        }
    }

    return jsonResponse({ error: "Unknown Type" }, { status: 400 });
}