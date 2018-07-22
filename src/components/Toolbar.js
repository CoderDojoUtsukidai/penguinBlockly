'use strict';

import React from "react";

export default class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {saveFilename: 'penguin'};
        this.getCurrentProgram = props.getCurrentProgram;
    }

    onFilenameChanged(event) {
        this.setState({saveFilename: event.target.value});
    }

    runProgram() {
        this.getCurrentProgram().run();
    }

    debugProgram() {
        this.getCurrentProgram().debug();
    }

    stopProgram() {
        this.getCurrentProgram().stop();
    }

    saveProgram() {
        var link = document.getElementById('saveBtn');
        this.getCurrentProgram().save(this.state.saveFilename, link);
        $('#saveDropdownLink').dropdown('toggle');
    }

    loadProgram() {
        const fileSelector = document.getElementById('loadFilename');
        const filename = fileSelector.files[0];
        this.getCurrentProgram().load(filename);
        $('#loadDropdownLink').dropdown('toggle');
    }

    render() {
        return (
    <div class="toolbar">
      <button type="button" id="runBtn" onClick={this.runProgram.bind(this)} class="btn btn-success">実行（じっこう）</button>
      <button type="button" id="debugBtn" onClick={this.debugProgram.bind(this)} class="btn btn-secondary">ステップ実行</button>
      <button type="button" id="stopBtn" onClick={this.stopProgram.bind(this)} class="btn btn-danger">止める</button>
      <div class="dropdown" style={{display: 'inline-block'}}>
        <a class="btn btn-info dropdown-toggle" href="#" role="button" id="saveDropdownLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          保存
        </a>
        <div class="dropdown-menu" aria-labelledby="saveDropdownLink" style={{width: '400px'}}>
          <form class="px-4 py-3">
            <div class="form-group">
              <label for="saveFilename">ファイル名</label>
              <input type="input" class="form-control" id="saveFilename" value={this.state.saveFilename} onChange={this.onFilenameChanged.bind(this)} />
            </div>
            <a role="button" id="saveBtn" onClick={this.saveProgram.bind(this)} class="btn btn-info" href="#">保存</a>
          </form>
        </div>
      </div>
      <div class="dropdown" style={{display: 'inline-block'}}>
        <a class="btn btn-info dropdown-toggle" href="#" role="button" id="loadDropdownLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          読込
        </a>
        <div class="dropdown-menu" aria-labelledby="loadDropdownLink" style={{width: '400px'}}>
          <form class="px-4 py-3">
            <div class="form-group">
              <div class="input-group mb-3">
                <div class="custom-file">
                  <input type="file" class="custom-file-input" id="loadFilename" />
                  <label class="custom-file-label" for="loadFilename">ファイルを選ぶ</label>
                </div>
              </div>
            </div>
            <a role="button" id="loadBtn" onClick={this.loadProgram.bind(this)} class="btn btn-info" href="#">読込</a>
          </form>
        </div>
      </div>
    </div>
        );
    }
}

