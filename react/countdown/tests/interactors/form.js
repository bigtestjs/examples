import { interactor, scoped } from '@bigtest/interactor';
import SpinnerInteractor from './spinner';

export default @interactor class DateFormInteractor {
  static defaultScope = '[data-test-date-form]';

  year = scoped('[data-test-year-field]', SpinnerInteractor);
  month = scoped('[data-test-month-field]', SpinnerInteractor);
  day = scoped('[data-test-day-field]', SpinnerInteractor);
  hour = scoped('[data-test-hour-field]', SpinnerInteractor);
  minute = scoped('[data-test-minute-field]', SpinnerInteractor);
  submit = scoped('button[type="submit"]');

  get value() {
    let date = `${this.year.value}/${parseInt(this.month.value, 10) + 1}/${this.day.value}`;
    let time = `${this.hour.value.padStart(2, '0')}:${this.minute.value.padStart(2, '0')}`;
    return `${date} @ ${time}`;
  }
}
