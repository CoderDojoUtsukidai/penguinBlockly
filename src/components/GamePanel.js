'use strict';

import React from "react";

export default class GamePanel extends React.Component {
    constructor(props) {
        super(props);
        var scale = props.scale ? props.scale : 1.0;
        this.state = {width: 800, height: 600, scale: scale};
    }

    setScale(scale) {
        this.setState({scale: scale});
    }

    componentDidUpdate() {
        this.props.onRef(this);
        var game = document.getElementById('game');
        var ctx = game.getContext('2d');
        ctx.resetTransform();
        ctx.scale(this.state.scale, this.state.scale);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    render() {
        var w = this.state.width * this.state.scale;
        var h = this.state.height * this.state.scale;
        return (
    <div id="gamePanel">
      <canvas id="game" width={w + "px"} height={h + "px"} />
    </div>
        );
    }
}

