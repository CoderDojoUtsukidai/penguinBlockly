'use strict';

import React from "react";

const levels = require('json-loader!yaml-loader!../data/levels.yaml');

export default class TutorialPanel extends React.Component {

    constructor(props) {
        super(props);
        this.getProgramBlocks = props.getProgramBlocks;
        this.state = {currentLevel: -1};
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
        this.setState({currentLevel: level});
        document.getElementById('instructionsPanel').innerHTML = levels[level]['instructions'];
        var completesWhen = levels[level]['completes-when'];
        if (completesWhen) {
            eval(completesWhen);
        }
    }

    nextLevel() {
        this.playSound();
        var nextLevel = levels[this.state.currentLevel]['next-level'];
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

    playSound() {
        console.log('Play sound');
        var son = document.getElementById("levelCompleteSound");
        son.play();
    }

    render() {
        const Dots = Object.keys(levels).map(l => <div key={"progress-dot-" + l} class={"progress-dot" + (l < this.state.currentLevel ? " level-completed" : (l == this.state.currentLevel ? " current-level" : ""))}></div>);
        return (
  <div id="titlePanel">
    <h1><a href="/">ペンギン ブロックリー</a></h1>
    <div id="tutorialProgress">{Dots}</div>
    <div id="instructionsPanel"></div>
    <audio id="levelCompleteSound" src="media/win.mp3" hidden="true" volume="100"></audio>
  </div>
        );
    }
}

