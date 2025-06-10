import { useEffect } from 'react';
import {
	useFlow,
	RcbChunkStreamMessageEvent,
	RcbPreInjectMessageEvent,
	Plugin,
	RcbStartStreamMessageEvent,
	RcbStartSpeakAudioEvent,
	useMessages,
	useSettings,
	useChatHistory,
	RcbStartSimulateStreamMessageEvent,
	useOnRcbEvent,
	RcbEvent,
} from 'react-chatbotify';

import HtmlWrapper from '../components/HtmlWrapper';
import { PluginConfig } from '../types/PluginConfig';
import { DefaultPluginConfig } from '../constants/DefaultPluginConfig';
import { shouldRenderHtml } from '../utils/renderConditionHelper';
import { parseHtmlMessage, stripHtml } from '../utils/htmlParser';

/**
 * Plugin hook that handles all the core logic.
 *
 * @param pluginConfig configurations for the plugin
 */
const useRcbPlugin = (pluginConfig?: PluginConfig) => {
	const { getFlow } = useFlow();
	const { messages, replaceMessages } = useMessages();
	const { settings } = useSettings();
	const { hasChatHistoryLoaded } = useChatHistory();

	const mergedPluginConfig = { ...pluginConfig, ...DefaultPluginConfig };

	// if custom component provided, use it; otherwise defaults to react-html
	const component = mergedPluginConfig.htmlComponent ? mergedPluginConfig.htmlComponent : HtmlWrapper;

	useEffect(() => {
		if (hasChatHistoryLoaded) {
			const messagesCopy = [...messages];
			for (let i = 0; i < messagesCopy.length && i < (settings.chatHistory?.maxEntries ?? 30); i++) {
				const message = messagesCopy[i];
				if (message.tags?.includes('rcb-html-renderer-plugin:parsed')) {
					message.contentWrapper = component;
				}
			}
			replaceMessages(messagesCopy);
		}
	}, [hasChatHistoryLoaded]);

	/**
	 * Handles message events and adds wrapper to render html if applicable.
	 *
	 * @param event message event received
	 */
	const handleMessageEvent = async (
		event:
			| RcbPreInjectMessageEvent
			| RcbChunkStreamMessageEvent
			| RcbStartSimulateStreamMessageEvent
			| RcbStartStreamMessageEvent
	) => {
		const sender = event.data.message?.sender.toUpperCase();

		// if message content is not string, nothing to do
		if (typeof event.data.message.content !== 'string') {
			return;
		}

		// check if conditions are met for rendering html
		if (!shouldRenderHtml(event, getFlow(), sender)) {
			return;
		}

		if (event.type === 'rcb-start-simulate-stream-message') {
			(event as RcbStartSimulateStreamMessageEvent).data.simulateStreamChunker = parseHtmlMessage;
		}

		event.data.message.contentWrapper = component;
		if (!event.data.message.tags) {
			event.data.message.tags = [];
		}
		event.data.message.tags.push('rcb-html-renderer-plugin:parsed');
	};

	/**
	 * Handles audio events to speak html message properly.
	 *
	 * @param event audio event received
	 */
	const handleAudioEvent = async (event: RcbStartSpeakAudioEvent) => {
		// check if conditions are met for rendering html to modify audio
		if (!shouldRenderHtml(event, getFlow(), 'BOT')) {
			return;
		}

		event.data.textToRead = stripHtml(event.data.textToRead as string);
	};

	// adds required events
	useOnRcbEvent(RcbEvent.PRE_INJECT_MESSAGE, handleMessageEvent);
	useOnRcbEvent(RcbEvent.CHUNK_STREAM_MESSAGE, handleMessageEvent);
	useOnRcbEvent(RcbEvent.START_STREAM_MESSAGE, handleMessageEvent);
	useOnRcbEvent(RcbEvent.START_SIMULATE_STREAM_MESSAGE, handleMessageEvent);
	useOnRcbEvent(RcbEvent.START_SPEAK_AUDIO, handleAudioEvent);

	// initializes plugin metadata with plugin name
	const pluginMetaData: ReturnType<Plugin> = {
		name: '@rcb-plugins/html-renderer',
	};

	// adds required events in settings if auto config is true
	if (mergedPluginConfig?.autoConfig) {
		pluginMetaData.settings = {
			event: {
				rcbPreInjectMessage: true,
				rcbChunkStreamMessage: true,
				rcbStartSimulateStreamMessage: true,
				rcbStartStreamMessage: true,
				rcbStartSpeakAudio: true,
			},
		};
	}

	return pluginMetaData;
};

export default useRcbPlugin;
