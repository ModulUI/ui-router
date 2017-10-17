import React from 'react'
import {Switch} from 'react-router-dom'
import PropTypes from 'prop-types';

import {isLayerPage, generateRouteComponent} from './helpers'


export default class extends React.Component {
    static propTypes = {
        routes: PropTypes.shape({
            pageRoutes: PropTypes.array.isRequired,
            layerRoutes: PropTypes.array.isRequired,
        }),
        notFound: PropTypes.func,
        pageLocation: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        routeWrappers: PropTypes.arrayOf(PropTypes.func)

    };

    shouldComponentUpdate(nextProps) {
        const {location, routes} = nextProps;
        const {returnToPage} = location.state || {};

        return !isLayerPage(routes.layerRoutes, location)
            && !returnToPage;
    }

    render() {
        const {routes, pageLocation, routeWrappers, notFound: NotFound} = this.props;

        return (
            <Switch location={pageLocation}>
                {routes.pageRoutes.map(route =>
                    generateRouteComponent({props: route, routeId: route.routeId, routeWrappers}))}
                {NotFound && <NotFound/>}
            </Switch>
        );
    }
}