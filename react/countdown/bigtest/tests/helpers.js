import { before, beforeEach } from '@bigtest/mocha';
import { setupAppForTesting } from '@bigtest/react';
import { freeze } from 'timekeeper';
import App from '../../src/app';

export { visit, location } from '@bigtest/react';

export function setupApplicationForTesting() {
  before(() => freeze(new Date([2018, 1, 1])));

  beforeEach(async function() {
    this.app = await setupAppForTesting(App, {
      mountId: 'root'
    });
  });
}
