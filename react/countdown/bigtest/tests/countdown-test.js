import { describe, beforeEach, it } from '@bigtest/mocha';
import { travel } from 'timekeeper';
import { expect } from 'chai';

import { setupApplicationForTesting, visit, location } from './helpers';
import CountdownInteractor from '../interactors/countdown';

describe('Countdown', () => {
  const countdown = new CountdownInteractor();

  setupApplicationForTesting();

  describe('with a date in the future', () => {
    beforeEach(() => visit('/2019/1/2'));

    it('displays the difference of time', () => {
      expect(countdown.years).to.equal('1');
    });

    it('displays "until" and the target date', () => {
      expect(countdown.direction).to.equal('Until');
      expect(countdown.target).to.equal('January 2, 2019');
    });
  });

  describe('with a date in the past', () => {
    beforeEach(() => {
      travel(new Date([2018, 1, 2]));
      visit('/2017/1/1');
    });

    it('displays the difference of time', () => {
      expect(countdown.years).to.equal('1');
    });

    it('displays "since" and the target date', () => {
      expect(countdown.direction).to.equal('Since');
      expect(countdown.target).to.equal('January 1, 2017');
    });
  });
});
