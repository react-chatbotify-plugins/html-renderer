import {
	Flow,
	RcbChunkStreamMessageEvent,
	RcbPreInjectMessageEvent,
	RcbStartSpeakAudioEvent,
	RcbStartStreamMessageEvent,
} from 'react-chatbotify';
import { HtmlRendererBlock } from '../types/HtmlRendererBlock';

/**
 * Helper function to determine if html rendering should occur.
 *
 * @param event specific message send event
 * @param currFlow current flow used by the chatbot
 * @param sender sender of the message
 */
const shouldRenderHtml = (
	event: RcbPreInjectMessageEvent | RcbStartStreamMessageEvent | RcbChunkStreamMessageEvent | RcbStartSpeakAudioEvent,
	currFlow: Flow,
	sender: string
): boolean => {
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

export { shouldRenderHtml };
