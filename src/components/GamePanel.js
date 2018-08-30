'use strict';

import React from "react";

export default class GamePanel extends React.Component {
    constructor(props) {
        super(props);
        var scale = props.scale ? props.scale : 1.0;
        this.state = {width: 800, height: 600, scale: scale, mouse_x: 0, mouse_y: 0};
    }

    setScale(scale) {
        this.setState({scale: scale});
    }

    componentDidMount() {
        var getMousePos = function (canvas, e) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        var game = document.getElementById('game');
        var gamePanel = this;
        game.addEventListener('mousemove', function(e) {
            var mousePos = getMousePos(game, e);
            gamePanel.setState({mouse_x: mousePos.x, mouse_y: mousePos.y});
        });
    }

    componentDidUpdate() {
        this.props.onRef(this);
        var game = document.getElementById('game');
        var ctx = game.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
      <div id="mouse_pos" style={{'textAlign': 'right', 'marginRight': '20px', 'fontSize': '8pt'}}>
        {'x: ' + this.state.mouse_x + ', y: ' + this.state.mouse_y}
      </div>
    </div>
        );
    }
}

