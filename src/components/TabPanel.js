'use strict';

import React from "react";

export default class TabPanel extends React.Component {
    render() {
        return (
  <div>
    <div id="tabNavigation" class="nav nav-tabs" role="tablist">
      <a class="nav-item nav-link active" id="blockly-tab" data-toggle="tab" href="#blockly" role="tab" aria-controls="blockly" aria-selected="true">ブロック</a>
      <a class="nav-item nav-link" id="code-tab" data-toggle="tab" href="#code" role="tab" aria-controls="code" aria-selected="false">コード</a>
    </div>
    <div class="tab-content" id="tabNavContent">
      <div id="blockly" class="tab-pane fade show active" role="tabpanel" aria-labelledby="blockly-tab">
        <div id="blocklyPanel" class="fit-parent"></div>
      </div>
      <div id="code" class="tab-pane fade" role="tabpanel" aria-labelledby="code-tab">
        <div id="codePanel" class="fit-parent">
          <div id="jsCode" class="fit-parent"></div>
        </div>
      </div>
    </div>
  </div>
        );
    }
}

