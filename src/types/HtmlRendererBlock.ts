import { Block } from 'react-chatbotify';

/**
 * Extends the Block from React ChatBotify to support html renderer attributes.
 */
export type HtmlRendererBlock = Block & {
	renderHtml?: Array<'USER' | 'BOT'>;
};
