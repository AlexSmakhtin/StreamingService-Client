import {serverUrls} from "./serverUrl.ts";

export const createTrackSourceUrl =
    (trackId: string, userId: string, position: number = 0): string => {
    return `${serverUrls.trackToListen}?id=${trackId}&position=${position}&userid=${userId}`;
}