'use strict';

const levels = require('json-loader!yaml-loader!./levels.yaml');

export default class Tutorial {

    constructor(workspace, programBlocks) {
        this.workspace = workspace;
        this.programBlocks = programBlocks;
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

    setLevelInHash(level) {
        window.location.href = window.location.origin + window.location.pathname + '#level/' + level;
    }

    loadLevel(level) {
        console.log('Load level ' + level);
        this.currentLevel = levels[level];
        document.getElementById('instructionsPanel').innerHTML = this.currentLevel['instructions'];
        var completesWhen = this.currentLevel['completes-when'];
        if (completesWhen) {
            console.log(completesWhen);
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
        function onCodeContainsSnippet(event) {
            if (event.type == Blockly.Events.CREATE ||
                event.type == Blockly.Events.CHANGE) {
                const code = tutorial.programBlocks.generateCode(false);
                if (code.indexOf(snippet) !== -1) {
                    tutorial.workspace.removeChangeListener(onCodeContainsSnippet);
                    tutorial.nextLevel();
                }
            }
        }
        this.workspace.addChangeListener(onCodeContainsSnippet);
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
};

