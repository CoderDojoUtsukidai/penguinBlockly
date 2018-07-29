'use strict';

import React from "react";

import Program from './Program';
import '../blocks/penguin_blocks';
import '../blocks/penguin_javascript';
import '../blocks/webapi_blocks';
import '../blocks/webapi_javascript';
import createInterpreter from '../interpreter';

const toolbox = require('../blocks/toolbox.xml');

export default class ProgramBlocks extends Program {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.workspace = Blockly.inject(
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
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    generateCode(highlightBlocks = false) {
        if (highlightBlocks) {
            Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
        }
        else {
            Blockly.JavaScript.STATEMENT_PREFIX = '';
        }
        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        if (highlightBlocks) {
            code += "highlightBlock(null);\n";
        }
        console.log(code);
        return code;
    }

    run() {
        window.setRunning(true);
        const code = this.annotateCodeForStopping(this.generateCode(false));
        eval(code);
    }

    debug() {
        window.setRunning(true);
        const code = this.generateCode(true);
        const jsInterpreter = createInterpreter(code, this.workspace, null);
        const workspace = this.workspace;
        var runOnce = function() {
            if (jsInterpreter.run() && !window.mustStop()) {
                setTimeout(runOnce, 1000);
            }
            else {
                if (window.mustStop()) {
                    workspace.highlightBlock(null);
                }
                window.setRunning(false);
            }
        };
        runOnce();
    }

    save(filename, link) {
        const xml = Blockly.Xml.workspaceToDom(this.workspace);
        const xml_text = Blockly.Xml.domToText(xml);
        link.download = filename;
        link.href = 'data:text/xml;charset=utf-8,' +
            encodeURIComponent(xml_text);
    }

    load(filename) {
        var reader = new FileReader();
        reader.readAsText(filename);
        const workspace = this.workspace;
        reader.onload = function(ev) {
            const xml = Blockly.Xml.textToDom(reader.result);
            Blockly.Xml.domToWorkspace(xml, workspace);
        }
    }

    render() {
        return (
        <div id="blocklyPanel" class="fit-parent"></div>
        );
    }
};

