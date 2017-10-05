import PropTypes from 'prop-types';
import React from 'react'

export default (RouteComponent) => {
	class LayoutRoute extends React.Component {
		static propTypes = {
			component: PropTypes.func,
			layout: PropTypes.func.isRequired
		};

		render() {
			const {component:Component, layout:Layout, ...props}=this.props;
			return (<RouteComponent  { ...props }
									 render={(routeProps) =>
										 <Layout {...props}>
											 {Component && <Component/>}</Layout>}/>);
		}
	}

	return LayoutRoute;
}

