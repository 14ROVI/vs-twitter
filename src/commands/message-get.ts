import { Env } from "..";
import { ApplicationCommandType, Interaction, InteractionResponseType } from "../utils/discord-types";
import { jsonResponse } from "../utils/response";
import getMedia from "../utils/twitter";
import { Command } from "./base";


export default class MessageGet implements Command {
    name = "Save Video URL";
    type = ApplicationCommandType.MESSAGE;

    async execute(
        env: Env,
        interaction: Interaction,
    ): Promise<Response> {
        const target_id = interaction.data?.target_id || "";
        const resolved_messages = interaction.data?.resolved?.messages || {};
        if (!(target_id in resolved_messages))
            return jsonResponse({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Couldn't find anything :(",
                },
            });
        const video_urls = await getMedia(env.TWITTER_BEARER_TOKEN, resolved_messages[target_id].content);

        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: video_urls.join("\n") || "Couldn't find anything :(",
            },
        });
    }
}