import React from 'react'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'

import LoadingComponent from './LoadingComponent';
import ErrorBoundary from './ErrorBoundary';
import RouteManager from './RouteManager'
import * as routeHelpers from './helpers'
import LayerIdContext from './LayerIdContext';


@withRouter
export default class extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        notFound: PropTypes.func,
        defaultLayout: PropTypes.func,
		defaultLayerLayout: PropTypes.func,
		loadingComponent: PropTypes.func,
		errorBoundary: PropTypes.func,
        routeWrappers: PropTypes.arrayOf(PropTypes.func),
        withLayerIdContext: PropTypes.bool,
    };

    static defaultProps = {
    	loadingComponent: LoadingComponent,
        errorBoundary: ErrorBoundary,
        withLayerIdContext: false,
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
        const {
            notFound,
            location,
            history,
            routeWrappers,
            loadingComponent,
            errorBoundary,
            withLayerIdContext
        } = this.props;

        return (
			<RouteManager
				history={history}
				location={location}
				routeWrappers={routeWrappers}
				routes={this.state.allRoutes}
				loadingComponent={loadingComponent}
				errorBoundary={errorBoundary}
                notFound={notFound}
                withLayerIdContext={withLayerIdContext}
			/>
        );
    }
}

export {LayerIdContext};