import { createMachine, assign } from 'xstate';

const bookingMachine = createMachine({
  id: "buy plane tickets",
  initial: "initial",
  states: {
    initial: {
      on: {
        START: {
          target: "search",
          actions: 'showInit'
        }
      }
    },
    search: {
      entry: 'showEntry',
      exit: 'showOut',
      on: {
        CONTINUE: "passengers",
        CANCEL: "initial"
      }
    },
    passengers: {
      on: {
        DONE: 'tickets',
        CANCEL: 'initial'
      }
    },
    tickets: {
      on: {
        FINISH: "initial"
      }
    }
  }
}, {
  actions: {
    showInit: () => console.log('Show Init'),
    showEntry: () => console.log('Show Entry'),
    showOut: () => console.log('Show Out')
  }
});

export default bookingMachine;