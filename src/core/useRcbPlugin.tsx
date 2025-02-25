import { useEffect } from "react";
import {
	useBotId,
	useFlow,
	RcbChunkStreamMessageEvent,
	RcbPreInjectMessageEvent,
	Plugin,
	RcbStartStreamMessageEvent,
	RcbStartSpeakAudioEvent,
	useMessages,
	useSettings,
	useChatHistory,
} from "react-chatbotify";

import HtmlWrapper from "../components/HtmlWrapper";
import { PluginConfig } from "../types/PluginConfig";
import { DefaultPluginConfig } from "../constants/DefaultPluginConfig";
import { shouldRenderHtml } from "../utils/renderConditionHelper";
import { parseHtmlMessage, stripHtml } from "../utils/htmlParser";

/**
 * Plugin hook that handles all the core logic.
 *
 * @param pluginConfig configurations for the plugin
 */
const useRcbPlugin = (pluginConfig?: PluginConfig) => {
	const { getBotId } = useBotId();
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
				if (message.tags?.includes("rcb-html-renderer-plugin:parsed")) {
				message.contentWrapper = component;
				}
			}
			replaceMessages(messagesCopy);
		}
	}, [hasChatHistoryLoaded]);

	useEffect(() => {
		/**
		 * Handles message events and adds wrapper to render html if applicable.
		 * 
		 * @param event message event received
		 */
		const handleMessageEvent = async (
			event: RcbPreInjectMessageEvent | RcbChunkStreamMessageEvent | RcbStartStreamMessageEvent
		) => {
			const sender = event.data.message?.sender.toUpperCase();

			// if message content is not string, nothing to do
			if (typeof event.data.message.content !== "string") {
				return;
			}

			// check if conditions are met for rendering html
			if (!shouldRenderHtml(event, getBotId(), getFlow(), sender)) {
				return;
			}

			if (event.type === "rcb-pre-inject-message") {
				(event as RcbPreInjectMessageEvent).data.simStreamChunker = parseHtmlMessage;
			}

			event.data.message.contentWrapper = component;
			if (!event.data.message.tags) {
				event.data.message.tags = [];
			}
			event.data.message.tags.push("rcb-html-renderer-plugin:parsed");
		};

		/**
		 * Handles audio events to speak html message properly.
		 * 
		 * @param event audio event received
		 */
		const handleAudioEvent = async (
			event: RcbStartSpeakAudioEvent
		) => {
			// check if conditions are met for rendering html to modify audio
			if (!shouldRenderHtml(event, getBotId(), getFlow(), "BOT")) {
				return;
			}

			event.data.textToRead = stripHtml(event.data.textToRead as string);
		};

		// adds required events
		window.addEventListener("rcb-pre-inject-message", handleMessageEvent);
		window.addEventListener("rcb-chunk-stream-message", handleMessageEvent);
		window.addEventListener("rcb-start-stream-message", handleMessageEvent);
		window.addEventListener("rcb-start-speak-audio", handleAudioEvent);

		return () => {
			window.removeEventListener("rcb-pre-inject-message", handleMessageEvent);
			window.removeEventListener("rcb-chunk-stream-message", handleMessageEvent);
			window.removeEventListener("rcb-start-stream-message", handleMessageEvent);
			window.removeEventListener("rcb-start-speak-audio", handleAudioEvent);
		};
	}, [getBotId, getFlow, shouldRenderHtml]);

	// initializes plugin metadata with plugin name
	const pluginMetaData: ReturnType<Plugin> = {
		name: "@rcb-plugins/html-renderer",
	};

	// adds required events in settings if auto config is true
	if (mergedPluginConfig?.autoConfig) {
		pluginMetaData.settings = {
			event: {
				rcbPreInjectMessage: true,
				rcbChunkStreamMessage: true,
				rcbStartStreamMessage: true,
				rcbStartSpeakAudio: true,
			},
		};
	}

	return pluginMetaData;
};

export default useRcbPlugin;
