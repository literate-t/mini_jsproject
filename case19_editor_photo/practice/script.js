(() => {
  "use strict";

  const get = (e) => {
    return document.querySelector(e);
  };

  class PhotoEditor {
    constructor() {
      this.container = get("main");
      this.canvas = get("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.width = 700;
      this.height = 411;
      this.minSize = 20;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx.lienWidth = 4;
      this.ctx.strokeStyle = "#ff0000";
      this.targetImage = get(".image-wrap");
      this.targetCanvas = document.createElement("canvas");
      this.targetCtx = this.targetCanvas.getContext("2d");
      this.targetWidth;
      this.targetHeight;
      this.sourceX;
      this.sourceY;
      this.sourceWidth;
      this.sourceHeight;
      this.img = new Image();
      this.btnFlip = get(".btn-flip");
      this.btnSepia = get(".btn-sepia");
      this.btnGray = get(".btn-gray");
      this.btnSave = get(".btn-save");
      this.fileDrag = get(".drag-area");
      this.fileInput = get(".drag-area input");
      this.fileImage = get(".file-image");
      this.clickEvent();
      this.fileEvent();
      this.drawEvent();
    }

    clickEvent() {}

    fileEvent() {
      this.fileInput.addEventListener("change", (e) => {
        const fileName = URL.createObjectURL(e.target.files[0]);
        this.fileImage.setAttribute("src", fileName);
        this.img.setAttribute("src", fileName);

        // img.addEventListener("load", (e) => {
        //   console.dir(e);
        //   this.width = e.path[0].naturalWidth;
        //   this.height = e.path[0].naturalHeight;
        // });
      });
    }

    sepiaEvent() {}

    grayEvent() {}

    downalod() {}

    drawEvent() {
      const canvasX = this.canvas.getBoundingClientRect().left;
      const canvasY = this.canvas.getBoundingClientRect().top;
      let sX, sY, eX, eY;
      let isDrawStart = false;

      this.canvas.addEventListener("mousedown", (e) => {
        // 0, 0 기준 좌표로 변환
        const clientX = e.clientX;
        sX = parseInt(e.clientX - canvasX, 10);
        sY = parseInt(e.clientY - canvasY, 10);
        isDrawStart = true;
      });

      this.canvas.addEventListener("mousemove", (e) => {
        if (!isDrawStart) {
          return;
        }
        eX = parseInt(e.clientX - canvasX, 10);
        eY = parseInt(e.clientY - canvasY, 10);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(sX, sY, eX - sX, eY - sY);
      });

      this.canvas.addEventListener("mouseup", () => {
        isDrawStart = false;

        if (
          Math.abs(eX - sX) < this.minSize ||
          Math.abs(eY - sY) < this.minSize
        ) {
          return;
        }

        this.drawOutput(sX, sY, eX - sX, eY - sY);
      });
    }

    drawOutput(x, y, width, height) {
      this.targetImage.innerHTML = "";
      if (Math.abs(width) <= Math.abs(height)) {
        this.targetHeight = this.height;
        this.targetWidth = (this.targetHeight / height) * width;
      } else {
        this.targetWidth = this.width;
        this.targetHeight = (this.targetWidth / width) * height;
      }

      this.targetCanvas.width = this.targetWidth;
      this.targetCanvas.height = this.targetHeight;

      this.img.addEventListener("load", () => {
        const buffer = this.img.width / this.width;
        this.sourceX = x * buffer;
        this.sourceY = y * buffer;
        const sourceX = this.sourceX;
        console.log({ x, sourceX });
        this.sourceWidth = width * buffer;
        this.sourceHeight = height * buffer;
        this.targetCtx.drawImage(
          this.img,
          x,
          y,
          width,
          height,
          0,
          0,
          this.targetWidth,
          this.targetHeight
        );
      });
      this.img.src = this.fileImage.getAttribute("src");
      this.targetImage.appendChild(this.targetCanvas);
    }
  }

  new PhotoEditor();
})();
