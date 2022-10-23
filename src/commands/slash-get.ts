import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10";
import { APIApplicationCommandInteraction, APIInteraction, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { InteractionResponseType } from "discord-interactions";
import { Env } from "..";
import { jsonResponse } from "../utils/response";
import getMedia from "../utils/twitter";
import { Command } from "./base";


export default class SlashGet implements Command {
    name = "save";
    description = "Saves the direct video or GIF URLs from a Twitter post.";
    type = ApplicationCommandType.ChatInput;
    options = [{
        type: ApplicationCommandOptionType.String,
        name: "tweet",
        description: "The URL of the Tweet you want to extract the video from.",
        required: true,
    }];

    async execute(
        env: Env,
        interaction: APIInteraction
    ): Promise<Response> {
        const twitter_url = interaction.data?.options[0].value;
        const video_urls = await getMedia(env.TWITTER_BEARER_TOKEN, twitter_url);

        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: video_urls.join("\n") || "Couldn't find anything :(",
            },
        });
    }
}