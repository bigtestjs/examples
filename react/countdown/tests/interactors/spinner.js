import { interactor, clickable, value } from '@bigtest/interactor';
import css from '../../src/fields/spinner/spinner.css';

export default @interactor class SpinnerInteractor {
  prev = clickable(`.${css['spinner-option--prev']}`);
  next = clickable(`.${css['spinner-option--next']}`);
  value = value('input');

  select(option) {
    let self = this;

    for (let key of option) {
      self = self.trigger('keypress', {
        charCode: key.charCodeAt()
      });
    }

    return self;
  }
}
