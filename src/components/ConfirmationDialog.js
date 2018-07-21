'use strict';

import React from "react";

export default class ConfirmationDialog extends React.Component {
    render() {
        return (
  <div id="switch-blockly-confirmation" class="modal" tabIndex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">本当にブロックへ行くのですか？</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>コードが変わりました。</p>
          <p>ブロックへ行くと、コードの修正が失われます。</p>
          <p>本当にブロックへ行くのですか？</p>
        </div>
        <div class="modal-footer">
          <button id="noSwitchTabBtn" type="button" class="btn btn-secondary" data-dismiss="modal">ここに残る</button>
          <button id="confirmSwitchTabBtn" type="button" class="btn btn-danger">コードの修正を捨ててブロックへ行く</button>
        </div>
      </div>
    </div>
  </div>
        );
    }
}

