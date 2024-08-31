import { encodeUrl } from "./encoded-url";

export default async function getMedia(token: string, message: string): Promise<string[] | string> {
    const re = /(twitter|x)\.com\/(?<path>\w+\/status(es)?\/\d+)/g;

    const matches = message.matchAll(re);
    let paths = [];
    for (const match of matches)
        if (match.groups)
            paths.push(match.groups.path);

    if (paths.length === 0) return [];
        
    console.log(paths);

    let video_urls = []

    for (const path of paths) {
        console.log(path);
        const request = await fetch(`https://api.vxtwitter.com/${path}`);
        
        if (!request.ok) {
            console.log(await request.text());
            return "Error with the Twitter API :(";
        }

        const data: any = await request.json();
        
        const urls = data["mediaURLs"]
            .filter((url: string) => url.endsWith(".mp4"))
            .map((url: string) => encodeUrl(url));
        video_urls.push(...urls);
    }

    return video_urls;
}