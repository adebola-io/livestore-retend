import { defineRoute } from 'retend/router';
import Start from './start';

export const startRoute = defineRoute({
  name: 'Start View',
  path: '/',
  component: Start,
});