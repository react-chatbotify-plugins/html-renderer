import {
    Flow,
    RcbChunkStreamMessageEvent,
    RcbPreInjectMessageEvent,
    RcbStartSpeakAudioEvent,
    RcbStartStreamMessageEvent
} from "react-chatbotify";
import { HtmlRendererBlock } from "../types/HtmlRendererBlock";

/**
 * Helper function to determine if html rendering should occur.
 * 
 * @param event specific message send event
 * @param currBotId id of the bot receiving the event
 * @param currFlow current flow used by the chatbot
 * @param sender sender of the message
 */
const shouldRenderHtml = (
    event: RcbPreInjectMessageEvent | RcbStartStreamMessageEvent |
        RcbChunkStreamMessageEvent | RcbStartSpeakAudioEvent,
    currBotId: string | null,
    currFlow: Flow,
    sender: string
): boolean => {
    // if event is not from the bot, nothing to do
    if (currBotId !== event.detail.botId) {
        return false;
    }

    // render html is currently only for bot/user messages
    if (sender !== "BOT" && sender !== "USER") {
        return false;
    }

    // check current block exist
    if (!event.detail.currPath) {
        return false;
    }
    const currBlock = currFlow[event.detail.currPath] as HtmlRendererBlock;
    if (!currBlock) {
        return false;
    }

    // check if sender is included for rendering html
    return currBlock.renderHtml?.map((elem: string) => elem.toUpperCase()).includes(sender) ?? false;
};

export {
    shouldRenderHtml,
}
