'use strict';

import React from "react";

const levels = require('json-loader!yaml-loader!../data/levels.yaml');

export default class TutorialPanel extends React.Component {

    constructor(props) {
        super(props);
        this.getProgramBlocks = props.getProgramBlocks;
        this.currentLevel = null;
        const tutorial = this;
        window.addEventListener('hashchange', function() {
            tutorial.notifyHashChanged();
        });
        window.codeContains = function(snippet) {
            tutorial.codeContains(snippet);
        };
        window.buttonPressed = function(buttonId) {
            tutorial.buttonPressed(buttonId);
        };
    }

    componentDidMount() {
        setTimeout(this.notifyHashChanged.bind(this), 1);
    }

    setLevelInHash(level) {
        window.location.href = window.location.origin + window.location.pathname + '#level/' + level;
    }

    loadLevel(level) {
        console.log('Load level ' + level);
        this.currentLevel = levels[level];
        document.getElementById('instructionsPanel').innerHTML = this.currentLevel['instructions'];
        var completesWhen = this.currentLevel['completes-when'];
        if (completesWhen) {
            eval(completesWhen);
        }
    }

    nextLevel() {
        var nextLevel = this.currentLevel['next-level'];
        if (nextLevel) {
            this.setLevelInHash(nextLevel);
        }
    }

    codeContains(snippet) {
        const tutorial = this;
        const programBlocks = tutorial.getProgramBlocks();
        const workspace = programBlocks.workspace;
        function onCodeContainsSnippet(event) {
            if (event.type == Blockly.Events.CREATE ||
                event.type == Blockly.Events.CHANGE) {
                const code = programBlocks.generateCode(false);
                if (code.indexOf(snippet) !== -1) {
                    workspace.removeChangeListener(onCodeContainsSnippet);
                    tutorial.nextLevel();
                }
            }
        }
        workspace.addChangeListener(onCodeContainsSnippet);
    }

    buttonPressed(buttonId) {
        const tutorial = this;
        const button = document.getElementById(buttonId);
        function onButtonClicked() {
            tutorial.nextLevel();
            button.removeEventListener('click', onButtonClicked);
        }
        button.addEventListener('click', onButtonClicked);
    }

    notifyHashChanged() {
        var re = /#level\/(\d+)/;
        var level = re.exec(window.location.hash);
        if (level && level[1]) {
            this.loadLevel(level[1]);
        }
        else {
            this.setLevelInHash('1');
        }
    }

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

