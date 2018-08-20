'use strict';

import React from "react";

const lessons = require('json-loader!yaml-loader!../data/lessons.yaml');

export default class TutorialPanel extends React.Component {

    constructor(props) {
        super(props);
        this.getProgramBlocks = props.getProgramBlocks;
        this.state = {currentLesson: null, currentStep: null};
        this.lastBlocklyListener = null;
        this.lastButtonListener = null;
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

    setStepInHash(step) {
        window.location.href = window.location.origin + window.location.pathname +
            '#lesson/' + this.state.currentLesson + '/step/' + step;
    }

    loadStep(stepId) {
        console.log('Load step ' + stepId);
        this.removeListeners();
        this.setState({currentStep: stepId});
        var step = lessons[this.state.currentLesson].steps[stepId];
        if (!step.isCompleted) {
            var completesWhen = step['completes-when'];
            if (completesWhen) {
                eval(completesWhen);
            }
        }
    }

    completeStep() {
        this.playSound();
        var step = lessons[this.state.currentLesson].steps[this.state.currentStep];
        step.isCompleted = true;
        var nextStep = step['next-step'];
        if (nextStep) {
            this.setStepInHash(nextStep);
        }
    }

    removeListeners() {
        if (this.lastBlocklyListener) {
            const workspace = this.getProgramBlocks().workspace;
            workspace.removeChangeListener(this.lastBlocklyListener);
            this.lastBlocklyListener = null;
        }
        if (this.lastButtonListener) {
            const btn = document.getElementById(this.lastButtonListener[0]);
            btn.removeEventListener('click', this.lastButtonListener[1]);
            this.lastButtonListener = null;
        }
    }

    codeContains(snippet) {
        const tutorial = this;
        const programBlocks = tutorial.getProgramBlocks();
        const workspace = programBlocks.workspace;
        const currentStep = this.state.currentStep;
        function onCodeContainsSnippet(event) {
            if (tutorial.state.currentStep != currentStep) {
                workspace.removeChangeListener(onCodeContainsSnippet);
                return;
            }
            if (event.type == Blockly.Events.CREATE ||
                event.type == Blockly.Events.CHANGE) {
                const code = programBlocks.generateCode(false);
                if (code.indexOf(snippet) !== -1) {
                    workspace.removeChangeListener(onCodeContainsSnippet);
                    tutorial.completeStep();
                }
            }
        }
        this.removeListeners();
        workspace.addChangeListener(onCodeContainsSnippet);
        this.lastBlocklyListener = onCodeContainsSnippet;
    }

    buttonPressed(buttonId) {
        const tutorial = this;
        const button = document.getElementById(buttonId);
        const currentStep = this.state.currentStep;
        function onButtonClicked() {
            button.removeEventListener('click', onButtonClicked);
            if (tutorial.state.currentStep === currentStep) {
                tutorial.completeStep();
            }
        }
        this.removeListeners();
        button.addEventListener('click', onButtonClicked);
        this.lastButtonListener = [buttonId, onButtonClicked];
    }

    notifyHashChanged() {
        var re = /#lesson\/(\d+)\/step\/(\d+)/;
        var m = re.exec(window.location.hash);
        if (m) {
            var lesson = m[1];
            if (lesson !== this.state.currentLesson) {
                this.setState({currentLesson: lesson});
            }
            var step = m[2];
            this.loadStep(step);
        }
        else {
            this.setState({currentLesson: null, currentStep: null});
        }
    }

    playSound() {
        console.log('Play sound');
        var sound = document.getElementById("stepCompleteSound");
        sound.play();
    }

    render() {
        var Progress = [], Instructions = [];
        if (this.state.currentLesson) {
            const steps = lessons[this.state.currentLesson].steps;
            Progress = Object.keys(steps).map(k =>
                <a href={"#lesson/" + this.state.currentLesson + "/step/" + k} key={"progress-dot-" + k}>
                    <div class={"progress-dot" + (steps[k].isCompleted ? " step-completed" : (k == Number(this.state.currentStep) ? " current-step" : ""))}></div>
                </a>);
            if (this.state.currentStep) {
                Instructions = <div dangerouslySetInnerHTML={{ __html: steps[this.state.currentStep]["instructions"]}}></div>;
            }
        }
        else {
            Instructions = (
                <div>
                    <p>レッスンを選んでください:</p>
                    <ul>
                        {Object.keys(lessons).map(k => <li key={"lesson-" + k}><a href={"#lesson/" + k + "/step/1"}>{lessons[k].title}</a></li>)}
                    </ul>
                </div>);
        }
        return (
  <div id="titlePanel">
    <h1><a href="#">ペンギン ブロックリー</a></h1>
    <div id="tutorialProgress">{Progress}</div>
    <div id="instructionsPanel">{Instructions}</div>
    <audio id="stepCompleteSound" src="media/win.mp3" hidden="true" volume="100"></audio>
  </div>
        );
    }
}

