import { createWebRouter } from 'retend/router';
import { startRoute } from './start.routes';

export function createRouter() {
  return createWebRouter({ routes: [startRoute] });
}