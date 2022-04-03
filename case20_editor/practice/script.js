(function () {
  "use strict";

  const commands = [
    {
      cmd: "backColor",
      value: "blue",
      label: "배경 컬러",
    },
    {
      cmd: "bold",
      label: "굵기",
    },
    {
      cmd: "justifyCenter",
      label: "가운데 정렬",
    },
    {
      cmd: "justifyFull",
      label: "양쪽 정렬",
    },
    {
      cmd: "justifyLeft",
      label: "왼쪽 정렬",
    },
    {
      cmd: "justifyRight",
      label: "오른쪽 정렬",
    },
    {
      cmd: "underline",
      label: "밑줄",
    },
  ];

  const get = (target) => {
    return document.querySelector(target);
  };

  const createElement = (nodeName) => {
    return document.createElement(nodeName);
  };

  const $editorButtons = get(".editor-buttons");

  const $showEditorButton = get(".show-editor-button");
  const $showHTMLButton = get(".show-html-button");
  const $editorEdit = get(".editor.edit");
  const $editorHTML = get(".editor.html");

  const commandObject = {};

  const doCommand = (cmdKey) => {
    const command = commandObject[cmdKey];
    const value = command.value
      ? prompt("값을 입력해주세요", command.value)
      : null;
    document.execCommand(command.cmd, false, value);
  };
  const init = () => {
    commands.map((command) => {
      commandObject[command.cmd] = command;
      const buttonElement = createElement("button");
      buttonElement.textContent = command.label;
      buttonElement.addEventListener("click", (e) => {
        e.preventDefault();
        doCommand(command.cmd);
      });
      $editorButtons.append(buttonElement);
    });
  };

  const onClickShowEditorButton = (e) => {
    $editorEdit.innerHTML = $editorHTML.textContent;
    $editorEdit.classList.toggle("show");
    $editorHTML.classList.toggle("show");
  };

  const onClickShowHTMLButton = (e) => {
    $editorHTML.textContent = $editorEdit.innerHTML;
    $editorEdit.classList.toggle("show");
    $editorHTML.classList.toggle("show");
  };

  $showEditorButton.addEventListener("click", onClickShowEditorButton);
  $showHTMLButton.addEventListener("click", onClickShowHTMLButton);

  init();
})();
