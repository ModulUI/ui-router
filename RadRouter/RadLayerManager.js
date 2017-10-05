import React from 'react'
import {Switch} from 'react-router-dom'
import * as routeHelpers from './routeHelpers'
import PropTypes from 'prop-types';

class RadLayerManager extends React.Component {
	static propTypes = {
		routes: PropTypes.array.isRequired, //роуты слоев
		layerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		location: PropTypes.object.isRequired,
		onCloseLayer: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {pages: []};
	}

	componentWillUnmount() {
		console.log('RadLayerManager Unmount');
	}

	shouldComponentUpdate(props) {
		logger.log('RadLayerManager shouldComponentUpdate', this.props.layerId);
		return !routeHelpers.equalLocations(props.location, this.props.location);
	}

	componentWillMount() {
		logger.log('RadLayerManager componentWillMount', this.props.layerId);
		const {layerId, routes, onCloseLayer}=this.props;
		const pages = routes.map(route => routeHelpers.generateRouteComponent({
			props: {...route, layerId, onCloseLayer},
			routeId: route.routeId
		}));
		this.setState({pages});
	}

	render() {
		logger.log('RadLayerManager render', this.props.layerId);
		const {location}=this.props;
		const {pages}=this.state;
		return (<Switch location={location}>{pages}</Switch>);
	}
}

export default RadLayerManager;