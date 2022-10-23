import { APIInteraction, ApplicationCommandType, InteractionResponseType } from "discord-api-types/v10";
import { Env } from "..";
import { jsonResponse } from "../utils/response";
import getMedia from "../utils/twitter";
import { Command } from "./base";


export default class MessageGet implements Command {
    name = "Save Video URL";
    type = ApplicationCommandType.Message;

    async execute(
        env: Env,
        interaction: APIInteraction,
    ): Promise<Response> {
        const message_id = interaction.data.target_id;
        const message_content = interaction.data?.resolved.messages[message_id].content;
        const video_urls = await getMedia(env.TWITTER_BEARER_TOKEN, message_content);

        return jsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: video_urls.join("\n") || "Couldn't find anything :(",
            },
        });
    }
}