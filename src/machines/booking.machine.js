import { createMachine, assign } from 'xstate';
import { fetchCountries } from '../utils/apis';

const INIT_CONTEXT = {
  passengers: [],
  selectedCountry: '',
  countries: [],
  error: ''
}

const CANCEL_EVENT = {
  CANCEL: {
    target: 'initial',
    actions: assign(
     { passengers: [], selectedCountry: ''}
    )
  }
}

// Maquina hija 
const fillCountries = {
  predictableActionArguments: true,
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        id: 'getCountries',
        src: () => fetchCountries,
        onDone: {
          target: 'success',
          actions: assign({
            countries: (context, event) => event.data
          })
        },
        onError: {
          targe: 'failure',
          actions: assign({
            error: 'Fallo el request'
          })
        }
      }
    },
    success: {},
    failure: {
      on: {
        RETRY: {target: 'loading'}
      }
    }
  }
}


const bookingMachine = createMachine({
  predictableActionArguments: true,
  id: "buy plane tickets",
  initial: "initial",
  context: INIT_CONTEXT,
  states: {
    initial: {
      on: {
        START: {
          target: "search",
          // actions: 'showInit'
        }
      }
    },
    search: {
      // entry: 'showEntry',
      // exit: 'showOut',
      on: {
        CONTINUE: {
          target: "passengers",
          actions: assign({
            selectedCountry: (context, event) => event.selectedCountry
          })
        },
        ...CANCEL_EVENT,
      },
      ...fillCountries,
    },
    passengers: {
      on: {
        DONE: {
          target: 'tickets',
          cond: "moreThanOnePassenger"
        },
        ADD: {
          target: 'passengers',
          actions: assign(
             (context, event) => context.passengers.push(event.newPassenger)
          )
        },
        ...CANCEL_EVENT
      }
    },
    tickets: {
      after: {
        5000: {
          target: 'initial',
          actions:  assign(
            { passengers: [], selectedCountry: ''}
           )
        }
      },
      on: {
        FINISH: {
          target: "initial",
          actions: assign(
            { passengers: [], selectedCountry: ''}
           )
        }
      }
    }
  }
}, {
  actions: {
    // showInit: () => console.log('Show Init'),
    // showEntry: () => console.log('Show Entry'),
    // showOut: () => console.log('Show Out')
  },
  guards: {
    moreThanOnePassenger: (context)=> {
      return context.passengers.length > 0;
    }
  }
});

export default bookingMachine;