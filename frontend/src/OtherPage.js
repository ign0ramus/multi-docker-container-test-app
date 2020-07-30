import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
	return (
		<div>
			The OTHER page!
			<Link to='/'>Go HOME</Link>
		</div>
	);
};
