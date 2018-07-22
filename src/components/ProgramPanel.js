'use strict';

import React from "react";

import ProgramBlocks from './ProgramBlocks';
import ProgramCode from './ProgramCode';
const toolbox = require('../blocks/toolbox.xml');

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

const workspace = Blockly.inject(
    'blocklyPanel', {
        toolbox: toolbox,
        grid: {
            spacing: 18,
            length: 3,
            colour: '#ccc',
            snap: true,
        },
        trashcan: true,
        zoom: {
            controls: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
        },
    },
);

// Initialize ACE Javascript editor
var editor = ace.edit("jsCode");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    fontSize: "12pt"
});

        this.programBlocks.setWorkspace(workspace);
        this.programCode.setEditor(editor);
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

