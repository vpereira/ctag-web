
var debug="#debug";

function blur_input_box(id, def) {
    $(id).click(function() {
        if(this.value == 'search')
            this.value = '';
    });

    $(id).blur(function() {
        if(this.value == '')
            this.value = 'search';
    });
}

function search() {
    var d1 = new Date();
    d1 = d1.getTime();

    // just start to search if the search term has more than 3 chars
    if ($("#q").val().length < 4) {
      return
    }

    $.getJSON('/token?token=' + $("#q").val(), function(ret) {
        var d2 = new Date();
        d2 = d2.getTime();
        var latency = "(" + (d2 - d1) + " ms)";
        var count = ret.results.length + " of " + ret.count + " ";

        $("div#results").html("");

        ul = $("<ul/>").attr({
            'id':'reslist',
            'data-role': 'listview',
            'class':"ui-listview",
        });

        ul.append($("<li/>").attr({
            'data-role':'list-divider',
            'class':'ui-li ui-li-divider ui-btn ui-bar-b ui-btn-up-undefined'
        }).html("Results " + count + latency));

        $.each(ret.results, function(i, item) {
            t = $("<h3/>").attr({
                'class':'ui-li-heading',
            }).html(item.name);

            k = $("<span/>").addClass('lbl')
                .html(item.kind);

	    path_items = item.path.split('/');
	    repository = path_items.shift();
	    item_new_path = path_items.join('/');
            // you have to change it to point to your server
            base_url="http://zoekt-xooo.com/print?r="+repository+"&f="+item_new_path+"#l"+item.line;
            f = $("<span/>").addClass('lbl green').addClass('mono')
                .html("<a href=" + base_url +">" + item.path + ":" + item.line + "</a>");

            meta = $("<div/>").attr({'class':'ui-li-desc'})
                .append(f)
                .append(k);

            $("<li/>").attr({
                'class':'ui-li ui-li-static ui-btn-up-c mono',
                'role':'option',
            }).append(t)
                .append(meta)
                .appendTo(ul);
        });
        $("div#results").append(ul);
    });
}

function instantify(id, fn) {
    var timeout;
    $(id).keyup(function() {
        //$(debug).html("Search query: " + this.value);
        if(timeout != undefined)
            clearTimeout(timeout);
        timeout = setTimeout(search, 100);
    });
}

function init() {
    //blur_input_box("input#q", 'search');
    instantify("input#q", '');
}
