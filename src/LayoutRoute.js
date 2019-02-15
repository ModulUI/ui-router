import PropTypes from 'prop-types';
import React from 'react'

export default (RouteComponent) => {

    class LayoutRoute extends React.Component {

        static propTypes = {
			component: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.node),
				PropTypes.node,
				PropTypes.func
			]),
			layout: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.node),
				PropTypes.node,
				PropTypes.func
			])
        };

        render() {
            const {component: Component, layout: Layout, ...props} = this.props;
            return (
                <RouteComponent
                    {...props}
                    render={(routeProps) =>
                        <Layout {...props}>
                            {Component && <Component/>}
                        </Layout>
                    }/>
            );
        }
    }

    return LayoutRoute;
}

