import { encodeUrl } from "./encoded-url";

interface jsonResponse {
    data: Tweet[];
    includes?: {
        media?: TweetMedia[]
    }
}
interface Tweet {
    text: string;
    id: string;
    attachments?: {
        media_keys?: [];
    };
    edit_history_tweet_ids: string[];
}
interface TweetMedia {
    media_key: string,
    type: string,
    variants?: TweetMediaVariant[];
}
interface TweetMediaVariant {
    bit_rate?: number,
    content_type: string,
    url: string
}

export default async function getMedia(token: string, message: string): Promise<string[] | string> {
    const re = /twitter\.com\/\w+\/status(es)?\/(?<id>\d+)/g;

    const matches = message.matchAll(re);
    let ids = [];
    for (const match of matches)
        if (match.groups)
            ids.push(match.groups.id);

    if (ids.length === 0) return [];
        
    console.log(ids);

    const request = await fetch(
        `https://api.twitter.com/2/tweets?ids=${ids.join(",")}&tweet.fields=attachments&expansions=attachments.media_keys&media.fields=media_key,type,variants`, {
            "headers": {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!request.ok) {
        console.log(await request.text());
        return "Error with the Twitter API :(";
    }

    const data: jsonResponse = await request.json();

    let video_urls = (data.includes?.media || []).map(m => {
        if (m.type === "video" || m.type == "animated_gif")
            return m.variants?.sort((a, b) => (b.bit_rate || 0) - (a.bit_rate || 0))
                .filter(v => v.content_type === "video/mp4")[0]
                .url;
        else return undefined;
    }).filter((e) => e !== undefined)
    .map(u => u ? encodeUrl(u) : undefined) as string[];

    return video_urls;
}