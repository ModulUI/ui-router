import React, {Component} from 'react'
import {Switch} from 'react-router-dom'
import PropTypes from 'prop-types'

import * as routeHelpers from './helpers'
import LayerIdContext from "./LayerIdContext";


export default class extends Component {
    static propTypes = {
        routes: PropTypes.array.isRequired, //роуты слоев
        layerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        location: PropTypes.object.isRequired,
        onCloseLayer: PropTypes.func.isRequired,
        routeWrappers: PropTypes.arrayOf(PropTypes.func),
        withLayerIdContext: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            pages: []
        };
    }

    shouldComponentUpdate(props) {
        return !routeHelpers.equalLocations(props.location, this.props.location);
    }

    componentWillMount() {
        const {layerId, routes, onCloseLayer, routeWrappers} = this.props;

        const pages = routes.map(route => routeHelpers.generateRouteComponent({
            props: {...route, layerId, onCloseLayer},
            routeId: route.routeId,
            routeWrappers
        }));

        this.setState({pages});
    }

    render() {
        const {location, withLayerIdContext, layerId} = this.props;
        const {pages} = this.state;

        if (withLayerIdContext) {
            return <LayerIdContext.Provider value={layerId}>
                <Switch location={location}>{pages}</Switch>
            </LayerIdContext.Provider>;
        }

        return <Switch location={location}>{pages}</Switch>;
    }
}