'use strict';

import React from "react";

export default class GamePanel extends React.Component {
    render() {
        return (
    <div id="gamePanel">
      <canvas id="game" width="800px" height="600px" />
    </div>
        );
    }
}

