import {createAction} from '@ngrx/store';

export const saveEvent = createAction('[Log Component] SaveEvent', (event: any) => ({event}));

