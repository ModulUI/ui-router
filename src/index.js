import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'


@withRouter
export default class extends Component {

    static propTypes = {
        routes: PropTypes.array.isRequired
    };

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>Hello</div>
        )
    }
}