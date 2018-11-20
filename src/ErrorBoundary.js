import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class ErrorBoundary extends Component {
	static propTypes = {
		children: PropTypes.any
	};

	state = {
		hasError: false
	};

	componentDidCatch() {
		this.setState({
			hasError: true
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h1>Произошла ошибка</h1>
				</div>
			);
		}

		return this.props.children;
	}
}