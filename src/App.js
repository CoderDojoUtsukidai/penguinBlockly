'use strict';

import React from "react";

import TutorialPanel from './components/TutorialPanel';
import Toolbar from './components/Toolbar';
import GamePanel from './components/GamePanel';
import ProgramPanel from './components/ProgramPanel';
import ConfirmationDialog from './components/ConfirmationDialog';


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {scale: 1.0};
        this.getCurrentProgram = this.getCurrentProgram.bind(this);
        this.getProgramBlocks = this.getProgramBlocks.bind(this);
        this.gamePanel = null;
        this.programPanel = null;
        this.resize = this.resize.bind(this);
        window.onresize = this.resize;
    }

    getCurrentProgram() {
        return this.programPanel ? this.programPanel.getCurrentProgram() : null;
    }

    getProgramBlocks() {
        return this.programPanel ? this.programPanel.programBlocks : null;
    }

    componentDidMount() {
        this.resize();
    }

    resize() {
        console.log("resize");
        var w = window.innerWidth;
        if (w > 1600) {
            this.setState({scale: 1.0});
        }
        else if (w > 1500) {
            this.setState({scale: 0.85});
        }
        else if (w > 1400) {
            this.setState({scale: 0.75});
        }
        else if (w > 1200) {
            this.setState({scale: 0.6});
        }
        else if (w > 1000) {
            this.setState({scale: 0.5});
        }
        else if (w > 800) {
            this.setState({scale: 0.4});
        }
        else {
            this.setState({scale: 0.35});
        }
        if (this.gamePanel && this.programPanel) {
            this.gamePanel.setScale(this.state.scale);
            this.programPanel.setScale(this.state.scale);
        }
    }

    render() {
        return (
<div>
  <TutorialPanel getProgramBlocks={this.getProgramBlocks} />
  <div id="leftColumn" class="column left">
    <Toolbar getCurrentProgram={this.getCurrentProgram} />
    <GamePanel scale={this.state.scale} onRef={ref => (this.gamePanel = ref)} />
  </div>
  <div id="rightColumn" class="column right">
    <ProgramPanel scale={this.state.scale} onRef={ref => (this.programPanel = ref)} />
  </div>
  <ConfirmationDialog getCurrentProgram={this.getCurrentProgram} />
</div>
        );
    }
}

