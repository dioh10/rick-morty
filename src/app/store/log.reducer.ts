import { createReducer, on } from '@ngrx/store';
import {saveEvent} from './log.actions';

export const initialLog: any = ['This is the beginning of the log...'];

export const logReducer = createReducer(
  initialLog,
  on(saveEvent, (state, data) => {
    state = [...state, data.event];
    console.log(state);
    return state;
    }));
    /*return [...state, {
      id: Math.random(),
      event: 'Event saved'
    }];*/
