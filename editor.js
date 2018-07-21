'use strict';

// Initialize ACE Javascript editor
var editor = ace.edit("jsCode");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    fontSize: "12pt"
});

export default editor;

