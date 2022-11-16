const ALPHA_NUMS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";
function B64encode(value: number) {
    var result = '', mod;
    do {
        mod = value % 64;
        result = ALPHA_NUMS.charAt(mod) + result;
        value = Math.floor(value / 64);
    } while(value > 0);

    return result;
};

function B64decode(value: string) {
    var result = 0;
    for (var i = 0, len = value.length; i < len; i++) {
        result *= 64;
        result += ALPHA_NUMS.indexOf(value[i]);
    }

    return result;
};

export function encodeUrl(url: string): string {
    const re = /\/ext_tw_video\/(?<tweet_id>\d+)\/pu\/vid\/(?<width>\d+)x(?<height>\d+)\/(?<video_id>\w+).mp4/;

    const matches = url.matchAll(re);
    
    for (const match of matches) {
        if (match.groups) {
            let tweet_id = B64encode(parseInt(match.groups[0]));
            let width = B64encode(parseInt(match.groups[1]));
            let height = B64encode(parseInt(match.groups[2]));
            let video_id = match.groups[3];
            return `https://vst.rovi.me/${tweet_id}/${width}/${height}/${video_id}.mp4`;
        }
    }

    return url;
}