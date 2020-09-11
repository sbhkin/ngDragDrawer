//*******
//
//Created by Ethan Tam
//
//********

(function(window, angular,undefined) {
   'user strict';

   var module = angular.module('ngDragDrawer', []);

   var $el = angular.element;
   var isDef = angular.isDefined;
   var style = (document.body || document.documentElement).style;
   var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
   var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';

   module.provider('ngDragDrawer', function() {
     var defaults = this.defaults = {
       style : {
         draggables : {
           onDragging : {},
           onStart : {}
         },
         droppables :  {
           onEnter : {},
           onLeave : {}
         }
       }
     };

     this.setDefaults = function(newDefaults) {
       angular.extend(defaults, newDefaults);
     };

     this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller',
      function($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller){
        var privateMethods = {
          endDrag: function(){

          },
          bindDragEvents: function(scope, elem, dragElem, listeners) {
           var self = this;
           var defaults = publicMethods.getDefaults();
           // mouse pos
           var mousey = 0;
           var elemh = 0;
           var disy = 0 ;

           var onDragStart = function(event) {
             mousey = event.touches[0].clientY;
             disy = 0 ;
             elem.style.animation = " "
             self.currentDragElement = angular.element(event.target);
             elemh = parseInt(elem.style.height);

             // angular.element(event.target).css(defaults.styles.draggables.onStart);
           }

           var onDrag = function (event){
             disy = mousey - event.touches[0].clientY;
              console.log( elemh + disy);
             // angular.element(event.target).css(defaults.styles.draggables.onDragging);
              elem.style.height = elemh + disy + "px";

             listeners.onDrag({
               event : event
             });

             return true ;
           }

           var onDragEnd = function (event) {
             if(disy > 0){
              if(elemh == 30){
                elem.style.height= "320px";
              }else{
                elem.style.height = angular.element($window).height()+"px";
                 // elem.style.animation = "drawer-expand 0.3s ease-out"
               listeners.onDrop({
                event : event,
                isOpen : true
              });
              }


             }
             if(disy < 0){
               // if(elemh == 320){
               //  elem.style.height= "30px"
               // }else{
                elem.style.height = "320px";
               // }
               // elem.style.animation = "drawer-collapse 0.3s ease-out";
               listeners.onDrop({
                 event : event,
                 isOpen : false
               });
             }
             // self.endDrag();

           };
           var tabbar = angular.element(elem.querySelectorAll("md-tabs-wrapper"));
           tabbar[0].addEventListener('touchstart', onDragStart);
           tabbar[0].addEventListener('touchmove', onDrag);
           tabbar[0].addEventListener('touchend', onDragEnd);

           for(var i= 0; i< dragElem.length ; i++){
             console.log(dragElem);
             dragElem[i].addEventListener('touchstart', onDragStart);
             dragElem[i].addEventListener('touchmove', onDrag);
             dragElem[i].addEventListener('touchend', onDragEnd);
           }


         },
         setDraggable: function(scope, elem, listeners) {
           var dragItems = angular.element(elem.querySelectorAll("[dragIt='true']"));
           dragItems.attr("draggable", true);
           this.bindDragEvents(scope, elem, dragItems, listeners);
           return dragItems;
         },
         collapse: function(scope, elem, listeners){
           elem.style.height = "320px"
           elem.style.animation = "drawer-collapse 0.3s ease-out"
           // listeners.onDrop({
           //   event : event,
           //   isOpen : false
           // });
         }

       };

       var publicMethods = {
         collapse : function(){
           var options = this.getDefaults();
           privateMethods.collapse(options.scope, options.elem[0], options.listeners);
         },
         setup : function(opts) {
           angular.extend(defaults, opts);
           var options = this.getDefaults();
           privateMethods.setDraggable(options.scope, options.elem[0], options.listeners);
         },
         getDefaults: function() {
           return defaults;
         },
       };
       return publicMethods;
     }];
   }); //module.provider(...)

   module.directive('ngDragDrawer',['ngDragDrawer','$parse', function (ngDragDrawer,$parse){
     return {
       restrict: 'A',
       multiElement: true,
       scope: {
         onDrag: '&',
         onDrop: '&',
       },
       link: function(scope, elem, attrs) {
         var ngDragDrawerScope = angular.isDefined(scope.ngDragDrawerScope) ? scope.ngDragDrawerScope : 'noScope';
         var defaults = ngDragDrawer.getDefaults();

         scope.$watch(attrs.ngCollapse, function(val){
           console.log('COLLAPSE:'+val);
            ngDragDrawer.collapse();
         });


         ngDragDrawer.setup({
           elem: elem,
           attrs: attrs,
           scope: scope,
           listeners: {
             onDrag : scope.onDrag || function () {},
             onDrop : scope.onDrop || function () {}
           },
           // styles : JSON.parse(attrs.styles) || defaults.styles
         });
       }
     };
   }]);
})(window, window.angular);
