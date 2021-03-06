'use strict';

import React from "react";

import ProgramBlocks from './ProgramBlocks';
import ProgramCode from './ProgramCode';

export default class ProgramPanel extends React.Component {
    constructor(props) {
        super(props);
        var scale = props.scale ? props.scale : 1.0;
        this.state = {running: false, active: 'blocks', scale: scale};
        this.programBlocks = undefined;
        this.programCode = undefined;
        this.onHideCodeTab = this.onHideCodeTab.bind(this);
        this.onShowCodeTab = this.onShowCodeTab.bind(this);
        this.resize = this.resize.bind(this);
        document.addEventListener('PROGRAM_RUNNING', this.onRunningUpdated.bind(this));
    }

    setScale(scale) {
        this.setState({scale: scale});
        this.resize();
    }

    onRunningUpdated(event) {
        this.setState({running: event.detail.running});
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

    onHideCodeTab(event) {
        if (this.getCurrentProgram().isCodeUpdated()) {
            $('#switch-blockly-confirmation').modal('show');
            event.preventDefault();
        }
    }

    onShowCodeTab() {
        const code = this.programBlocks.generateCode(false);
        const editor = this.programCode.editor;
        editor.getSession().setValue(code);
        this.getCurrentProgram().discardUpdates();
    }

    componentDidMount() {
        this.props.onRef(this);
        const programPanel = this;
        $('a[data-toggle="tab"]').on('hide.bs.tab', function(e) {
            if (e.target.id === 'code-tab') {
                programPanel.onHideCodeTab(e);
            }
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            if (e.target.id === 'code-tab') {
                programPanel.onShowCodeTab();
                programPanel.setState({active: 'code'});
            }
            else if (e.target.id === 'blockly-tab') {
                programPanel.setState({active: 'blocks'});
            }
            window.dispatchEvent(new CustomEvent("resize"));
        });
        window.mustStop = function() {
            return programPanel.getCurrentProgram().mustStop;
        }
        window.setRunning = function(value) {
            programPanel.getCurrentProgram().setRunning(value);
        }
        this.resize();
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    resize() {
        var g = document.getElementById("game");
        var l = document.getElementById("leftColumn");
        var p = document.getElementById("tabNavContent");
        var w = window.innerWidth - (l.clientWidth + 20);
        var h = Math.max(g.clientHeight, window.innerHeight - p.offsetTop - 5);
        if (p.clientWidth != w || p.clientHeight != h) {
            p.setAttribute("style", "width: " + w + "px; height: " + h + "px;");
            this.getCurrentProgram().resize();
        }
    }

    render() {
        return (
  <div>
    <div id="tabNavigation" class="nav nav-tabs" role="tablist">
      <a class={"nav-item nav-link" + (this.state.active === "blocks" ? " active" : "") + (this.state.running ? " disabled" : "")} id="blockly-tab" data-toggle="tab" href="#blockly" role="tab" aria-controls="blockly" aria-selected="true">ブロック</a>
      <a class={"nav-item nav-link" + (this.state.active === "code" ? " active" : "") + (this.state.running ? " disabled" : "")} id="code-tab" data-toggle="tab" href="#code" role="tab" aria-controls="code" aria-selected="false">コード</a>
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

