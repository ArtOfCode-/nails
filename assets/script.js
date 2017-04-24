(function() {
  var headers, i;

  headers = ((function() {
    var j, results;
    results = [];
    for (i = j = 1; j <= 6; i = ++j) {
      results.push("h" + i);
    }
    return results;
  })()).join(",");

  $(function() {
    return $('a[name]').each(function() {
      return $(this).parent().next().filter(headers).append($('<a />').attr('href', '#' + this.name).css({
        textDecoration: 'none',
        fontSize: '0.8em',
        marginLeft: '1em'
      }).text('¶'));
    });
  });

}).call(this);
