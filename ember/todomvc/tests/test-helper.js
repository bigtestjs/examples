import loadEmberExam from "ember-exam/test-support/load";
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

loadEmberExam();
setResolver(resolver);
