'use strict';

import React from "react";

import TitlePanel from './components/TitlePanel';
import Toolbar from './components/Toolbar';
import GamePanel from './components/GamePanel';
import TabPanel from './components/TabPanel';
import ConfirmationDialog from './components/ConfirmationDialog';

import ProgramCode from './ProgramCode';
import ProgramBlocks from './ProgramBlocks';
import './blocks/penguin_blocks';
import './blocks/penguin_javascript';
import './blocks/webapi_blocks';
import './blocks/webapi_javascript';
import Tutorial from './Tutorial';
const toolbox = require('./blocks/toolbox.xml');


export default class Layout extends React.Component {
    componentDidMount() {

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

const programBlocks = new ProgramBlocks(workspace);
const programCode = new ProgramCode(editor);

function isBlocklyVisible() {
    return document.getElementById('blockly').classList.contains('active');
}

function getCurrentProgram() {
    if (isBlocklyVisible()) {
        return programBlocks;
    } else {
        return programCode;
    }
}

window.mustStop = function() {
    return getCurrentProgram().mustStop;
}

window.setRunning = function(value) {
    getCurrentProgram().setRunning(value);
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
    getCurrentProgram().run();
}

function debugProgram() {
    getCurrentProgram().debug();
}

function stopProgram() {
    getCurrentProgram().stop();
}

function saveProgram() {
    const filename = document.getElementById('saveFilename').value;
    var link = document.getElementById('saveBtn');
    getCurrentProgram().save(filename, link);
    $('#saveDropdownLink').dropdown('toggle');
}

function loadProgram() {
    const fileSelector = document.getElementById('loadFilename');
    const filename = fileSelector.files[0];
    getCurrentProgram().load(filename);
    $('#loadDropdownLink').dropdown('toggle');
}

document.getElementById('runBtn').addEventListener('click', runProgram, false);
document.getElementById('debugBtn').addEventListener('click', debugProgram, false);
document.getElementById('stopBtn').addEventListener('click', stopProgram, false);
document.getElementById('saveBtn').addEventListener('click', saveProgram, false);
document.getElementById('loadBtn').addEventListener('click', loadProgram, false);

window.setRunning(false);

editor.getSession().on('change', function() {
    getCurrentProgram().notifyCodeUpdated();
});

$('a[data-toggle="tab"]').on('hide.bs.tab', function(e) {
    if (e.target.id === 'code-tab') {
        if (getCurrentProgram().isCodeUpdated()) {
            $('#switch-blockly-confirmation').modal('show');
            e.preventDefault();
        }
    }
});

function confirmSwitchTab() {
    getCurrentProgram().discardUpdates();
    $('#blockly-tab').tab('show');
    $('#switch-blockly-confirmation').modal('hide');
}

document.getElementById('confirmSwitchTabBtn').addEventListener('click', confirmSwitchTab, false);

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    if (e.target.id === 'code-tab') {
        const code = programBlocks.generateCode(false);
        editor.getSession().setValue(code);
        getCurrentProgram().discardUpdates();
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

var tutorial = new Tutorial(workspace, programBlocks);
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
    <TabPanel />
  </div>
  <ConfirmationDialog />
</div>
        );
    }
}

