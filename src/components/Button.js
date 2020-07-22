import React, {Component} from "react";
import './Button.css';

export default class Button extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        this.props.onButtonClick(e.target.value)
    }

    render() {
        const className = this.props.className
        const text = this.props.text

        return (
            <button
                className={className}
                onClick={this.handleChange}
            >
                {text}
            </button>
        )
    }
}