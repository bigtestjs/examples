import { interactor, clickable, value } from '@bigtest/interactor';

export default @interactor class SpinnerInteractor {
  // common helpers provide easy to define interactions
  prev = clickable('[data-test-spinner-option="prev"]');
  next = clickable('[data-test-spinner-option="next"]');
  value = value('input');

  // complex interactions can be expressed as methods
  select(option) {
    let self = this;

    // for each letter in `option`, send a keypress event
    // that will trigger the spinner's typeahead feature
    for (let key of option) {
      self = self.trigger('keypress', {
        charCode: key.charCodeAt()
      });
    }

    // methods that return a new instance of itself are chainable
    return self;
  }
}
