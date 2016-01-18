import angular from 'angular';
import picker from './directives/picker';
import highlight from './filters/highlight';
import './stylesheet/picker.style.css';

export default angular
  .module('angularPicker', [])
  .directive('picker', picker)
  .filter('highlight', highlight)
  .name;
