---
---

headers = ("h#{i}" for i in [1..6]).join ","
$ ->
  $('a[name]').each ->
    $(@).parent().next().filter(headers).append $('<a />').attr('href', '#' + @name).css(textDecoration: 'none', fontSize: '0.8em', marginLeft: '1em').text '¶'
