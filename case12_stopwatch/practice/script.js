(function () {
  "use strict";

  const get = (target) => document.querySelector(target);

  class StopWatch {
    constructor(timer) {
      this.$timer = timer;
      this.intervalID = null;
      this.defaultTime = "00:00.00";
      this.startTime = 0;
      this.elapsedTime = 0;
    }

    addZero(number) {
      if (number < 10) {
        return "0" + number;
      }
      if (99 < number) {
        return number.toString().slice(0, -1);
      }
      return number;
    }

    timeToString(time) {
      const dateTime = new Date(time);

      const minutes = this.addZero(dateTime.getUTCMinutes());
      const seconds = this.addZero(dateTime.getUTCSeconds());
      const millsec = this.addZero(dateTime.getUTCMilliseconds());

      return `${minutes}:${seconds}.${millsec}`;
    }

    print(el) {
      this.$timer.textContent = el;
    }

    startTimer() {
      this.elapsedTime = Date.now() - this.startTime;
      const time = this.timeToString(this.elapsedTime);

      this.print(time);
    }

    start() {
      clearInterval(this.intervalID);

      this.startTime = Date.now(); // - this.elapsedTime;

      this.intervalID = setInterval(this.startTimer.bind(this), 10);
    }

    stop() {
      clearInterval(this.intervalID);
    }

    reset() {}
  }

  const $startButton = get(".timer-button.start");
  const $stopButton = get(".timer-button.stop");
  const stopWatch = new StopWatch(get(".timer"));

  $startButton.addEventListener("click", () => {
    stopWatch.start();
  });

  $stopButton.addEventListener("click", () => {
    stopWatch.stop();
  });
})();
