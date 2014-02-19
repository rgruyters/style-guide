(function() {
  var html, testvw;

  html = document.getElementsByTagName("html")[0];

  testvw = document.createElement('div');

  document.body.appendChild(testvw);

  testvw.style.width = "100vw";

  if (testvw.offsetWidth === window.innerWidth) {
    html.className += " js-viewport";
  } else {
    html.className += " js-no_viewport";
  }

  testvw.remove();

}).call(this);
