'use strict';

import React from "react";

import ProgramBlocks from './ProgramBlocks';
import ProgramCode from './ProgramCode';

export default class ProgramPanel extends React.Component {
    constructor(props) {
        super(props);
        this.programBlocks = undefined;
        this.programCode = undefined;
    }

    isBlocklyVisible() {
        return document.getElementById('blockly').classList.contains('active');
    }

    getCurrentProgram() {
        if (this.isBlocklyVisible()) {
            return this.programBlocks;
        } else {
            return this.programCode;
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    render() {
        return (
  <div>
    <div id="tabNavigation" class="nav nav-tabs" role="tablist">
      <a class="nav-item nav-link active" id="blockly-tab" data-toggle="tab" href="#blockly" role="tab" aria-controls="blockly" aria-selected="true">ブロック</a>
      <a class="nav-item nav-link" id="code-tab" data-toggle="tab" href="#code" role="tab" aria-controls="code" aria-selected="false">コード</a>
    </div>
    <div class="tab-content" id="tabNavContent">
      <div id="blockly" class="tab-pane fade show active" role="tabpanel" aria-labelledby="blockly-tab">
        <ProgramBlocks onRef={ref => (this.programBlocks = ref)} />
      </div>
      <div id="code" class="tab-pane fade" role="tabpanel" aria-labelledby="code-tab">
        <ProgramCode onRef={ref => (this.programCode = ref)} />
      </div>
    </div>
  </div>
        );
    }
}

