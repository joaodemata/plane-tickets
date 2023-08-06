import React from 'react';
import { Welcome } from '../components/welcome';
import { Search } from '../components/search';
import { Passengers } from '../components/passengers';
import { Tickets } from '../components/tickets';
import './steps_layout.css';

export const StepsLayout = ({ state, send }) => {
  const renderContent = () => {
    if(state.matches('initial')) return <Welcome send={send}/>;
    if(state.matches('search')) return <Search send={send}/>;
    if(state.matches('tickets')) return <Tickets send={send}/>;
    if(state.matches('passengers')) return <Passengers send={send}/>;
    return null;
  };

  return (
    <div className='StepsLayout'>
      {renderContent()}
    </div>
  );
}; 