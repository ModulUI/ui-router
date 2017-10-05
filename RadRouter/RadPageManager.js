import React from 'react'
import {Switch} from 'react-router-dom'
import PropTypes from 'prop-types';
import {isLayerPage, generateRouteComponent} from './routeHelpers'
import logger from 'infrastructure/utils/logger'

class RadPageManager extends React.Component {

	static propTypes = {
		routes: PropTypes.shape({
			pageRoutes: PropTypes.array.isRequired,
			layerRoutes: PropTypes.array.isRequired,
		}),
		notFound: PropTypes.func,
		pageLocation: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	componentWillUnmount() {
		logger.log('RadPageManager componentWillUnmount');
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {location, routes, pageLocation}=nextProps;
		const {returnToPage} = location.state || {};
		return !isLayerPage(routes.layerRoutes, location)
			&& !returnToPage;
		//&& pageLocation.pathname != location.pathname;
	}

	render() {
		const {routes, pageLocation, notFound:NotFound}=this.props;

		return (<Switch location={pageLocation}>
			{routes.pageRoutes.map(route =>
				generateRouteComponent({props: route, routeId: route.routeId}))}
			{NotFound && <NotFound/>}
		</Switch>);
	}
}

export default RadPageManager;