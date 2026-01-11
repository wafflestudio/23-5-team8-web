import {setupWorker} from 'msw/browser';
import {handlers} from './handlers.tsx';

export const worker = setupWorker(...handlers);
