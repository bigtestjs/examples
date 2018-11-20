import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { setupApplicationForTesting, location } from './helpers';
import DateFormInteractor from '../interactors/form';

describe('Date Picker', () => {
  const form = new DateFormInteractor();
  setupApplicationForTesting();

  it('has fields for year, month, day, hour, and minute', () => {
    expect(form.year.isPresent).to.be.true;
    expect(form.month.isPresent).to.be.true;
    expect(form.day.isPresent).to.be.true;
    expect(form.hour.isPresent).to.be.true;
    expect(form.minute.isPresent).to.be.true;
  });

  it('defaults to today\'s date', () => {
    expect(form.value).to.equal('2018/1/1 @ 00:00');
  });

  it('has a submit button', () => {
    expect(form.submit.isPresent).to.be.true;
  });

  describe('selecting a date in the future', () => {
    beforeEach(async () => {
      await form.year.next().snapshot('Get countdown button');
    });

    it('displays a "get countdown" submit button', () => {
      expect(form.submit.text).to.equal('Get Countdown');
    });
  });

  describe('selecting a date in the past', () => {
    beforeEach(async () => {
      await form.year.prev().snapshot('Get Elapsed button');
    });

    it('displays a "get elapsed" submit button', () => {
      expect(form.submit.text).to.equal('Get Elapsed');
    });
  });

  describe('submitting a date', () => {
    beforeEach(async () => {
      await form.submit.click();
    });

    it('goes to the date countdown', () => {
      expect(location().pathname).to.equal('/2018/01/01');
    });
  });

  describe('submitting a date and time', () => {
    beforeEach(async () => {
      await form
        .year.select('2019')
        .hour.select('12')
        .minute.select('30')
        .submit.click();
    });


    it('includes the time in the URL', () => {
      expect(location().pathname).to.equal('/2019/01/01/12:30');
    });
  });
});
