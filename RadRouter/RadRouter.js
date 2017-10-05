import React from 'react'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types';
import RadRouteManager from './RadRouteManager'
import * as routeHelpers from './routeHelpers'
import logger from 'infrastructure/utils/logger'

@withRouter
class RadRouter extends React.Component {
	static propTypes = {
		routes: PropTypes.array.isRequired,
		notFound: PropTypes.func,
		defaultLayout: PropTypes.func,
		defaultLayerLayout: PropTypes.func
	};

	componentWillUnmount() {
		logger.log('RadRouter componentWillUnmount');
	}

	constructor(props, context) {
		super(props, context);
		this.state = {
			allRoutes: routeHelpers.transformRoutes(props.routes, props.defaultLayout, props.defaultLayerLayout)
		};
	}

	render() {
		const {notFound, location, history} = this.props;
		return (
			<RadRouteManager history={history} location={location} routes={this.state.allRoutes} notFound={notFound}/>);
	}
}

export default RadRouter
