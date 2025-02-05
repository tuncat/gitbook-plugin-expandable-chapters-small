require(['gitbook', 'jQuery'], function(gitbook, $) {
  var obj = {}
  var TOGGLE_CLASSNAME = 'expanded',
      CHAPTER = '.chapter',
      ARTICLES = '.articles',
      TRIGGER_TEMPLATE = '<i class="exc-trigger fa"></i>',
      LS_NAMESPACE = 'expChapters';
  var init = function () {
    // adding the trigger element to each ARTICLES parent and binding the event
    $(ARTICLES)
      .parent(CHAPTER)
      .children('a, span')
      .append(
        $(TRIGGER_TEMPLATE)
          .on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggle($(e.target).closest(CHAPTER));
          })
      );
    // hacky solution to make spans be clickable when used in combination with "ungrey" plugin
    $(CHAPTER + ' > span')
      .on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggle($(e.target).closest(CHAPTER));
        });
    expand(lsItem());
    //expand current selected chapter with it's parents
    var activeChapter = $(CHAPTER + '.active');
    expand(activeChapter);
    expand(activeChapter.parents(CHAPTER));


  } 
  var toggle = function ($chapter) {
    if ($chapter.hasClass('expanded')) {
      collapse($chapter);
    } else {
      expand($chapter);
    }
  }
  var collapse = function ($chapter) {
    if ($chapter.length && $chapter.hasClass(TOGGLE_CLASSNAME)) {
      $chapter.removeClass(TOGGLE_CLASSNAME);
      lsItem($chapter);
    }
  }
  var expand = function ($chapter) {
    if ($chapter.length && !$chapter.hasClass(TOGGLE_CLASSNAME)) {
      $chapter.addClass(TOGGLE_CLASSNAME);
      lsItem($chapter);
    }
  }
  function setCookie(cookieName,cookieValue,cookieDates){
    var d = new Date();
    d.setDate(d.getDate()+cookieDates);
    document.cookie = cookieName+"="+cookieValue+";expires="+d.toGMTString();
  }

  function getCookie(cookieName){
    var cookieStr = unescape(document.cookie);
    var arr = cookieStr.split("; ");
    var cookieValue = "";
    for(var i=0;i<arr.length;i++){
      var temp = arr[i].split("=");
      if(temp[0]==cookieName){
        cookieValue = temp[1];
        break;
      }
    }
    return cookieValue;
  }
  var lsItem = function () {
    var map = obj
    if (arguments.length) {
      var $chapters = arguments[0];
      $chapters.each(function (index, element) {
        var level = $(this).data('level');
        var value = $(this).hasClass(TOGGLE_CLASSNAME);
        map[level] = value;
      })
      obj = JSON.parse(JSON.stringify(map))
    } else {
      return $(CHAPTER).map(function(index, element){
        if (map[$(this).data('level')]) {
          return this;
        }
      })
    }
  }
  gitbook.events.bind('page.change', function() {
    init()
  }); 
});
