import pathToRegexp from 'path-to-regexp'
import React from 'react'
import {Route} from 'react-router-dom'
import LayoutRoute from './LayoutRoute'


export const isLayerPage = (routes, location) => {
    return getLayerPage(routes, location) != null;
};

export const getLayerPage = (routes, location) => {
    return routes.filter(s => {
        const re = pathToRegexp(s.path, []);
        return re.exec(location.pathname) != null;
    })[0];
};


export const equalLocations = (a, b) => {
    return a.pathname == b.pathname
        && a.hash == b.hash
        && a.search == b.search;
};

export const getRandomKey = () => {
    return Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
};

export const generateRouteComponent = ({routeId, props, routeWrappers}) => {
    const key = `page_route_` + routeId;
    if (!routeId)
        throw 'RouteId must be set';

    if (props.path) {
        const RouteComponent = getRouteComponent(key, props, routeWrappers);
        return (<RouteComponent key={key} {...props} />);
    }
    else if (props.render) {
        return props.render({key});
    }
};

export const getRouteComponent = (key, props, routeWrappers) => {

    const {layout}=props;
    let routeComponent = Route;

    if (layout)
        routeComponent = LayoutRoute(routeComponent);

    if (routeWrappers && routeWrappers.length > 0)
        routeWrappers.reduce((routeComponent, wrapper) => wrapper(routeComponent, props), routeComponent);

    return routeComponent;
};

export const transformRoutes = (routes, defaultLayout, defaultLayerLayout) => {
    return transformSectionRoutes(routes, defaultLayout, defaultLayerLayout);
};

function transformSectionRoutes(routes, defaultLayout, defaultLayerLayout, parent = null) {
    return routes.reduce((r, rule) => {
        const route = createRoute(rule, defaultLayout, defaultLayerLayout, parent);
        if (rule.isLayer) {
            r.layerRoutes = [...r.layerRoutes, route];
        } else {
            r.pageRoutes = [...r.pageRoutes, route];
        }

        if (rule.nested) {
            const sectionRoutes = transformSectionRoutes(rule.nested, defaultLayout, defaultLayerLayout, route)
            r.layerRoutes = [...r.layerRoutes, ...sectionRoutes.layerRoutes];
            r.pageRoutes = [...r.pageRoutes, ...sectionRoutes.pageRoutes];
        }

        return r;
    }, {pageRoutes: [], layerRoutes: []});
}

function createRoute(rule, defaultLayout, defaultLayerLayout, parent) {
    const cleanRule = {...rule};
    delete cleanRule.nested;
    const route = {
        routeId: `${rule.name}_${getRandomKey()}`,
        ...cleanRule,
        parentId: parent ? parent.routeId : null
    };
    if (rule.isLayer) {
        route.layout = rule.layout === undefined ? defaultLayerLayout : rule.layout;
    } else {
        route.layout = rule.layout === undefined ? defaultLayout : rule.layout;
    }
    return route;
}
