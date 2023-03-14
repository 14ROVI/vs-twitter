const ALPHA_NUMS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function B64encode(value: number | bigint) {
    let big_value = BigInt(value);
    let result = '';
    do {
        let mod = big_value % 64n;
        result = ALPHA_NUMS.charAt(Number(mod)) + result;
        big_value = big_value / 64n;
    } while (big_value > 0);

    return result;
}

function B64decode(value: string) {
    let result = 0n;
    for (let i = 0, len = value.length; i < len; i++) {
        result *= 64n;
        result += BigInt(ALPHA_NUMS.indexOf(value[i]));
    }

    return result;
}

export function encodeUrl(url: string): string {
    const extRe = /\/ext_tw_video\/(?<tweet_id>\d+)\/pu\/vid\/(?<width>\d+)x(?<height>\d+)\/(?<video_id>.*).mp4/g;
    const amplifyRe = /\/amplify_video\/(?<tweet_id>\d+)\/vid\/(?<width>\d+)x(?<height>\d+)\/(?<video_id>.*).mp4/g;
    const tweetVidRe = /\/tweet_video\/(?<video_id>.*).mp4/g;

    for (const match of url.matchAll(extRe)) {
        if (match.groups) {
            let tweet_id = B64encode(BigInt(match.groups.tweet_id));
            let width = B64encode(parseInt(match.groups.width));
            let height = B64encode(parseInt(match.groups.height));
            let video_id = match.groups.video_id;
            return `https://vst.rovi.me/e/${tweet_id}/${width}/${height}/${video_id}.mp4`;
        }
    }

    for (const match of url.matchAll(amplifyRe)) {
        if (match.groups) {
            let tweet_id = B64encode(BigInt(match.groups.tweet_id));
            let width = B64encode(parseInt(match.groups.width));
            let height = B64encode(parseInt(match.groups.height));
            let video_id = match.groups.video_id;
            return `https://vst.rovi.me/a/${tweet_id}/${width}/${height}/${video_id}.mp4`;
        }
    }

    for (const match of url.matchAll(tweetVidRe)) {
        if (match.groups) {
            let video_id = match.groups.video_id;
            return `https://vst.rovi.me/t/${video_id}.mp4`;
        }
    }

    return url;
}

export function decodeUrl(url: string): string | undefined {
    const re = /vst.rovi.me(?:\/(?<type>[aet]))?(\/(?<tweet_id>[a-zA-Z0-9\-_]+))?(\/(?<width>[a-zA-Z0-9\-_]+))?(\/(?<height>[a-zA-Z0-9\-_]+))?\/(?<video_id>.*)\.mp4/g;

    for (const match of url.matchAll(re)) {
        if (match.groups) {
            let type = match.groups.type;
            let video_id = match.groups.video_id;
            if (type === "t") {
                `https://video.twimg.com/tweet_video/${video_id}.mp4`;
            } else {
                let tweet_id = B64decode(match.groups.tweet_id);
                let width = B64decode(match.groups.width);
                let height = B64decode(match.groups.height);
                
                if (type === "e" || type === undefined) {
                    return `https://video.twimg.com/ext_tw_video/${tweet_id}/pu/vid/${width}x${height}/${video_id}.mp4`;
                } else if (type === "a") {
                    return `https://video.twimg.com/amplify_video/${tweet_id}/vid/${width}x${height}/${video_id}.mp4`;
                }
            }
        }
    }

    return undefined;
}