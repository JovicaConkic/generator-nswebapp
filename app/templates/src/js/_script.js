(function (<% if(jquery) {%>$, <%} %>window, document) {

  'use strict';
  var navButton = document.getElementById('navbar').getElementsByClassName('navbar-toggle')[0];
  var mobileMenu = document.getElementById('navbar').getElementsByClassName('collapse navbar-collapse')[0];

  var _navBarHandler = navButton.addEventListener('click', function(e) {
    e.preventDefault();
    mobileMenu.classList.toggle('in');
  });

})(<% if(jquery) {%>jQuery, <%} %>window, document);