import angular from 'angular';
import 'angular-mocks';
import picker from './module';

beforeEach(angular.mock.module(picker)); //eslint-disable-line no-undef

const testsContext = require.context('./', true, /\.spec/); //eslint-disable-line no-undef
testsContext.keys().forEach(testsContext);
