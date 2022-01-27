class StateMachine {
  state = 'running';

  constructor(input, run, stop, wait) {
    this.input = input;
    this.run = run;
    this.stop = stop;
    this.wait = wait;
  }

  stopped(newTitle) {
    this.run(newTitle).then(() => {
      this.state = 'running';
    });
  }

  running(newTitle = false) {
    this.state = 'stopping';
    this.stop(this.input).then(() => {
      this.stopping(newTitle);
    });
  }

  stopping(newTitle) {
    this.wait(this.input)
      .then((data) => {
        if (data === 'TIME_OUT') {
          throw new Error('Превышен интервал ожидания остановки!');
        }
        if (!newTitle) {
          this.state = 'stopped';
        } else {
          this.state = 'running';
          this.run(newTitle);
        }
      })
      .catch((error) => {
        alert(error);
        this.state = 'running';
      });
  }
}

const state = (inputCount, ...funcs) => {
  const result = {};
  for (let i = 1; i <= inputCount; i++) {
    result[i] = new StateMachine(i, ...funcs);
  }
  return result;
};

export default state;
