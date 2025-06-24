import { Interweave } from 'interweave';

/**
 * Renders html content passed as children.
 *
 * @param children html text to render
 */
const HtmlWrapper = ({ children }: { children: React.ReactNode }) => {
	// ensures that htmlText is a string
	const htmlText = typeof children === 'string' ? children : '';
	return (
		<div style={{ whiteSpace: 'normal' }}>
			<Interweave content={htmlText} />
		</div>
	);
};

export default HtmlWrapper;
