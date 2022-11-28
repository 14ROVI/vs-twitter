const ALPHA_NUMS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";
function B64encode(value: number | bigint) {
    let big_value = BigInt(value);
    let result = '', mod;
    do {
        mod = big_value % 64n;
        result = ALPHA_NUMS.charAt(Number(mod)) + result;
        big_value = big_value / 64n;
    } while (big_value > 0);

    return result;
};

function B64decode(value: string) {
    let result = 0n;
    for (var i = 0, len = value.length; i < len; i++) {
        result *= 64n;
        result += BigInt(ALPHA_NUMS.indexOf(value[i]));
    }

    return result;
};

export function encodeUrl(url: string): string {
    const re = /\/ext_tw_video\/(?<tweet_id>\d+)\/pu\/vid\/(?<width>\d+)x(?<height>\d+)\/(?<video_id>.*).mp4/g;

    const matches = url.matchAll(re);
    
    for (const match of matches) {
        if (match.groups) {
            console.log(match.groups);
            let tweet_id = B64encode(BigInt(match.groups.tweet_id));
            let width = B64encode(parseInt(match.groups.width));
            let height = B64encode(parseInt(match.groups.height));
            let video_id = match.groups.video_id;
            return `https://vst.rovi.me/${tweet_id}/${width}/${height}/${video_id}.mp4`;
        }
    }

    return url;
}

export function decodeUrl(url: string): string | undefined {
    const re = /\/(?<tweet_id>\w+)\/(?<width>\w+)\/(?<height>\w+)\/(?<video_id>.*).mp4/g;

    const matches = url.matchAll(re);
    
    for (const match of matches) {
        if (match.groups) {
            console.log(match.groups);
            let tweet_id = B64decode(match.groups.tweet_id);
            let width = B64decode(match.groups.width);
            let height = B64decode(match.groups.height);
            let video_id = match.groups.video_id;
            return `https://video.twimg.com/ext_tw_video/${tweet_id}/pu/vid/${width}x${height}/${video_id}.mp4`;
        }
    }

    return undefined;
}