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
        this.getCurrentProgram = this.getCurrentProgram.bind(this);
        this.getProgramBlocks = this.getProgramBlocks.bind(this);
        this.programPanel = null;
    }

    getCurrentProgram() {
        return this.programPanel ? this.programPanel.getCurrentProgram() : null;
    }

    getProgramBlocks() {
        return this.programPanel ? this.programPanel.programBlocks : null;
    }

    render() {
        return (
<div>
  <TutorialPanel getProgramBlocks={this.getProgramBlocks} />
  <div id="leftColumn" class="column left">
    <Toolbar getCurrentProgram={this.getCurrentProgram} />
    <GamePanel />
  </div>
  <div id="rightColumn" class="column right">
    <ProgramPanel onRef={ref => (this.programPanel = ref)} />
  </div>
  <ConfirmationDialog getCurrentProgram={this.getCurrentProgram} />
</div>
        );
    }
}

