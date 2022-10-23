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
        const message_content = interaction.data?.resolved?.messages?.get(interaction.data?.target_id || "")?.content || "";
        const video_urls = await getMedia(env.TWITTER_BEARER_TOKEN, message_content);

        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: video_urls.join("\n") || "Couldn't find anything :(",
            },
        });
    }
}