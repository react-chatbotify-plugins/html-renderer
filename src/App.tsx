import ChatBot, { Flow, Params } from 'react-chatbotify';

import RcbPlugin from './factory/RcbPluginFactory';
import { HtmlRendererBlock } from './types/HtmlRendererBlock';
import HtmlWrapper from './components/HtmlWrapper';

const App = () => {
	// initialize the plugin
	const plugins = [RcbPlugin({ htmlComponent: HtmlWrapper })];

	// example flow for testing
	const flow: Flow = {
		start: {
			message: "<h4>Hello! I'm rendering messages in html, you can type to me in html too!</h4>",
			path: 'loop',
			renderHtml: ['BOT', 'USER'],
		} as HtmlRendererBlock,
		loop: {
			message: async (params: Params) => {
				await params.injectMessage(`This is pretty cool <b>isn't it?</b>!`);
			},
			chatDisabled: false,
			path: 'loop',
			renderHtml: ['BOT', 'USER'],
		} as HtmlRendererBlock,
	};

	return <ChatBot id="chatbot-id" plugins={plugins} flow={flow}></ChatBot>;
};

export default App;
