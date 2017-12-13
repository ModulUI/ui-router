import React from 'react'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import * as routeHelpers from './helpers'
import {Switch} from 'react-router-dom'

@withRouter
export default class extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        notFound: PropTypes.func,
        defaultLayout: PropTypes.func,
        routeWrappers: PropTypes.arrayOf(PropTypes.func)
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            allRoutes: routeHelpers.transformRoutes(
                props.routes,
                props.defaultLayout,
                ({children}) => (<div>{children}</div>)
            )
        };
    }

    render() {
        const {notFound:NotFound, routeWrappers} = this.props;
        const routes = this.state.allRoutes;

        return (
            <Switch>
                {routes.pageRoutes.map(route =>
                    routeHelpers.generateRouteComponent({props: route, routeId: route.routeId, routeWrappers}))}
                {NotFound && <NotFound/>}
            </Switch>
        );
    }
}