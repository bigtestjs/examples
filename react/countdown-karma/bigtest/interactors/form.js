import { interactor, scoped } from '@bigtest/interactor';
import SpinnerInteractor from './spinner';

export default @interactor class DateFormInteractor {
  // the default scope allows us to omit the selector when calling `new`
  static defaultScope = '[data-test-date-form]';

  // interactors are composable and nested methods return an instance
  // of the top-most interactor for chaining
  year = scoped('[data-test-year-field]', SpinnerInteractor);
  month = scoped('[data-test-month-field]', SpinnerInteractor);
  day = scoped('[data-test-day-field]', SpinnerInteractor);
  hour = scoped('[data-test-hour-field]', SpinnerInteractor);
  minute = scoped('[data-test-minute-field]', SpinnerInteractor);
  submit = scoped('button[type="submit"]');

  // getters can also be used for computed properties
  get value() {
    let year = this.year.value;
    let month = parseInt(this.month.value, 10) + 1;
    let day = this.day.value;
    let hour = this.hour.value.padStart(2, '0');
    let minute = this.minute.value.padStart(2, '0');

    return `${year}/${month}/${day} @ ${hour}:${minute}`;
  }
}
