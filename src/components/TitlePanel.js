'use strict';

import React from "react";

export default class TitlePanel extends React.Component {
    render() {
        return (
  <div id="titlePanel">
    <h1><a href="/">ペンギン ブロックリー</a></h1>
    <div id="tutorialProgress"></div>
    <div id="instructionsPanel"></div>
  </div>
        );
    }
}

