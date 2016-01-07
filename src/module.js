import angular from 'angular';
import picker from './directives/picker';
import './stylesheet/picker.style.css';

export default angular
  .module('angularPicker', [])
  .directive('picker', picker)
  .name;
