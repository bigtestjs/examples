import { interactor, text } from '@bigtest/interactor';

export default @interactor class CountdownInteractor {
  static defaultScope = '[data-test-countdown]';
  years = text('[data-test-countdown-unit="years"]');
  months = text('[data-test-countdown-unit="months"]');
  days = text('[data-test-countdown-unit="days"]');
  hours = text('[data-test-countdown-unit="hours"]');
  minutes = text('[data-test-countdown-unit="minutes"]');
  seconds = text('[data-test-countdown-unit="seconds"]');
  milliseconds = text('[data-test-countdown-unit="milliseconds"]');
  direction = text('[data-test-countdown-direction]');
  target = text('[data-test-countdown-target]');
}
