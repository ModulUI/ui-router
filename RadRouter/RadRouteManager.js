import React from 'react'
import PropTypes from 'prop-types';
import * as routeHelpers from './routeHelpers';
import RadPageManager from './RadPageManager';
import RadLayerManager from './RadLayerManager';
import logger from 'infrastructure/utils/logger'

class RadRouteManager extends React.Component {
	static propTypes = {
		routes: PropTypes.shape({
			pageRoutes: PropTypes.array.isRequired,
			layerRoutes: PropTypes.array.isRequired,
		}).isRequired,
		notFound: PropTypes.func,
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		layersLimit: PropTypes.number
	};

	static defaultProps = {
		layersLimit: 5
	};

	constructor(props) {
		super(props);
		this.state = {
			layers: [],
			currentPage: props.location
		};
	}

	set currentPage(currentPage) {
		this.setState({currentPage, needUpdate: true});
	}

	get currentPage() {
		return this.state.currentPage;
	}

	set layers(layers) {
		this.setState({layers, needUpdate: true});
	}

	get layers() {
		return this.state.layers.map(s => s);
	}

	isCurrentLocation(location) {
		return this.currentPage.pathname == location.pathname;
	}

	createLayer(location) {
		return {
			location,
			layerId: 'layer_' + routeHelpers.getRandomKey()
		};
	}

	getLayerByLocation(location) {
		return this.layers.filter(s => s.location.pathname == location.pathname)[0];
	}

	getLastLayer() {
		return this.layers.length > 0 ? this.layers[0] : null;
	}

	getPageRouteById(id) {
		return this.props.routes.pageRoutes.filter(s => s.routeId === id)[0];
	}

	resolveLocation(location) {
		logger.log('RadRouteManager componentWillReceiveProps');
		const self = this;
		this.setState({needUpdate: false});

		const routes = this.props.routes;
		let layers = this.layers;
		const currentLayerRoute = routeHelpers.getLayerPage(routes.layerRoutes, location);

		if (currentLayerRoute) {
			//если слой это первая загружаемая страница, то устанавливаем задний фон дефолтную страницу
			if (this.isCurrentLocation(location)) {
				const backPageRoute = this.getPageRouteById(currentLayerRoute.parentId);
				this.currentPage = backPageRoute ? {pathname: backPageRoute.path} : {pathname: '/'};
				//logger.log('RadRouteManager setCurrentPage base');
			}

			if (this.layers.length >= this.props.layersLimit) {
				layers.splice(0, 1, this.createLayer(location));
				this.layers = layers;
				//logger.log('RadRouteManager setLayers = replace');
			} else {
				const locationLayer = this.getLayerByLocation(location);
				if (locationLayer) { //слой с таким урл уже есть в массиве
					const lastLayer = this.getLastLayer();
					if (lastLayer != locationLayer) {
						layers = layers.filter(s => s != locationLayer);
						layers.unshift(this.createLayer(location));
						//logger.log('RadRouteManager setLayers = refresh');
						this.layers = layers;

					} else {
						locationLayer.location = location;
						this.layers = layers;
					}
				}
				else {
					layers.unshift(this.createLayer(location));
					//logger.log('RadRouteManager setLayers = new');
					this.layers = layers;
				}
			}
		} else {
			const layers = this.layers;
			if (layers.length > 0) {
				layers.forEach(layer => self.closeLayer({layerId: layer.layerId}));
			}
			this.currentPage = location;
		}
	}

	destroyLayer({layerId}) {
		if (!this.layers.some(s => s.layerId == layerId))
			return;
		const layers = this.layers.filter(s => s.layerId != layerId);
		this.layers = layers;
		//если слоев не осталось, то не нужно переходить назад
		if (layers.length != 0) {
			this.props.history.replace(layers[0].location);
		}
		else {
			let loc = {...this.state.currentPage};
			loc.state = {returnToPage: true};
			this.props.history.replace(loc);
		}

	}

	closeLayer({layerId}) {
		this.hideLayer(layerId);
		const self = this;
		setTimeout(() => self.destroyLayer({layerId}), 400);
	}

	hideLayer(layerId) {
		const el = $(`[data-layer=${layerId}]`);
		if (el) {
			el.removeClass('open');
			el.addClass('hide');
		}
	}

	componentDidMount() {
		const self = this;
		$(window).keyup(function (e) {
			if (e.keyCode == 27) {
				const lastLayer = self.getLastLayer();
				lastLayer && self.closeLayer({layerId: lastLayer.layerId});
			}
		})
	}

	componentWillUnmount() {
		logger.log('RadRouteManager componentWillUnmount');
	}

	shouldComponentUpdate(props, state) {
		return state.needUpdate;
	}

	componentWillMount() {
		this.resolveLocation(this.props.location);
	}

	componentWillReceiveProps({location}) {
		this.resolveLocation(location);
	}

	render() {
		const {location, notFound, routes}=this.props;
		const {currentPage, layers} =this.state;
		logger.log('RadRouteManager render');
		return (
			<div className="poss">
				<RadPageManager
					pageLocation={currentPage}
					location={location}
					routes={routes}
					notFound={notFound}/>

				{layers.map(layer => (
					<RadLayerManager key={layer.layerId}
									 {...layer}
									 routes={routes.layerRoutes}
									 onCloseLayer={::this.closeLayer}/>

				))}
			</div>
		);
	}
}


export default RadRouteManager;