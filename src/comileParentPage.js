import {matchPath} from "react-router"
import pathToRegexp from 'path-to-regexp'

export const compileParentPage = ({location, routeRule, parentRouteRule}) => {
    if (!parentRouteRule)
        return null;

    //Проверяем есть ли параметры в родительском роуте
    const params = getRouteParams(parentRouteRule.path) || [];

    if (params.length === 0) {
        return parentRouteRule.path;
    }

    //Достаем параметры из дочернего узла
    const paramValues = getParamsValues(location, routeRule);

    return compileUrl(parentRouteRule.path, params, paramValues);
};

/**
 * Формируем новый урл на основе правила из роутинга и схемы параметров
 * @param path
 * @param params
 * @param values
 * @return {string}
 */
const compileUrl = (path, params, values = {}) => {
    const paramsObject = params.reduce((res, paramKey) => {
        res[paramKey] = values[paramKey] || '';
        return res;
    }, {});
    const toPath = pathToRegexp.compile(path);
    return toPath(paramsObject);
};

/**
 * Достаем параметры в указанном урле
 * @param location
 * @param routeRule
 * @return {*}
 */
const getParamsValues = (location, routeRule) => {
    const matchResult = matchPath(location.pathname, routeRule);
    return matchResult && matchResult.params;
};

/**
 * Возвращаем параметры необходимые для указанного роута
 * @param pathname
 * @return {Array}
 */
const getRouteParams = (pathname) => {
    const tokens = pathToRegexp.parse(pathname);
    return (tokens || [])
        .filter(token => isObject(token)
            && !!token.name
            && token.name !== 0)
        .map(token => token.name);
};

function isObject(value) {
    return value !== null && typeof value === 'object';
}