'use strict';

import React from "react";

export default class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {saveFilename: 'penguin'};
    }

    onFilenameChanged(event) {
        this.setState({saveFilename: event.target.value});
    }

    render() {
        return (
    <div class="toolbar">
      <button type="button" id="runBtn" class="btn btn-success">実行（じっこう）</button>
      <button type="button" id="debugBtn" class="btn btn-secondary">ステップ実行</button>
      <button type="button" id="stopBtn" class="btn btn-danger">止める</button>
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
            <a role="button" id="saveBtn" class="btn btn-info" href="#">保存</a>
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
            <a role="button" id="loadBtn" class="btn btn-info" href="#">読込</a>
          </form>
        </div>
      </div>
    </div>
        );
    }
}

