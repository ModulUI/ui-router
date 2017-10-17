import React from 'react'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'

import RouteManager from './RouteManager'
import * as routeHelpers from './helpers'


@withRouter
export default class extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        notFound: PropTypes.func,
        defaultLayout: PropTypes.func,
        defaultLayerLayout: PropTypes.func,
        routeWrappers: PropTypes.arrayOf(PropTypes.func)
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            allRoutes: routeHelpers.transformRoutes(
                props.routes,
                props.defaultLayout,
                props.defaultLayerLayout
            )
        };
    }

    render() {
        const {notFound, location, history, routeWrappers} = this.props;
        return (
            <RouteManager history={history}
                          location={location}
                          routeWrappers={routeWrappers}
                          routes={this.state.allRoutes}
                          notFound={notFound}/>
        );
    }
}