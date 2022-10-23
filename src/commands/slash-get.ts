import { Env } from "..";
import { jsonResponse } from "../utils/response";
import getMedia from "../utils/twitter";
import { Command } from "./base";


export default class SlashGet implements Command {
    name = "save";
    description = "Saves the direct video or GIF URLs from a Twitter post.";
    type = ApplicationCommandType.CHAT_INPUT;
    options = [{
        type: ApplicationCommandOptionType.STRING,
        name: "tweet",
        description: "The URL of the Tweet you want to extract the video from.",
        required: true,
    }];

    async execute(
        env: Env,
        interaction: Interaction
    ): Promise<Response> {
        const tweet_option = interaction.data?.options?.find(o => o.name === "tweet");
        if (tweet_option === undefined) {
            return jsonResponse({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Something went very wrong while dealing with this interaction.",
                },
            });
        }
        const tweet_urls = tweet_option.value || "";
        const video_urls = await getMedia(env.TWITTER_BEARER_TOKEN, `${tweet_urls}`);

        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: video_urls.join("\n") || "Couldn't find anything :(",
            },
        });
    }
}