'use strict';

import React from "react";

import TitlePanel from './components/TitlePanel';
import Toolbar from './components/Toolbar';
import GamePanel from './components/GamePanel';
import ProgramPanel from './components/ProgramPanel';
import ConfirmationDialog from './components/ConfirmationDialog';

import './blocks/penguin_blocks';
import './blocks/penguin_javascript';
import './blocks/webapi_blocks';
import './blocks/webapi_javascript';
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

function runProgram() {
    app.getCurrentProgram().run();
}

function debugProgram() {
    app.getCurrentProgram().debug();
}

function stopProgram() {
    app.getCurrentProgram().stop();
}

function saveProgram() {
    const filename = document.getElementById('saveFilename').value;
    var link = document.getElementById('saveBtn');
    app.getCurrentProgram().save(filename, link);
    $('#saveDropdownLink').dropdown('toggle');
}

function loadProgram() {
    const fileSelector = document.getElementById('loadFilename');
    const filename = fileSelector.files[0];
    app.getCurrentProgram().load(filename);
    $('#loadDropdownLink').dropdown('toggle');
}

document.getElementById('runBtn').addEventListener('click', runProgram, false);
document.getElementById('debugBtn').addEventListener('click', debugProgram, false);
document.getElementById('stopBtn').addEventListener('click', stopProgram, false);
document.getElementById('saveBtn').addEventListener('click', saveProgram, false);
document.getElementById('loadBtn').addEventListener('click', loadProgram, false);

window.setRunning(false);

editor.getSession().on('change', function() {
    app.getCurrentProgram().notifyCodeUpdated();
});

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
        // This is a hack to force resize after selecting another
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
    <Toolbar />
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

