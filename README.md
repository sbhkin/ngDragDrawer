# ngDragDrawer
An ugly drawer using AngularJS

## Usage
JS
```
var app = angular.module('MODULE_NAME', ['ngDragDrawer', ...])
...

app.controller('YOUR_CONTROLLER', function (..., ngDragDrawer) {
...
```

HTML
```
<div
  ng-drag-drawer
  ng-collapse="needCollapse"
  on-drop="onEndDrag(event, isOpen)"
/>
```
##
