'use strict';

import React from "react";

import TitlePanel from './components/TitlePanel';
import Toolbar from './components/Toolbar';
import GamePanel from './components/GamePanel';
import ProgramPanel from './components/ProgramPanel';
import ConfirmationDialog from './components/ConfirmationDialog';

import Tutorial from './Tutorial';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.programPanel = null;
    }

    getCurrentProgram() {
        return this.programPanel.getCurrentProgram();
    }

    componentDidMount() {

var app = this;
var editor = app.programPanel.programCode.editor;
var workspace = app.programPanel.programBlocks.workspace;

window.mustStop = function() {
    return app.getCurrentProgram().mustStop;
}

window.setRunning = function(value) {
    app.getCurrentProgram().setRunning(value);
    if (value) {
        $('#runBtn').addClass('disabled');
        $('#debugBtn').addClass('disabled');
        $('#saveDropdownLink').addClass('disabled');
        $('#loadDropdownLink').addClass('disabled');
        $('#stopBtn').removeClass('disabled');
        $('.nav-link').addClass('disabled');
    } else {
        $('#runBtn').removeClass('disabled');
        $('#debugBtn').removeClass('disabled');
        $('#saveDropdownLink').removeClass('disabled');
        $('#loadDropdownLink').removeClass('disabled');
        $('#stopBtn').addClass('disabled');
        $('.nav-link').removeClass('disabled');
    }
}

window.setRunning(false);

$('a[data-toggle="tab"]').on('hide.bs.tab', function(e) {
    if (e.target.id === 'code-tab') {
        if (app.getCurrentProgram().isCodeUpdated()) {
            $('#switch-blockly-confirmation').modal('show');
            e.preventDefault();
        }
    }
});

function confirmSwitchTab() {
    app.getCurrentProgram().discardUpdates();
    $('#blockly-tab').tab('show');
    $('#switch-blockly-confirmation').modal('hide');
}

document.getElementById('confirmSwitchTabBtn').addEventListener('click', confirmSwitchTab, false);

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    if (e.target.id === 'code-tab') {
        const code = app.programPanel.programBlocks.generateCode(false);
        editor.getSession().setValue(code);
        app.getCurrentProgram().discardUpdates();
    }
});

function resize() {
    console.log("resize");
    var w = window.innerWidth - 850;
    var h = document.getElementById("game").clientHeight;
    var p = document.getElementById("tabNavContent");
    if (p.clientWidth != w) {
        p.setAttribute("style", "width: " + w + "px; height: " + h + "px;");
        // This is a hack to force resize
        setTimeout(() => {
            var e = new CustomEvent("resize");
            window.dispatchEvent(e);
        }, 1);
    }
}

resize();

window.onresize = resize;

var tutorial = new Tutorial(workspace, app.programPanel.programBlocks);
tutorial.notifyHashChanged();

    }

    render() {
        return (
<div>
  <TitlePanel />
  <div id="leftColumn" class="column left">
    <Toolbar getCurrentProgram={this.getCurrentProgram.bind(this)} />
    <GamePanel />
  </div>
  <div id="rightColumn" class="column right">
    <ProgramPanel onRef={ref => (this.programPanel = ref)} />;
  </div>
  <ConfirmationDialog />
</div>
        );
    }
}

