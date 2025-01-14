var DataPivot = function(data, settings, dom_bindings, title){
  this.data = data;
  this.settings = settings || DataPivot.default_plot_settings();
  if(dom_bindings.update) this.build_edit_settings(dom_bindings);
  this.title = title;
};
_.extend(DataPivot, {
  NULL_CASE: "---",
  get_object: function(pk, callback){
    $.get('/summary/api/data_pivot/{0}/'.printf(pk), function(d){
      d3.tsv(d.data_url)
        .row(function(d, i){ return DataPivot.massage_row(d, i); })
        .get(function(error, data){
          var dp = new DataPivot(data,
              d.settings,
              {},
              d.title);
          if(callback){callback(dp);} else {return dp;}
        });
    });
  },
  displayAsModal: function(id){
    DataPivot.get_object(id, function(d){d.displayAsModal();});
  },
  default_plot_settings: function(){
    return {
      "plot_settings": {
        "plot_width": 400,
        "minimum_row_height": 12,
        "padding": {
          "top": 25,
          "right": 25,
          "bottom": 40,
          "left": 20
        },
        "title": "Title",
        "axis_label": "Axis label",
        "logscale": false,
        "show_xticks": true,
        "show_yticks": true,
        "title_top": undefined,
        "title_left": undefined,
        "xlabel_top": undefined,
        "xlabel_left": undefined,
        "domain": "",
        "filter_logic": "and",
        "font_style": 'Arial',
        "merge_descriptions": false,
        "text_background": true,
        "text_background_color": "#EEEEEE"
      },
      "legend": DataPivotLegend.default_settings(),
      "dataline_settings": [],
      "datapoint_settings": [],
      "description_settings": [],
      "spacers": [],
      "sorts": [],
      "filters": [],
      "reference_lines": [],
      "reference_rectangles": [],
      "labels": [],
      "row_overrides": [],
      "styles": {
        "symbols": [
          StyleSymbol.default_settings(),
          {"name": "transparent",             "type": "circle",         "size": 90, "stroke": "#000000", "fill-opacity": 0,   "stroke-width": 0, "fill": "#000000"},
          {"name": "circle | black",          "type": "circle",         "size": 90, "stroke": "#000000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#000000"},
          {"name": "circle | red",            "type": "circle",         "size": 90, "stroke": "#6f0000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#e32727"},
          {"name": "circle | green",          "type": "circle",         "size": 90, "stroke": "#006a1e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#22ba53"},
          {"name": "circle | blue",           "type": "circle",         "size": 90, "stroke": "#006dbe", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#3aa4e5"},
          {"name": "circle | orange",         "type": "circle",         "size": 90, "stroke": "#dc8f00", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#ffb100"},
          {"name": "circle | purple",         "type": "circle",         "size": 90, "stroke": "#5e5e5e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#b82cff"},
          {"name": "circle | fuschia",        "type": "circle",         "size": 90, "stroke": "#ab006c", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#d4266e"},
          {"name": "triangle up | black",     "type": "triangle-up",    "size": 90, "stroke": "#000000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#000000"},
          {"name": "triangle up | red",       "type": "triangle-up",    "size": 90, "stroke": "#6f0000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#e32727"},
          {"name": "triangle up | green",     "type": "triangle-up",    "size": 90, "stroke": "#006a1e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#22ba53"},
          {"name": "triangle up | blue",      "type": "triangle-up",    "size": 90, "stroke": "#006dbe", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#3aa4e5"},
          {"name": "triangle up | orange",    "type": "triangle-up",    "size": 90, "stroke": "#dc8f00", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#ffb100"},
          {"name": "triangle up | purple",    "type": "triangle-up",    "size": 90, "stroke": "#5e5e5e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#b82cff"},
          {"name": "triangle up | fuschia",   "type": "triangle-up",    "size": 90, "stroke": "#ab006c", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#d4266e"},
          {"name": "triangle down | black",   "type": "triangle-down",  "size": 90, "stroke": "#000000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#000000"},
          {"name": "triangle down | red",     "type": "triangle-down",  "size": 90, "stroke": "#6f0000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#e32727"},
          {"name": "triangle down | green",   "type": "triangle-down",  "size": 90, "stroke": "#006a1e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#22ba53"},
          {"name": "triangle down | blue",    "type": "triangle-down",  "size": 90, "stroke": "#006dbe", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#3aa4e5"},
          {"name": "triangle down | orange",  "type": "triangle-down",  "size": 90, "stroke": "#dc8f00", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#ffb100"},
          {"name": "triangle down | purple",  "type": "triangle-down",  "size": 90, "stroke": "#5e5e5e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#b82cff"},
          {"name": "triangle down | fuschia", "type": "triangle-down",  "size": 90, "stroke": "#ab006c", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#d4266e"},
          {"name": "diamond | black",         "type": "diamond",        "size": 90, "stroke": "#000000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#000000"},
          {"name": "diamond | red",           "type": "diamond",        "size": 90, "stroke": "#6f0000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#e32727"},
          {"name": "diamond | green",         "type": "diamond",        "size": 90, "stroke": "#006a1e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#22ba53"},
          {"name": "diamond | blue",          "type": "diamond",        "size": 90, "stroke": "#006dbe", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#3aa4e5"},
          {"name": "diamond | orange",        "type": "diamond",        "size": 90, "stroke": "#dc8f00", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#ffb100"},
          {"name": "diamond | purple",        "type": "diamond",        "size": 90, "stroke": "#5e5e5e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#b82cff"},
          {"name": "diamond | fuschia",       "type": "diamond",        "size": 90, "stroke": "#ab006c", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#d4266e"},
          {"name": "square | black",          "type": "square",         "size": 90, "stroke": "#000000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#000000"},
          {"name": "square | red",            "type": "square",         "size": 90, "stroke": "#6f0000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#e32727"},
          {"name": "square | green",          "type": "square",         "size": 90, "stroke": "#006a1e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#22ba53"},
          {"name": "square | blue",           "type": "square",         "size": 90, "stroke": "#006dbe", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#3aa4e5"},
          {"name": "square | orange",         "type": "square",         "size": 90, "stroke": "#dc8f00", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#ffb100"},
          {"name": "square | purple",         "type": "square",         "size": 90, "stroke": "#5e5e5e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#b82cff"},
          {"name": "square | fuschia",        "type": "square",         "size": 90, "stroke": "#ab006c", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#d4266e"},
          {"name": "cross | black",           "type": "cross",          "size": 90, "stroke": "#000000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#000000"},
          {"name": "cross | red",             "type": "cross",          "size": 90, "stroke": "#6f0000", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#e32727"},
          {"name": "cross | green",           "type": "cross",          "size": 90, "stroke": "#006a1e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#22ba53"},
          {"name": "cross | blue",            "type": "cross",          "size": 90, "stroke": "#006dbe", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#3aa4e5"},
          {"name": "cross | orange",          "type": "cross",          "size": 90, "stroke": "#dc8f00", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#ffb100"},
          {"name": "cross | purple",          "type": "cross",          "size": 90, "stroke": "#5e5e5e", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#b82cff"},
          {"name": "cross | fuschia",         "type": "cross",          "size": 90, "stroke": "#ab006c", "fill-opacity": 0.8, "stroke-width": 2, "fill": "#d4266e"}
        ],
        "lines": [
          StyleLine.default_settings(),
          StyleLine.default_reference_line(),
          {"name": "transparent",             "stroke": "#000000", "stroke-dasharray": "none",         "stroke-opacity": 0,   "stroke-width": 0},
          {"name": "solid | black",           "stroke": "#000000", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "solid | red",             "stroke": "#e32727", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "solid | green",           "stroke": "#006a1e", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "solid | blue",            "stroke": "#006dbe", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "solid | orange",          "stroke": "#dc8f00", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "solid | purple",          "stroke": "#b82cff", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "solid | fuschia",         "stroke": "#ab006c", "stroke-dasharray": "none",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | black",          "stroke": "#000000", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | red",            "stroke": "#e32727", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | green",          "stroke": "#006a1e", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | blue",           "stroke": "#006dbe", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | orange",         "stroke": "#dc8f00", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | purple",         "stroke": "#b82cff", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dashed | fuschia",        "stroke": "#ab006c", "stroke-dasharray": "10, 10",       "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | black",          "stroke": "#000000", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | red",            "stroke": "#e32727", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | green",          "stroke": "#006a1e", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | blue",           "stroke": "#006dbe", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | orange",         "stroke": "#dc8f00", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | purple",         "stroke": "#b82cff", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dotted | fuschia",        "stroke": "#ab006c", "stroke-dasharray": "2, 3",         "stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | black",     "stroke": "#000000", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | red",       "stroke": "#e32727", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | green",     "stroke": "#006a1e", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | blue",      "stroke": "#006dbe", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | orange",    "stroke": "#dc8f00", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | purple",    "stroke": "#b82cff", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2},
          {"name": "dash-dotted | fuschia",   "stroke": "#ab006c", "stroke-dasharray": "15, 10, 5, 10","stroke-opacity": 0.9, "stroke-width": 2}
        ],
        "texts": [
          StyleText.default_settings(),
          StyleText.default_header(),
          StyleText.default_title(),
          {"name": "transparent",     "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#000000", "fill-opacity": 0},
          {"name": "normal | black",  "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#000000", "fill-opacity": 1},
          {"name": "normal | red",    "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#6f0000", "fill-opacity": 1},
          {"name": "normal | green",  "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#006a1e", "fill-opacity": 1},
          {"name": "normal | blue",   "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#006dbe", "fill-opacity": 1},
          {"name": "normal | orange", "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#dc8f00", "fill-opacity": 1},
          {"name": "normal | purple", "font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#b82cff", "fill-opacity": 1},
          {"name": "normal | fuschia","font-size": "12px", "rotate": "0", "font-weight": "normal", "text-anchor": "start", "fill": "#ab006c", "fill-opacity": 1}
        ],
        "rectangles": [
          StyleRectangle.default_settings(),
          {"name": "black",   "fill": "#000000", "fill-opacity": 0.2, "stroke": "#000000", "stroke-width": 0},
          {"name": "red",     "fill": "#e32727", "fill-opacity": 0.2, "stroke": "#6f0000", "stroke-width": 0},
          {"name": "green",   "fill": "#22ba53", "fill-opacity": 0.2, "stroke": "#006a1e", "stroke-width": 0},
          {"name": "blue",    "fill": "#3aa4e5", "fill-opacity": 0.2, "stroke": "#006dbe", "stroke-width": 0},
          {"name": "orange",  "fill": "#ffb100", "fill-opacity": 0.2, "stroke": "#dc8f00", "stroke-width": 0},
          {"name": "purple",  "fill": "#b82cff", "fill-opacity": 0.2, "stroke": "#5e5e5e", "stroke-width": 0},
          {"name": "fuschia", "fill": "#d4266e", "fill-opacity": 0.2, "stroke": "#ab006c", "stroke-width": 0}
        ]
      }
    };
  },
  massage_row: function(row, i){
    // make numbers in data numeric if possible
    // see https://github.com/mbostock/d3/wiki/CSV
    for(var field in row) {
      if(row.hasOwnProperty(field)){
        row[field] = +row[field] || row[field];
      }
    }

    // add data-pivot row-level key and index
    row._dp_y  = i;
    row._dp_pk = row['Row Key'] || i;

    return row;
  },
  move_row: function(arr, obj, moveUp){
    // class-level function; used to delete a settings input row
    var swap = function(arr, a, b){
        if((a<0) || (b<0)) return;
        if((a>=arr.length) || (b>=arr.length)) return;
        arr[a] = arr.splice(b, 1, arr[a])[0];
      }, idx = arr.indexOf(obj.values),
         len = arr.length;

    if(moveUp){
      obj.tr.insertBefore(obj.tr.prev());
      swap(arr, idx, idx-1);
    } else {
      obj.tr.insertAfter(obj.tr.next());
      swap(arr, idx, idx+1);
    }
  },
  delete_row: function(arr, obj){
    // class-level function; used to delete a settings input row
    obj.tr.remove();
    arr.splice(arr.indexOf(obj.values), 1);
    delete obj;
  },
  build_movement_td: function(arr, self, options){
    //build a td including buttons for movement
    var td = $('<td>'),
        up = $('<button class="btn btn-mini" title="move up"><i class="icon-arrow-up"></button>')
                .on('click', function(){DataPivot.move_row(arr, self, true);}),
        down = $('<button class="btn btn-mini" title="move down"><i class="icon-arrow-down"></button>')
                .on('click', function(){DataPivot.move_row(arr, self, false);}),
        del = $('<button class="btn btn-mini" title="remove"><i class="icon-remove"></button>')
                .on('click', function(){DataPivot.delete_row(arr, self);});

      if(options.showSort) td.append(up, down);
      td.append(del);
      return td;
  },
  getRowDetails: function(values){
    var unique = d3.set(values).values(),
        numeric = values.filter(function(v){return $.isNumeric(v); }),
        range = (numeric.length>0) ? d3.extent(numeric) : undefined;

    return {
      unique: unique,
      numeric: numeric,
      range: range
    }
  },
  rangeInputDiv: function(input){
    // given an numeric-range input, return a div containing input and text
    // field which updates based on current value.
    var text = $('<span>').text(input.val());
    input.on('change', function(){text.text(input.val());});
    return $('<div>').append(input, text);
  }
});
DataPivot.prototype = {
  build_edit_settings: function(dom_bindings){
    var self = this,
        editable = true;
    this.style_manager = new StyleManager(this);
    this.$div = $(dom_bindings.container);
    this.$data_div = $(dom_bindings.data_div);
    this.$settings_div = $(dom_bindings.settings_div);
    this.$display_div = $(dom_bindings.display_div);

    // rebuild visualization whenever selected
    $('a[data-toggle="tab"]').on('shown', function(e){
      if (self.$display_div[0] === $($(e.target).attr('href'))[0]){
        self.build_data_pivot_vis(self.$display_div, editable);
      }
    });

    this.build_data_table();
    this.build_settings();
    this.$div.fadeIn();
  },
  build_data_pivot_vis: function(div, editable){
    delete this.plot;
    editable = editable || false;
    this.plot = new DataPivot_visualization(this.data, this.settings, div, editable);
  },
  build_data_table: function(){

    var tbl = $('<table class="data_pivot_table"></table>'),
        thead = $('<thead></thead>'),
        tbody = $('<tbody></tbody>');

    // get headers
    var data_headers = [];
    for(var prop in this.data[0]) {
      if(this.data[0].hasOwnProperty(prop)){
        data_headers.push(prop);
      }
    }

    // print header
    var tr = $('<tr></tr>');
    data_headers.forEach(function(v){
      tr.append('<th>{0}</th>'.printf(v));
    });
    thead.append(tr);

    // print body
    this.data.forEach(function(d){
      var tr = $('<tr></tr>');
      data_headers.forEach(function(field){
        tr.append('<td>{0}</td>'.printf(d[field]));
      });
      tbody.append(tr);
    });

    // insert table
    tbl.append([thead, tbody]);
    this.$data_div.html(tbl);

    // now save things back to object
    this.data_headers = data_headers;
  },
  build_settings: function(){

    var self = this,
        build_description_tab = function(){
          var tab = $('<div class="tab-pane active" id="data_pivot_settings_description"></div>'),
              headers = ['Column header', 'Display name', 'Header style', 'Text style', 'Maximum width (pixels)', 'On-Click'],
              tbody = $('<tbody></tbody>');

          headers.push('Ordering');

          var thead = $('<thead></thead>').html(headers.map(function(v){
                          return '<th>{0}</th>'.printf(v);}).join('\n')),
              add_row = function(i){
                if(!self.settings.description_settings[i]){
                  self.settings.description_settings.push(_DataPivot_settings_description.defaults());
                }
                var obj = new _DataPivot_settings_description(self, self.settings.description_settings[i]);
                tbody.append(obj.tr);
              },
              new_row = function(){
                var num_rows = self.settings.description_settings.length;
                add_row(num_rows);
              },
              new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row),
              num_rows = (self.settings.description_settings.length === 0) ? 5 : self.settings.description_settings.length;

          for(var i=0; i<num_rows; i++){
            add_row(i);
          }
          return tab.html([
              $('<h3>Descriptive Columns</h3>').append(new_point_button),
              $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody])]);
        }, build_data_tab = function(){
            var tab = $('<div class="tab-pane" id="data_pivot_settings_data"></div>'),
                headers = ['Column header', 'Display name', 'Line style'],
                header_tr = function(lst){
                  var vals = [];
                  lst.forEach(function(v){vals.push('<th>{0}</th>'.printf(v));});
                  return $('<tr></tr>').html(vals);
                };

            //Build line table
            var thead = $('<thead></thead>').html(header_tr(headers)),
                tbody = $('<tbody></tbody>');

            if(self.settings.dataline_settings.length === 0){
              self.settings.dataline_settings.push(_DataPivot_settings_linedata.defaults());
            }

            var obj = new _DataPivot_settings_linedata(self, 0),
                tbl_line = $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody]);

            tbody.append(obj.tr);

            // Build point table
            headers = ['Column header', 'Display name', 'Marker style', 'Conditional formatting', 'On-click'];
            headers.push('Ordering');
            thead = $('<thead></thead>').html(header_tr(headers));
            point_tbody = $('<tbody></tbody>');

            var add_point_data_row = function(i){
                  if(!self.settings.datapoint_settings[i]){
                    self.settings.datapoint_settings.push(_DataPivot_settings_pointdata.defaults());
                  }
                  obj = new _DataPivot_settings_pointdata(self, self.settings.datapoint_settings[i]);
                  point_tbody.append(obj.tr);
                }, new_point_row = function(){
                  var num_rows = self.settings.datapoint_settings.length;
                  add_point_data_row(num_rows);
                }, num_rows = (self.settings.datapoint_settings.length === 0) ? 3 : self.settings.datapoint_settings.length,
                new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_point_row),
                tbl_points = $('<table class="table table-condensed table-bordered"></table>').html([thead, point_tbody]);

            for(var i=0; i<num_rows; i++){
              add_point_data_row(i);
            }

            return tab.html([
                '<h3>Data bar options</h3>',
                tbl_line,
                $('<h3>Data point options</h3>').append(new_point_button),
                tbl_points]);
        }, build_ordering_tab = function(){
          var tab = $('<div class="tab-pane" id="data_pivot_settings_ordering"></div>'),
              override_tbody = $('<tbody></tbody>'),
              reset_overrides = function(){
                self.settings.row_overrides = [];
                build_manual_rows();
              }, reset_ordering_overrides = function(){
                self.settings.row_overrides.forEach(function(v){
                  v.offset = 0;
                });
              }, build_manual_rows = function(){
                var rows = [],
                    get_selected_fields = function(v){return v.field_name !== DataPivot.NULL_CASE;},
                    descriptions = self.settings.description_settings.filter(get_selected_fields),
                    filters = self.settings.filters.filter(get_selected_fields),
                    sorts = self.settings.sorts.filter(get_selected_fields);

                if(descriptions.length === 0){
                  rows.push('<tr><td colspan="6">Please provide description columns before manually filtering.</td></tr>');
                  return override_tbody.html(rows);
                }

                // apply filters
                var data_copy = DataPivot_visualization.filter(self.data,
                                  filters, self.settings.plot_settings.filter_logic);

                data_copy = _.filter(data_copy,
                  _.partial(
                    DataPivot_visualization.shouldInclude,
                    _,
                    self.settings.dataline_settings[0],
                    self.settings.datapoint_settings
                  )
                );

                if(data_copy.length === 0 ){
                  rows.push('<tr><td colspan="6">No rows remaining after filtering criteria.</td></tr>');
                  return override_tbody.html(rows);
                }

                // apply sorts
                data_copy = DataPivot_visualization.sorter(data_copy, sorts);

                var row_override_map = d3.map(),
                    get_matched_override_or_default = function(pk){
                      var match = row_override_map.get(pk);
                      if(match) return match;
                      return {
                          "pk": pk,
                          "include": true,
                          "offset": 0,
                          "text_style": DataPivot.NULL_CASE,
                          "line_style": DataPivot.NULL_CASE,
                          "symbol_style": DataPivot.NULL_CASE,
                        };
                    },
                    offsets = [],
                    format_offset = function(offset){
                      if(offset>0) return "↓{0}".printf(offset);
                      if(offset<0) return "↑{0}".printf(Math.abs(offset));
                      return "";
                    };

                self.settings.row_overrides.forEach(function(v){
                  row_override_map.set(v.pk, v);
                });

                // build rows
                data_copy.forEach(function(v, i){
                  var desc = [],
                      obj = get_matched_override_or_default(v._dp_pk),
                      include = $('<input name="ov_include" type="checkbox">').prop('checked', obj.include),
                      offset_span = $('<span></span>').text(format_offset(obj.offset)),
                      move_up = $('<button class="btn btn-mini"><i class="icon-arrow-up"></i></button>')
                          .click(function(){
                            var tr = $(this).parent().parent();
                            if (tr.index()>0){
                              var offset = $(this).parent().data("offset")-1;
                              offset_span.text(format_offset(offset));
                              $(this).parent().data("offset", offset);
                              tr.insertBefore(tr.prev())
                                  .animate({"background-color":"yellow"}, "fast")
                                  .animate({"background-color":"none"}, "slow");
                            }
                          }),
                      move_down = $('<button class="btn btn-mini"><i class="icon-arrow-down"></i></button>')
                          .click(function(){
                            var tr = $(this).parent().parent();
                            if(tr.index()<tr.parent().children().length-1){
                              var offset = $(this).parent().data("offset")+1;
                              offset_span.text(format_offset(offset));
                              $(this).parent().data("offset", offset);
                              tr.insertAfter(tr.next())
                                .animate({"background-color":"yellow"}, "fast")
                                .animate({"background-color":"none"}, "slow");
                            }
                          }),
                      text_style = self.style_manager.add_select("texts", obj.text_style, true),
                      line_style = self.style_manager.add_select("lines", obj.line_style, true),
                      symbol_style = self.style_manager.add_select("symbols", obj.symbol_style, true);

                  descriptions.forEach(function(v2){desc.push(v[v2.field_name]);});
                  var tr = $('<tr></tr>').data({"pk": v._dp_pk, "obj": obj})
                          .append('<td>{0}</td>'.printf(desc.join('<br>')))
                          .append($('<td></td>').append(include))
                          .append($('<td class="ov_offset"></td>').append(offset_span, move_up, move_down).data("offset", obj.offset))
                          .append($('<td class="ov_text"></td>').append(text_style))
                          .append($('<td class="ov_line"></td>').append(line_style))
                          .append($('<td class="ov_symbol"></td>').append(symbol_style));
                  rows.push(tr);
                  if(obj.offset!==0) offsets.push(obj);
                });

                offsets.forEach(function(os){
                  rows.forEach(function(v, i){
                    if ($(v).data("obj") === os){
                      var new_off = i+os.offset;
                      if (new_off >= rows.length) new_off = rows.length-1;
                      if (new_off < 0) new_off = 0;
                      rows.splice(new_off, 0, rows.splice(i, 1)[0]);
                    }
                  });
                });

                return override_tbody.html(rows);
              }, show_rebuild_overrides = function(){
                var btn = $('<button class="btn btn-primary">Click to rebuild</button>')
                            .on('click', build_manual_rows);
                override_tbody.html($('<tr>').append(
                      $('<td colspan="6">Row-ordering has changed.</td>').append('<br>', btn)));
              }, build_filtering_div = function(){
                var div = $('<div></div>'),
                    thead = $('<thead></thead>').html(
                        [$('<tr></tr>').append(
                            '<th>Field Name</th>',
                            '<th>Filter Type</th>',
                            '<th>Value</th>',
                            '<th>Ordering</th>')]),
                    tbody = $('<tbody></tbody>'),
                    num_rows = (self.settings.filters.length === 0) ? 2 : self.settings.filters.length,
                    add_row = function(i){
                      if(!self.settings.filters[i]){
                        self.settings.filters[i] = _DataPivot_settings_filters.defaults();
                      }
                      var obj = new _DataPivot_settings_filters(self, self.settings.filters[i]);
                      tbody.append(obj.tr);
                    },
                    new_row = function(){
                      var num_rows = self.settings.filters.length;
                      add_row(num_rows);
                    },
                    new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row);

                for(var i=0; i<num_rows; i++){
                  add_row(i);
                }

                var filter_logic = function(){
                  var lbl = $('<div></div>'),
                      and = $('<label class="radio inline">AND</label>')
                              .append('<input name="filter_logic" type="radio" value="and">'),
                      or = $('<label class="radio inline">OR</label>')
                              .append('<input name="filter_logic" type="radio" value="or">'),
                      value = self.settings.plot_settings.filter_logic || "and";

                  // set initial value
                  if(value==="and"){
                    and.find('input').prop('checked', true);
                  } else {
                    or.find('input').prop('checked', true);
                  }

                  // set event binding to change settings
                  self.$settings_div.on('change', 'input[name="filter_logic"]', function(){
                    self.settings.plot_settings.filter_logic = $('input[name="filter_logic"]:checked').val();
                    reset_ordering_overrides();
                    show_rebuild_overrides();
                  });

                  tbody.on('change autocompletechange', 'input,select', function(){
                    reset_ordering_overrides();
                    show_rebuild_overrides();
                  }).on('click', 'button', function(){
                    reset_ordering_overrides();
                    show_rebuild_overrides();
                  });

                  return lbl.append('<h4>Filter logic</h4>',
                                    '<p class="help-block">Should multiple filter criteria be required for ALL rows (AND), or ANY row (OR)?</p>',
                                    and, or);
                }();

                return div.html([
                    $('<h3>Row Filters</h3>').append(new_point_button),
                    '<p class="help-block">Use filters to determine which components of your dataset should be displayed on the figure.</p>',
                    $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody]),
                    filter_logic]);
              }, build_sorting_div = function(){
                var div = $('<div></div>'),
                    thead = $('<thead></thead>').html(
                           [$('<tr></tr>').append('<th>Field Name</th>',
                                                  '<th>Sort Order</th>',
                                                  '<th>Ordering</th>')]),
                    tbody = $('<tbody></tbody>').on('change', 'input,select', function(){
                      reset_ordering_overrides();
                      show_rebuild_overrides();
                    }).on('click', 'button', function(){
                      reset_ordering_overrides();
                      show_rebuild_overrides();
                    }),
                    num_rows = (self.settings.sorts.length === 0) ? 2 : self.settings.sorts.length,
                    add_row = function(i){
                      if(!self.settings.sorts[i]){
                        self.settings.sorts[i] = _DataPivot_settings_sorts.defaults();
                      }
                      var obj = new _DataPivot_settings_sorts(self, self.settings.sorts[i], i);
                      tbody.append(obj.tr);
                    },
                    new_row = function(){
                      var num_rows = self.settings.sorts.length;
                      add_row(num_rows);
                    },
                    new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row);

                for(var i=0; i<num_rows; i++){
                  add_row(i);
                }
                return div.html([
                    $('<h3>Row Sorting</h3>').append(new_point_button),
                    '<p class="help-block">Sorting determines the order which rows will appear; sorts can be overridden using the manual override table below.</p>',
                    $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody])]);
              }, build_spacing_div = function(){
                var div = $('<div></div>'),
                    tbody = $('<tbody></tbody>'),
                    thead = $('<thead></thead>').html(
                           [$('<tr></tr>').append('<th>Row index</th>',
                                                  '<th>Show line?</th>',
                                                  '<th>Line style</th>',
                                                  '<th>Extra space?</th>',
                                                  '<th>Delete</th>')]),
                    num_rows = (self.settings.spacers.length === 0) ? 1 : self.settings.spacers.length,
                    add_row = function(i){
                      if(!self.settings.spacers[i]){
                        self.settings.spacers[i] = _DataPivot_settings_spacers.defaults();
                      }
                      var obj = new _DataPivot_settings_spacers(self, self.settings.spacers[i], i);
                      tbody.append(obj.tr);
                    },
                    new_row = function(){
                      var num_rows = self.settings.spacers.length;
                      add_row(num_rows);
                    },
                    new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row);

                for(var i=0; i<num_rows; i++){
                  add_row(i);
                }
                return div.html([
                    $('<h3>Additional Row Spacing</h3>').append(new_point_button),
                    '<p class="help-block">Add additional-space between rows, and optionally a horizontal line.</p>',
                    $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody])]);
              }, build_manual_ordering_div = function(){
                var div = $('<div></div>'),
                    thead = $('<thead></thead>').html(
                                [$('<tr></tr>').append(
                                    '<th>Description</th>',
                                    '<th>Include</th>',
                                    '<th>Row Offset</th>',
                                    '<th>Override<br>Text Style</th>',
                                    '<th>Override<br>Line Style</th>',
                                    '<th>Override<br>Symbol Style</th>')]);

                return div.html([
                    $('<h3>Row-level customization</h3>').append(
                        $('<button class="btn btn-primary pull-right">Reset overrides</button>')
                            .on('click', reset_overrides)),
                    $('<p class="help-block">Row-level customization of individual rows after filtering/sorting above. Note that any changes to sorting or filtering will alter these customizations.</p>'),
                    $('<table class="table table-condensed table-bordered table-hover tbl_override"></table>').html([thead, override_tbody])]);
              }, update_override_settings = function(){
                self.settings.row_overrides = [];
                override_tbody.find("tr").each(function(i, v){
                  var $v = $(v),
                      obj = {
                        "pk": $v.data("pk"),
                        "include": $v.find('input[name="ov_include"]').prop("checked"),
                        "offset": $v.find('.ov_offset').data("offset"),
                        "text_style": $v.find('.ov_text select option:selected').val(),
                        "line_style": $v.find('.ov_line select option:selected').val(),
                        "symbol_style": $v.find('.ov_symbol select option:selected').val(),
                      };
                  // only add if settings are non-default
                  if ((obj.include === false) ||
                      (obj.offset !== 0) ||
                      (obj.text_style !== DataPivot.NULL_CASE) ||
                      (obj.line_style !== DataPivot.NULL_CASE) ||
                      (obj.symbol_style !== DataPivot.NULL_CASE)){
                    self.settings.row_overrides.push(obj);
                  }
                });
              };

          override_tbody.on('click', 'button', update_override_settings)
              .on('change', 'input,select', update_override_settings);

          // update whenever tab is clicked
          self.$div.on('shown','a.dp_ordering_tab[data-toggle="tab"]', build_manual_rows);

          return tab.html([
              build_filtering_div(), '<hr>',
              build_sorting_div(), '<hr>',
              build_spacing_div(), '<hr>',
              build_manual_ordering_div()]);
        }, build_reference_tab = function(){
          var tab = $('<div class="tab-pane" id="data_pivot_settings_ref"></div>'),
              build_reference_lines = function(){
                var thead = $('<thead></thead>').html(
                        [$('<tr></tr>').append('<th>Reference Line Value</th><th>Line Style</th><th>Delete</th>')]),
                    tbody = $('<tbody></tbody>'),
                    add_row = function(i){
                      if(!self.settings.reference_lines[i]){
                        self.settings.reference_lines.push(_DataPivot_settings_refline.defaults());
                      }
                      var obj = new _DataPivot_settings_refline(self, self.settings.reference_lines[i]);
                      tbody.append(obj.tr);
                    },
                    new_row = function(){
                      var num_rows = self.settings.reference_lines.length;
                      add_row(num_rows);
                    },
                    new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row),
                    num_rows = (self.settings.reference_lines.length === 0) ? 1 : self.settings.reference_lines.length;

                for(var i=0; i<num_rows; i++){
                  add_row(i);
                }
                return $('<div>').append(
                          $('<h3>Reference Lines</h3>').append(new_point_button),
                          $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody]));
              }, build_reference_ranges = function(){
                var thead = $('<thead></thead>').html(
                        [$('<tr></tr>').append('<th>Lower Value</th><th>Upper Value</th><th>Range Style</th><th>Delete</th>')]),
                    colgroup = $('<colgroup><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"><col style="width: 25%;"></colgroup>'),
                    tbody = $('<tbody></tbody>'),
                    add_row = function(i){
                      if(!self.settings.reference_rectangles[i]){
                        self.settings.reference_rectangles.push(_DataPivot_settings_refrect.defaults());
                      }
                      var obj = new _DataPivot_settings_refrect(self, self.settings.reference_rectangles[i]);
                      tbody.append(obj.tr);
                    },
                    new_row = function(){
                      var num_rows = self.settings.reference_rectangles.length;
                      add_row(num_rows);
                    },
                    new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row),
                    num_rows = (self.settings.reference_rectangles.length === 0) ? 1 : self.settings.reference_rectangles.length;

                for(var i=0; i<num_rows; i++){
                  add_row(i);
                }
                return $('<div>').append(
                    $('<h3>Reference Ranges</h3>').append(new_point_button),
                    $('<table class="table table-condensed table-bordered"></table>').html([colgroup, thead, tbody]));
              }, build_labels = function(){
                var thead = $('<thead></thead>').html(
                        [$('<tr></tr>').append('<th>Text</th><th>Style</th><th>Delete</th>')]),
                    tbody = $('<tbody></tbody>'),
                    add_row = function(i){
                      if(!self.settings.labels[i]){
                        self.settings.labels.push(_DataPivot_settings_label.defaults());
                      }
                      var obj = new _DataPivot_settings_label(self, self.settings.labels[i]);
                      tbody.append(obj.tr);
                    },
                    new_row = function(){
                      var num_rows = self.settings.labels.length;
                      add_row(num_rows);
                    },
                    new_point_button = $('<button class="btn btn-primary pull-right">New Row</button>').on('click', new_row),
                    num_rows = (self.settings.labels.length === 0) ? 1 : self.settings.labels.length;

                for(var i=0; i<num_rows; i++){
                  add_row(i);
                }
                return $('<div>').append(
                          $('<h3>Labels</h3>').append(new_point_button),
                          $('<table class="table table-condensed table-bordered"></table>').html([thead, tbody]));
              };

          return tab.html([build_reference_lines(),
                           build_reference_ranges(),
                           build_labels()]);
        }, build_styles_tab = function(){
          var tab = $('<div class="tab-pane" id="data_pivot_settings_styles"></div>'),
              symbol_div = self.style_manager.build_styles_crud('symbols'),
              line_div = self.style_manager.build_styles_crud('lines'),
              text_div  = self.style_manager.build_styles_crud('texts'),
              rectangle_div  = self.style_manager.build_styles_crud('rectangles');

          return tab.html([
              symbol_div, '<hr>',
              line_div, '<hr>',
              text_div, '<hr>',
              rectangle_div]);
        }, build_settings_general_tab = function(){
          var tab = $('<div class="tab-pane" id="data_pivot_settings_general"></div>'),
              build_general_settings = function(){
                var div = $('<div></div>'),
                    tbl = $('<table class="table table-condensed table-bordered"></table>'),
                    tbody = $('<tbody></tbody>'),
                    colgroup = $('<colgroup><col style="width: 30%;"><col style="width: 70%;"></colgroup>');

                self._dp_settings_general = new _DataPivot_settings_general(self, self.settings.plot_settings);
                tbody.html(self._dp_settings_general.trs);
                tbl.html([colgroup, tbody]);
                return div.html(tbl);
              }, download_button = $('<button class="btn btn-primary">Download settings</button>')
                      .on('click', function(){self.download_settings();}),
              build_legend_settings = function(){
                var div = $('<div class="row-fluid"></div>'),
                    content = $('<div class="span6"></div>'),
                    plot_div = $('<div class="span6"></div>'),
                    vis = d3.select(plot_div[0])
                              .append("svg")
                                  .attr("width", "95%")
                                  .attr("height", "300px")
                                  .attr("class", "d3")
                              .append("g")
                                  .attr("transform", "translate(10,10)");

                self.legend = new DataPivotLegend(vis, self.settings.legend, self.settings);

                var tbl = $('<table class="table table-condensed table-bordered"></table>'),
                    tbody = $('<tbody></tbody>'),
                    colgroup = $('<colgroup><col style="width: 30%;"><col style="width: 70%;"></colgroup>'),
                    build_tr = function(label, input){
                      return $('<tr></tr>').append('<th>{0}</th>'.printf(label))
                          .append($('<td></td>').append(input));
                    },
                    add_horizontal_field = function(label_text, html_obj){
                      return $('<div class="control-group"></div>')
                          .append('<label class="control-label">{0}</label>'.printf(label_text))
                          .append( $('<div class="controls"></div>').append(html_obj));
                    },
                    show_legend = $('<input type="checkbox">')
                        .prop('checked', self.settings.legend.show)
                        .on('change', function(){ self.settings.legend.show = $(this).prop('checked');}),
                    number_columns = $('<input>')
                        .val(self.settings.legend.columns)
                        .on('change', function(){
                          self.settings.legend.columns = parseInt($(this).val(), 10) || 1;
                          self.legend._draw_legend();
                        }),
                    border_width = $('<input type="range" min="0" max="10" value="{0}">'
                            .printf(self.settings.legend.style.border_width))
                        .on('change', function(){
                          self.settings.legend.style.border_width = parseFloat($(this).val(), 10) || 0;
                          self.legend._draw_legend();
                        }),
                    border_color = $('<input name="fill" type="color" value="{0}">'
                            .printf(self.settings.legend.style.border_color))
                        .on('change', function(){
                          self.settings.legend.style.border_color = $(this).val();
                          self.legend._draw_legend();
                        }),
                    modal = $('<div class="modal hide fade">' +
                              '<div class="modal-header">' +
                                  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                                  '<h3>Modify Legend Entry</h3>' +
                              '</div>' +
                              '<div class="modal-body">' +
                              '<form class="form-horizontal">' +
                                '<div class="style_plot" style="margin-left:180px; height: 70px;"></div><br>' +
                                '<div class="legend_fields"></div>' +
                              '</div>' +
                              '<div class="modal-footer">' +
                                  '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
                              '</div>' +
                            '</div>'),
                    button_well = $('<div class="well"></div>'),
                    draw_modal_fields = function(d){
                      if(d){
                        modal.data('d', d);
                      } else{
                        modal.removeData('d');
                      }
                      var tmp_label = (d) ? d.label : DataPivot.NULL_CASE,
                          tmp_line = (d) ? d.line_style : DataPivot.NULL_CASE,
                          tmp_symbol = (d) ? d.symbol_style : DataPivot.NULL_CASE,
                          name = $('<input name="legend_name" value="{0}">'.printf(tmp_label)),
                          line = self.style_manager.add_select("lines", tmp_line, true)
                                      .removeClass('span12').attr('name', 'legend_line'),
                          symbol = self.style_manager.add_select("symbols", tmp_symbol, true)
                                      .removeClass('span12').attr('name', 'legend_symbol');

                      modal.find('.legend_fields').html([
                          add_horizontal_field("Legend Name", name),
                          add_horizontal_field("Symbol Style", symbol),
                          add_horizontal_field("Line Style", line)]);

                      var svgdiv = modal.find('.style_plot'),
                          build_style_obj = function(){
                            return {
                              "type": "legend",
                              "line_style": line.find('option:selected').data('d'),
                              "symbol_style": symbol.find('option:selected').data('d')
                            };
                          }, viewer = new StyleViewer(svgdiv, build_style_obj()),
                          update_viewer = function(){
                            viewer.apply_new_styles(build_style_obj(), false);
                          };

                      line.on('change', update_viewer);
                      symbol.on('change', update_viewer);
                    },
                    legend_item = self.legend.add_select(),
                    legend_item_up = $('<button><i class="icon-arrow-up"></i></button>')
                        .on('click', function(){
                          self.legend.move_field(legend_item.find('option:selected').data('d'), -1);
                          self.legend._draw_legend();
                    }),
                    legend_item_down = $('<button><i class="icon-arrow-down"></i></button>')
                        .on('click', function(){
                          self.legend.move_field(legend_item.find('option:selected').data('d'), 1);
                          self.legend._draw_legend();
                    }),
                    legend_item_new = $('<button class="btn btn-primary">New</button>')
                        .on('click', function(){
                          modal.modal('show');
                          draw_modal_fields(undefined);
                          self.legend._draw_legend();
                    }),
                    legend_item_edit = $('<button class="btn btn-info">Edit</button>')
                        .on('click', function(){
                          modal.modal('show');
                          draw_modal_fields(legend_item.find('option:selected').data('d'));
                          self.legend._draw_legend();
                    }),
                    legend_item_delete = $('<button class="btn btn-danger">Delete</button>')
                        .on('click', function(){
                          self.legend.delete_field(legend_item.find('option:selected').data('d'));
                          self.legend._draw_legend();
                    }),
                    save_legend_item = $('<button class="btn btn-primary"aria-hidden="true">Save and Close</button>')
                      .on('click', function(){
                        var label = modal.find('input[name="legend_name"]').val(),
                            line_style = modal.find('select[name="legend_line"] option:selected').val(),
                            symbol_style = modal.find('select[name="legend_symbol"] option:selected').val();

                        if((label === "") ||
                           ((line_style === DataPivot.NULL_CASE) &&
                            (symbol_style === DataPivot.NULL_CASE))){
                          alert("Error - name must not be blank, and at least one style must be selected");
                          return;
                        }

                        var d = modal.data('d'),
                            obj = {"line_style": line_style,
                                   "symbol_style": symbol_style,
                                   "label": label};

                        self.legend.add_or_update_field(obj, d);
                        modal.modal('hide');
                        self.legend._draw_legend();
                      });

                modal.find('.modal-footer').append(save_legend_item);
                tbody.html([
                    build_tr("Show legend", show_legend),
                    build_tr("Number of columns", number_columns),
                    build_tr("Border width", DataPivot.rangeInputDiv(border_width)),
                    build_tr("Border color", border_color),
                    build_tr("Legend item", legend_item)]);

                tbl.html([colgroup, tbody]);
                button_well.append(
                    legend_item_new,
                    legend_item_up,
                    legend_item_down,
                    legend_item_edit,
                    legend_item_delete);
                content.append("<h4>Legend Settings<h4>", tbl, button_well);
                div.html([content, plot_div]);
                div.find('input[type="color"]')
                    .spectrum({"showInitial": true, "showInput": true});
                return div;
              };

          // update whenever tab is clicked
          var legend_div = build_legend_settings();
          self.$div.on('shown','a.dp_general_tab[data-toggle="tab"]', function(){
            self.legend._draw_legend();
          });

          return tab.html([
              build_general_settings(), '<hr>',
              legend_div, '<hr>',
              download_button]);
        }, content = [
          $('<ul class="nav nav-tabs">')
              .append(
                  '<li class="active"><a href="#data_pivot_settings_description" data-toggle="tab">Description Columns</a></li>',
                  '<li><a href="#data_pivot_settings_data" data-toggle="tab">Data Columns</a></li>',
                  '<li><a class="dp_ordering_tab" href="#data_pivot_settings_ordering" data-toggle="tab">Row Ordering</a></li>',
                  '<li><a href="#data_pivot_settings_ref" data-toggle="tab">References</a></li>',
                  '<li><a href="#data_pivot_settings_styles" data-toggle="tab">Styles</a></li>',
                  '<li><a class="dp_general_tab" href="#data_pivot_settings_general" data-toggle="tab">General Settings</a></li>'),
          $('<div class="tab-content"></div>')
              .append(
                  build_description_tab(),
                  build_settings_general_tab(),
                  build_data_tab(),
                  build_ordering_tab(),
                  build_reference_tab(),
                  build_styles_tab())
        ];

    this.$settings_div
      .html(content)
      .on('shown', function(e){
        if($(e.target).attr('href')==="#data_pivot_settings_general"){
          self._dp_settings_general.update_merge_until();
        }
      });
  },
  _get_header_options: function(show_blank){
    var opts = [];
    if (show_blank) opts.push('<option value="{0}">{0}</option>'.printf(DataPivot.NULL_CASE));
    return opts.concat(this.data_headers.map(function(v){
      return '<option value="{0}">{0}</option>'.printf(v);
    }));
  },
  _get_description_options: function(){
    return this.settings.description_settings.map(function(d,i){
      return '<option value="{0}">{1}</option>'.printf(i, d.header_name);
    });
  },
  download_settings: function(){
    var settings_json = this.get_settings_json();
    saveTextAs(settings_json, "data_pivot_settings.json");
  },
  get_settings_json: function(){
    return JSON.stringify(this.settings);
  },
  displayAsModal: function(){
    var self = this,
        modal = new HAWCModal(),
        title = '<h4>{0}</h4>'.printf(this.title),
        $plot = $('<div class="span12">'),
        $content = $('<div class="container-fluid">')
            .append($('<div class="row-fluid">')
                .append($plot));

    modal.getModal().on('shown', function(){
      self.build_data_pivot_vis($plot);
    });

    modal.addHeader(title)
        .addBody($content)
        .addFooter("")
        .show();
  }
};


var _DataPivot_settings_refline = function(data_pivot, values){
  var self = this;
  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {};
  this.content.value_field = $('<input class="span12" type="text">');

  this.content.line_style = this.data_pivot.style_manager
      .add_select("lines", values.line_style);

  var movement_td = DataPivot.build_movement_td(self.data_pivot.settings.reference_lines, this, {showSort: false});

  // set default values
  this.content.value_field.val(values.value);

  this.tr = $('<tr></tr>')
      .append($('<td></td>').append(this.content.value_field))
      .append($('<td></td>').append(this.content.line_style))
      .append(movement_td)
      .on('change', 'input,select', function(v){self.data_push();});

  this.data_push();
  return this;
};
_DataPivot_settings_refline.defaults = function(){
  return {
    "value": DataPivot.NULL_CASE,
    "line_style": "reference line"
  };
};
_DataPivot_settings_refline.prototype = {
  data_push: function(){
    this.values.value = parseFloat(this.content.value_field.val());
    this.values.line_style = this.content.line_style.find('option:selected').text();
  }
};


var _DataPivot_settings_refrect = function(data_pivot, values){
  var self = this;
  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {};
  this.content.x1_field = $('<input class="span12" type="text">');
  this.content.x2_field = $('<input class="span12" type="text">');
  this.content.rectangle_style = this.data_pivot.style_manager
      .add_select("rectangles", values.rectangle_style);

  // set default values
  this.content.x1_field.val(values.x1);
  this.content.x2_field.val(values.x2);

  var movement_td = DataPivot.build_movement_td(self.data_pivot.settings.reference_rectangles, this, {showSort: false});

  this.tr = $('<tr></tr>')
      .append($('<td></td>').append(this.content.x1_field))
      .append($('<td></td>').append(this.content.x2_field))
      .append($('<td></td>').append(this.content.rectangle_style))
      .append(movement_td)
      .on('change', 'input,select', function(v){self.data_push();});

  this.data_push();
  return this;
};
_DataPivot_settings_refrect.defaults = function(){
  return {
    "x1": DataPivot.NULL_CASE,
    "x2": DataPivot.NULL_CASE,
    "rectangle_style": "base"
  };
};
_DataPivot_settings_refrect.prototype = {
  data_push: function(){
    this.values.x1 = parseFloat(this.content.x1_field.val());
    this.values.x2 = parseFloat(this.content.x2_field.val());
    this.values.rectangle_style = this.content.rectangle_style.find('option:selected').text();
  }
};


var _DataPivot_settings_label = function(data_pivot, values){
  var self = this;
  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {};
  this.content.text = $('<input class="span12" type="text">').val(values.text);
  this.content.style = this.data_pivot.style_manager.add_select("texts", values.style);

  var movement_td = DataPivot.build_movement_td(self.data_pivot.settings.labels, this, {showSort: false});

  this.tr = $('<tr>')
      .append($('<td>').append(this.content.text))
      .append($('<td>').append(this.content.style))
      .append(movement_td)
      .on('change', 'input,select', function(v){self.data_push();});

  this.data_push();
  return this;
};
_DataPivot_settings_label.defaults = function(){
  return {
    "text": "",
    "style": "title",
    "x": 10,
    "y": 10
  };
};
_DataPivot_settings_label.prototype = {
  data_push: function(){
    this.values.text = this.content.text.val();
    this.values.style = this.content.style.find('option:selected').text();
  }
};


var _DataPivot_settings_sorts = function(data_pivot, values, index){
  var self = this,
      movement_td = DataPivot.build_movement_td(data_pivot.settings.sorts, this, {showSort: true});
  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {};
  this.content.field_name = $('<select class="span12"></select>')
      .html(this.data_pivot._get_header_options(true));
  this.content.ascending = $('<label class="radio"><input name="asc{0}" type="radio" value="true">Ascending</label><label class="radio"><input name="asc{0}" type="radio" value="false">Descending</label>'.printf(index));

  // set default values
  this.content.field_name
      .find('option[value="{0}"]'.printf(values.field_name))
      .prop('selected', true);
  this.content.ascending.find('[value={0}]'.printf(values.ascending)).prop('checked', true);

  this.tr = $('<tr></tr>')
      .append($('<td></td>').append(this.content.field_name))
      .append($('<td></td>').append(this.content.ascending))
      .append(movement_td)
      .on('change', 'input,select', function(v){self.data_push();});

  this.data_push();
  return this;
};
_DataPivot_settings_sorts.defaults = function(){
  return {
    "field_name": DataPivot.NULL_CASE,
    "ascending": true
  };
};
_DataPivot_settings_sorts.prototype = {
  data_push: function(){
    this.values.field_name=this.content.field_name.find('option:selected').text();
    this.values.ascending=this.content.ascending.find('input').prop('checked');
  }
}


var _DataPivot_settings_filters = function(data_pivot, values){
  var self = this;
  this.data_pivot = data_pivot;
  this.values = values;

  var get_quantifier_options = function(){
    return '<option value="gt">&gt;</option>' +
           '<option value="gte">≥</option>' +
           '<option value="lt">&lt;</option>' +
           '<option value="lte">≤</option>' +
           '<option value="exact">exact</option>' +
           '<option value="contains">contains</option>' +
           '<option value="not_contains">does not contain</option>';
  };

  // create fields
  this.content = {};
  this.content.field_name = $('<select class="span12"></select>')
      .html(this.data_pivot._get_header_options(true));
  this.content.quantifier = $('<select class="span12"></select>')
      .html(get_quantifier_options());
  this.content.value = $('<input class="span12" type="text">').autocomplete({"source": values.value});

  // set default values
  this.content.field_name
      .find('option[value="{0}"]'.printf(values.field_name))
      .prop('selected', true);
  this.content.quantifier
      .find('option[value="{0}"]'.printf(values.quantifier))
      .prop('selected', true);
  this.content.value.val(values.value);

  var movement_td = DataPivot.build_movement_td(self.data_pivot.settings.filters, this, {showSort: true});

  this.tr = $('<tr></tr>')
      .append($('<td></td>').append(this.content.field_name))
      .append($('<td></td>').append(this.content.quantifier))
      .append($('<td></td>').append(this.content.value))
      .append(movement_td)
      .on('change autocompletechange autocompleteselect', 'input,select', function(v){self.data_push();});

  var content = this.content,
      enable_autocomplete = function(request, response){
        var field = content.field_name.find('option:selected').val(),
            values = d3.set(data_pivot.data.map(function(v){ return v[field];})).values();
        content.value.autocomplete('option', {'source': values});
      };

  this.content.field_name.on('change', enable_autocomplete);
  enable_autocomplete();

  this.data_push();
  return this;
};
_DataPivot_settings_filters.defaults = function(){
  return {
    "field_name": DataPivot.NULL_CASE,
    "quantifier": "contains",
    "value": ""
  };
};
_DataPivot_settings_filters.prototype = {
  data_push: function(){
    this.values.field_name = this.content.field_name.find('option:selected').val();
    this.values.quantifier = this.content.quantifier.find('option:selected').val();
    this.values.value = this.content.value.val();
  }
};


var _DataPivot_settings_spacers = function(data_pivot, values, index){
  var self = this,
      movement_td = DataPivot.build_movement_td(data_pivot.settings.spacers, this, {showSort: false});

  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {
    index: $('<input class="span12" type="number">'),
    show_line: $('<input type="checkbox">'),
    line_style: data_pivot.style_manager.add_select("lines", values.line_style),
    extra_space: $('<input type="checkbox">')
  };

  // set default values
  this.content.index.val(values.index);
  this.content.show_line.prop('checked', values.show_line);
  this.content.extra_space.prop('checked', values.extra_space);

  this.tr = $('<tr></tr>')
      .append($('<td>').append(this.content.index))
      .append($('<td>').append(this.content.show_line))
      .append($('<td>').append(this.content.line_style))
      .append($('<td>').append(this.content.extra_space))
      .append(movement_td)
      .on('change', 'input,select', function(v){self.data_push();});

  this.data_push();
  return this;
};
_DataPivot_settings_spacers.defaults = function(){
  return {
    index: DataPivot.NULL_CASE,
    show_line: true,
    line_style: "reference line",
    extra_space: false
  };
};
_DataPivot_settings_spacers.prototype = {
  data_push: function(){
    this.values.index = parseInt(this.content.index.val(), 10) || -1;
    this.values.show_line = this.content.show_line.prop('checked');
    this.values.line_style = this.content.line_style.find('option:selected').text();
    this.values.extra_space = this.content.extra_space.prop('checked');
  }
};


var _DataPivot_settings_description = function(data_pivot, values){
  var self = this;
  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {
    "field_name" :$('<select class="span12"></select>').html(this.data_pivot._get_header_options(true)),
    "header_name": $('<input class="span12" type="text">'),
    "header_style": this.data_pivot.style_manager.add_select("texts", values.header_style),
    "text_style": this.data_pivot.style_manager.add_select("texts", values.text_style),
    "max_width": $('<input class="span12" type="number">'),
    "dpe": $('<select class="span12"></select>').html(DataPivotExtension.get_options(data_pivot))
  };

  // set default values
  this.content.field_name.find('option[value="{0}"]'.printf(values.field_name)).prop('selected', true);
  this.content.header_name.val(values.header_name);
  this.content.max_width.val(values.max_width);
  this.content.dpe.find('option[value="{0}"]'.printf(values.dpe)).prop('selected', true);

  var header_input = this.content.header_name;
  this.content.field_name.on('change', function(){
    header_input.val($(this).find('option:selected').val());
  });

  this.tr = $('<tr></tr>')
      .append($('<td></td>').append(this.content.field_name))
      .append($('<td></td>').append(this.content.header_name))
      .append($('<td></td>').append(this.content.header_style))
      .append($('<td></td>').append(this.content.text_style))
      .append($('<td></td>').append(this.content.max_width))
      .append($('<td></td>').append(this.content.dpe))
      .on('change', 'input,select', function(v){self.data_push();});

  var movement_td = DataPivot.build_movement_td(self.data_pivot.settings.description_settings, this, {showSort: true});
  this.tr.append(movement_td);

  this.data_push();
  return this;
};
_DataPivot_settings_description.defaults = function(){
  return {
    "field_name": DataPivot.NULL_CASE,
    "header_name": '',
    "header_style": "header",
    "text_style": "base",
    "dpe": DataPivot.NULL_CASE,
    "max_width": undefined
  };
};
_DataPivot_settings_description.prototype = {
  data_push: function(){
    this.values.field_name =  this.content.field_name.find('option:selected').val();
    this.values.field_index = this.content.field_name.find('option:selected').val();
    this.values.header_style = this.content.header_style.find('option:selected').val();
    this.values.text_style = this.content.text_style.find('option:selected').val();
    this.values.header_name = this.content.header_name.val();
    this.values.max_width = parseFloat(this.content.max_width.val(), 10) || undefined;
    this.values.dpe = DataPivot.NULL_CASE;
    if(this.values.header_name === ''){this.values.header_name = this.values.field_name;}
    if(this.content.dpe){this.values.dpe = this.content.dpe.find('option:selected').val();}
  }
};


var _DataPivot_settings_pointdata = function(data_pivot, values){
  var self = this,
      style_type = "symbols";

  this.data_pivot = data_pivot;
  this.values = values;
  this.conditional_formatter = new _DataPivot_settings_conditionalFormat(this, values.conditional_formatting || []);

  // create fields
  this.content = {
    "field_name": $('<select class="span12">').html(this.data_pivot._get_header_options(true)),
    "header_name": $('<input class="span12" type="text">'),
    "marker_style": this.data_pivot.style_manager.add_select(style_type, values.marker_style),
    "conditional_formatting": this.conditional_formatter.data,
    "dpe": $('<select class="span12"></select>').html(DataPivotExtension.get_options(data_pivot))
  };

  // set default values
  this.content.field_name.find('option[value="{0}"]'.printf(values.field_name)).prop('selected', true);
  this.content.header_name.val(values.header_name);
  this.content.dpe.find('option[value="{0}"]'.printf(values.dpe)).prop('selected', true);

  var header_input = this.content.header_name;
  this.content.field_name.on('change', function(){
    header_input.val($(this).find('option:selected').val());
  });

  this.tr = $('<tr>')
      .append($('<td>').append(this.content.field_name))
      .append($('<td>').append(this.content.header_name))
      .append($('<td>').append(this.content.marker_style))
      .append($('<td>').append(this.conditional_formatter.status))
      .append($('<td>').append(this.content.dpe))
      .on('change', 'input,select', function(v){
        //update self
        self.data_push();
        // update legend
        var obj = {"symbol_index": self.data_pivot.settings.datapoint_settings.indexOf(values),
                   "label": self.content.header_name.val(),
                   "symbol_style": self.content.marker_style.find('option:selected').text()};
         self.data_pivot.legend.add_or_update_field(obj);
      });

  var movement_td = DataPivot.build_movement_td(self.data_pivot.settings.datapoint_settings, this, {showSort: true});
  this.tr.append(movement_td);

  this.data_push();
  return this;
};
_DataPivot_settings_pointdata.defaults = function(){
  return {
    "field_name": DataPivot.NULL_CASE,
    "header_name": "",
    "marker_style": "base",
    "dpe": DataPivot.NULL_CASE,
    "conditional_formatting": []
  };
};
_DataPivot_settings_pointdata.prototype = {
  data_push: function(){
    this.values.field_name = this.content.field_name.find('option:selected').val();
    this.values.header_name = this.content.header_name.val();
    this.values.marker_style = this.content.marker_style.find('option:selected').text();
    this.values.dpe = DataPivot.NULL_CASE;
    this.values.conditional_formatting = this.conditional_formatter.data;
    if(this.values.header_name === ''){this.values.header_name = this.values.field_name;}
    if(this.content.dpe){this.values.dpe = this.content.dpe.find('option:selected').val();}
  }
};


var _DataPivot_settings_conditionalFormat = function(parent, values){
  var self = this;

  this.parent = parent;
  this.data = values;
  this.status = $('<div>');
  this.conditionals = [];
  this.modalInitialized = false;

  this._status_text = $('<span style="padding-right: 10px">')
    .appendTo(this.status);

  this._showModal = $('<button class="btn btn-small" type="button">')
    .on('click', function(){self._show_modal();})
    .appendTo(this.status);

  this._update_status();
  this._build_modal();
};
_.extend(_DataPivot_settings_conditionalFormat, {
  condition_types: [
    "point-size", "point-color", "discrete-style"
  ],
  defaults: {
    "field_name": DataPivot.NULL_CASE,
    "condition_type": "point-size",
    "min_size": 50,
    "max_size": 150,
    "min_color": "#800000",
    "max_color": "#008000",
    "discrete_styles": []
  }
});
_DataPivot_settings_conditionalFormat.prototype = {
  _update_status: function(){
    var status = (this.data.length>0) ? "Enabled" : "None",
        modal =  (this.data.length>0) ? "Edit" : "Create";

    this._status_text.text(status);
    this._showModal.text(modal);
  },
  _build_modal: function(){
    var self = this,
        modal = $('<div class="modal hide fade">'),
        header = $('<div class="modal-header">')
          .appendTo(modal),
        body = $('<div class="modal-body">')
          .appendTo(modal),
        add = $('<button type="button" class="btn btn-primary">')
          .text("Add")
          .on('click', function(){self._add_condition();}),
        save = $('<button type="button" class="btn btn-success">')
          .text("Save and Close")
          .on('click', function(){self.close_modal(true);}),
        close = $('<button type="button" class="btn pull-right">')
          .text("Close")
          .on('click', function(){self.close_modal(false);})
        footer = $('<div class="modal-footer">')
          .append(add, save, close)
          .appendTo(modal),

    this.modal = modal.appendTo(this.status);
  },
  _show_modal: function(){
    // set header text
    var txt = 'Conditional formatting: <i>{0}<i>'.printf(this.parent.values.field_name);
    this.modal.find('.modal-header').empty()
        .append($('<h4>').html(txt));

    // load current conditions
    if (!this.modalInitialized) this._draw_conditions();
    this.modalInitialized = true;

    // show modal
    this.modal.modal('show');
  },
  close_modal: function(save){
    if(save) this._save_conditions();
    this._update_status();
    this.modal.modal('hide');
  },
  _draw_conditions: function(){
    var self = this,
        body = this.modal.find('.modal-body').empty();

    // add placeholder if no conditions are set
    this.blank = $('<span>').appendTo(body);
    if(this.data.length === 0) this.blank.text('No conditions have been set.');

    // draw conditions
    this.data.forEach(function(v){
      self.conditionals.push(new _DataPivot_settings_conditional(body, self, v));
    });
  },
  _save_conditions: function(){
    this.data = this.conditionals.map(function(v){ return v.get_values(); });
    this.parent.data_push();
  },
  _add_condition: function(values){
    var body = this.modal.find('.modal-body');
    this.blank.empty();
    this.conditionals.push(new _DataPivot_settings_conditional(body, this, values));
  },
  delete_condition: function(conditional){
    this.conditionals.splice_object(conditional);
    delete conditional;
  }
};


var _DataPivot_ColorGradientSVG = function(svg, start_color, stop_color){
  var svg = d3.select(svg);

  var gradient = svg.append("svg:defs")
    .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

  this.start = gradient.append("svg:stop")
      .attr("offset", "0%")
      .attr("stop-color", start_color)
      .attr("stop-opacity", 1);

  this.stop = gradient.append("svg:stop")
      .attr("offset", "100%")
      .attr("stop-color", stop_color)
      .attr("stop-opacity", 1);

  svg.append("svg:rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("fill", "url(#gradient)");
};
_DataPivot_ColorGradientSVG.prototype = {
  update_start_color: function(color){
      this.start.attr("stop-color", color);
  },
  update_stop_color: function(color){
      this.stop.attr("stop-color", color);
  }
};


_DataPivot_settings_conditional = function(parent_div, parent, values){
  values = values || {discrete_styles: []};
  this.inputs = [];

  var self = this,
      dp = parent.parent.data_pivot,
      defaults = _DataPivot_settings_conditionalFormat.defaults,
      div = $('<div class="well">')
              .appendTo(parent_div),
      add_input_row = function(parent, desc_txt, inp){
        var lbl = $('<label>').html(desc_txt);
        parent.append(lbl, inp);
      },
      fieldName = $('<select name="field_name">')
          .html(dp._get_header_options(true))
          .val(values.field_name || defaults.field_name),
      conditionType = $('<select name="condition_type">')
          .html(_DataPivot_settings_conditionalFormat.condition_types
            .map(function(v){return '<option value="{0}">{0}</option>'.printf(v)}))
          .val(values.condition_type || defaults.condition_type),
      changeConditionType = function(){
        div.find('.conditionalDivs').hide();
        div.find("." + conditionType.val()).fadeIn();
      };

  // add delete button
  $('<button type="button" class="close">')
    .text('x')
    .on('click', function(){
      div.remove();
      parent.delete_condition(self);
    })
    .prependTo(div); // todo pop from parent

  // add master conditional inputs and divs for changing fields
  add_input_row(div, "Condition field", fieldName);
  add_input_row(div, "Condition type", conditionType);
  div.append('<hr>');
  _DataPivot_settings_conditionalFormat.condition_types.forEach(function(v){
    $('<div class="conditionalDivs {0}">'.printf(v)).appendTo(div).hide();
  });

  // build min/max for size and color
  var min_size = $('<input name="min_size" type="range" min="0" max="500" step="5">')
      .val(values.min_size || defaults.min_size),
    max_size = $('<input name="max_size" type="range" min="0" max="500" step="5">')
      .val(values.max_size || defaults.max_size),
    min_color = $('<input name="min_color" type="color">')
      .val(values.min_color || defaults.min_color),
    max_color = $('<input name="max_color" type="color">')
      .val(values.max_color || defaults.max_color),
    svg = $('<svg width="150" height="25" class="d3" style="margin-top: 10px"></svg>'),
    gradient = new _DataPivot_ColorGradientSVG(svg[0], min_color.val(), max_color.val());

  // add event-handlers to change gradient color
  min_color.change(function(v){gradient.update_start_color(min_color.val());});
  max_color.change(function(v){gradient.update_stop_color(max_color.val());});

  // add size values to size div
  var ps = div.find(".point-size"),
      min_max_ps = $('<p>').appendTo(ps);
  add_input_row(ps, "Minimum point-size", DataPivot.rangeInputDiv(min_size));
  add_input_row(ps, "Maximum point-size", DataPivot.rangeInputDiv(max_size));

  // add color values to color div
  var pc = div.find(".point-color"),
      min_max_pc = $('<p>').appendTo(pc);
  add_input_row(pc, 'Minimum color', min_color);
  add_input_row(pc, 'Maximum color', max_color);
  pc.append('<br>', svg);
  div.find('input[type="color"]').spectrum({"showInitial": true, "showInput": true});

  this.inputs.push(fieldName, conditionType,
                   min_size, max_size,
                   min_color, max_color);

  // get unique values and set values
  var buildStyleSelectors = function(){

    // show appropriate div
    var discrete = div.find(".discrete-style");
    self.discrete_styles = [];
    discrete.empty();

    var subset = DataPivot_visualization.filter(dp.data, dp.settings.filters, dp.settings.plot_settings.filter_logic),
        arr = subset.map(function(v){return v[fieldName.val()]; }),
        vals = DataPivot.getRowDetails(arr);

    if (conditionType.val() === "discrete-style"){

      // make map of current values
      var hash = d3.map();
      values.discrete_styles.forEach(function(v){
        hash.set(v.key, v.style);
      });

      vals.unique.forEach(function(v){
        var style = dp.style_manager
                      .add_select("symbols", hash.get(v))
                      .data('key', v);
        self.discrete_styles.push(style);
        add_input_row(discrete, 'Style for <i>{0}</i>:'.printf(v), style);
      });
    } else {
      var txt = 'Selected items in <i>{0}</i> '.printf(fieldName.val());
      if(vals.range){
        txt += "contain values ranging from {0} to {1}.".printf(vals.range[0], vals.range[1]);
      } else {
        txt += "have no range of values, please select another column.";
      }

      min_max_pc.html(txt);
      min_max_ps.html(txt);
    }
  }

  // add event-handlers and fire to initialize
  fieldName.on('change', buildStyleSelectors);
  conditionType.on('change', function(){
    buildStyleSelectors();
    changeConditionType();
  });

  changeConditionType();
  buildStyleSelectors();
};
_DataPivot_settings_conditional.prototype = {
  get_values: function(){
    var values = {"discrete_styles": []};
    this.inputs.forEach(function(v){
      values[v.attr('name')] = parseInt(v.val(), 10) || v.val();
    });
    this.discrete_styles.forEach(function(v){
      values.discrete_styles.push({ key: v.data("key"), style: v.val()});
    });
    return values;
  }
};


var _DataPivot_settings_linedata = function(data_pivot, index){
  var self = this,
      style_type = "lines",
      values = data_pivot.settings.dataline_settings[index];

  this.data_pivot = data_pivot;
  this.index = index;

  // create fields
  this.content = {
    "low_field_name": $('<select class="span12"></select>').html(this.data_pivot._get_header_options(true)),
    "high_field_name": $('<select class="span12"></select>').html(this.data_pivot._get_header_options(true)),
    "header_name": $('<input  class="span12" type="text">'),
    "marker_style": this.data_pivot.style_manager.add_select(style_type, values.marker_style)};

  // set default values
  this.content.low_field_name.find('option[value="{0}"]'.printf(values.low_field_name)).prop('selected', true);
  this.content.high_field_name.find('option[value="{0}"]'.printf(values.high_field_name)).prop('selected', true);
  this.content.header_name.val(values.header_name);

  var header_input = this.content.header_name;
  this.content.low_field_name.on('change', function(){
    header_input.val($(this).find('option:selected').val());
  });

  this.tr = $('<tr></tr>')
      .append($('<td></td>').append("<b>Low Range:</b><br>",
                                    this.content.low_field_name,
                                    '<br><b>High Range:</b><br>',
                                    this.content.high_field_name))
      .append($('<td></td>').append(this.content.header_name))
      .append($('<td></td>').append(this.content.marker_style))
      .on('change', 'input,select', function(v){
        self.data_push();

        // update legend
        var obj = {"line_index": index,
                   "label": self.content.header_name.val(),
                   "line_style": self.content.marker_style.find('option:selected').text()};
         self.data_pivot.legend.add_or_update_field(obj);
      });

  this.data_push();
  return this;
};
_DataPivot_settings_linedata.defaults = function(){
  return {
    "low_field_name": DataPivot.NULL_CASE,
    "high_field_name": DataPivot.NULL_CASE,
    "header_name": "",
    "marker_style": "base"
  };
};
_DataPivot_settings_linedata.prototype = {
  data_push: function(){
    var v = {
          "low_field_name": this.content.low_field_name.find('option:selected').val(),
          "high_field_name": this.content.high_field_name.find('option:selected').val(),
          "header_name": this.content.header_name.val(),
          "marker_style": this.content.marker_style.find('option:selected').text()
        };
    if (v.header_name === ''){v.header_name = v.low_field_name;}
    this.data_pivot.settings.dataline_settings[this.index] = v;
  }
};


var _DataPivot_settings_general = function(data_pivot, values){
  var self = this;
  this.data_pivot = data_pivot;
  this.values = values;

  // create fields
  this.content = {
    "plot_width": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.plot_width)),
    "minimum_row_height": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.minimum_row_height)),
    "title": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.title)),
    "axis_label": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.axis_label)),
    "show_xticks": $('<input type="checkbox">').prop('checked', values.show_xticks),
    "show_yticks": $('<input type="checkbox">').prop('checked', values.show_yticks),
    "font_style": $('<select></select>').append('<option value="Arial">Arial</option>',
                                                '<option value="Times New Roman">Times New Roman</option>'),
    "logscale": $('<input type="checkbox">').prop('checked', values.logscale),
    "domain": $('<input class="input-xlarge" title="Print the minimum value, a comma, and then the maximum value" type="text" value="{0}">'.printf(values.domain)),
    "padding_top": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.padding.top)),
    "padding_right": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.padding.right)),
    "padding_bottom": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.padding.bottom)),
    "padding_left": $('<input class="input-xlarge" type="text" value="{0}">'.printf(values.padding.left)),
    "merge_descriptions": $('<input type="checkbox">').prop('checked', values.merge_descriptions),
    "merge_until": $('<select name="merge_until">'),
    "text_background": $('<input type="checkbox">').prop('checked', values.text_background),
    "text_background_color": $('<input type="color">').val(values.text_background_color)
  };

  // set default values
  this.content.font_style.find('option[value="{0}"]'.printf(values.font_style)).prop('selected', true);
  this.update_merge_until();

  var build_tr = function(name, content){
    return $('<tr></tr>').append($('<th>{0}</th>'.printf(name)),
                                 $('<td></td>').append(content))
        .on('change', 'input,select', function(v){self.data_push();});
  };

  this.trs = [
      build_tr('Plot width', this.content.plot_width),
      build_tr('Minimum row height', this.content.minimum_row_height),
      build_tr('Font style', this.content.font_style),
      build_tr('Title', this.content.title),
      build_tr('X-axis label', this.content.axis_label),
      build_tr('Show x-axis ticks', this.content.show_xticks),
      build_tr('Show y-axis ticks', this.content.show_yticks),
      build_tr('Logscale', this.content.logscale),
      build_tr('Axis minimum and maximum<br>(ex: "1,100")', this.content.domain),
      build_tr('Plot padding top', this.content.padding_top),
      build_tr('Plot padding right', this.content.padding_right),
      build_tr('Plot padding bottom', this.content.padding_bottom),
      build_tr('Plot padding left', this.content.padding_left),
      build_tr('Merge descriptions', this.content.merge_descriptions),
      build_tr('Merge descriptions up to', this.content.merge_until),
      build_tr('Highlight background text', this.content.text_background),
      build_tr('Highlight background text color', this.content.text_background_color)];

  this.content.text_background_color
      .spectrum({"showInitial": true, "showInput": true});

  // display merge_until only when merge_descriptions activated
  var show_mergeUntil = function(){
    var show = self.content.merge_descriptions.prop('checked')
        row = self.content.merge_until.parent().parent();
    return (show) ? row.show() : row.hide();
  };
  this.content.merge_descriptions.on('change', show_mergeUntil);
  show_mergeUntil();

  this.data_push();
  return this;
};
_DataPivot_settings_general.prototype = {
  data_push: function(){
    this.values.plot_width = parseInt(this.content.plot_width.val(), 10);
    this.values.minimum_row_height = parseInt(this.content.minimum_row_height.val(), 10);
    this.values.font_style = this.content.font_style.find('option:selected').val();
    this.values.title = this.content.title.val();
    this.values.axis_label = this.content.axis_label.val();
    this.values.show_xticks = this.content.show_xticks.prop('checked');
    this.values.show_yticks = this.content.show_yticks.prop('checked');
    this.values.logscale = this.content.logscale.prop('checked');
    this.values.domain = this.content.domain.val();
    this.values.padding.top = parseInt(this.content.padding_top.val(), 10);
    this.values.padding.right = parseInt(this.content.padding_right.val(), 10);
    this.values.padding.bottom = parseInt(this.content.padding_bottom.val(), 10);
    this.values.padding.left = parseInt(this.content.padding_left.val(), 10);
    this.values.merge_descriptions = this.content.merge_descriptions.prop('checked');
    this.values.merge_until = parseInt(this.content.merge_until.val(), 10) || 0;
    this.values.text_background = this.content.text_background.prop('checked');
    this.values.text_background_color = this.content.text_background_color.val();
  },
  update_merge_until: function(){
    this.content.merge_until
      .html(this.data_pivot._get_description_options())
      .val(this.values.merge_until);
  }
};


var DataPivot_visualization = function(dp_data, dp_settings, plot_div, editable){
  // Metadata viewer visualization
  D3Plot.call(this); // call parent constructor
  this.editable = editable || false;
  this.dp_data = dp_data;
  this.dp_settings = dp_settings;
  this.plot_div = plot_div;
  this.set_defaults();
  this.build_plot();
  this.dpe = new DataPivotExtension();
  return this;
};
_.extend(DataPivot_visualization, {
  sorter: function(arr, sorts){

    var chunkify = function(t){
      var tz = [], x = 0, y = -1, n = 0, i, j;
      while(i = (j = t.charAt(x++)).charCodeAt(0)){
        var m = (i == 46 || (i >=48 && i <= 57));
        if (m !== n) {
          tz[++y] = "";
          n = m;
        }
        tz[y] += j;
      }
      return tz;
    }, alphanum = function(a, b){
      var field_name,
          ascending;

      for(var i=0; i<sorts.length; i++){

        field_name = sorts[i].field_name;
        ascending = sorts[i].ascending;

        if (a[field_name].toString() !== b[field_name].toString()){
          break;
        }
      }

      var aa = chunkify(a[field_name].toString()),
          bb = chunkify(b[field_name].toString());

      for (var x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
          var c = Number(aa[x]),
              d = Number(bb[x]);
          if (c == aa[x] && d == bb[x]) {
            if (ascending){
              return c - d;
            } else {
              return d - c;
            }
          } else {
            if (ascending){
              return (aa[x] > bb[x]) ? 1 : -1;
            } else {
              return (aa[x] < bb[x]) ? 1 : -1;
            }
          }
        }
      }

      if(ascending){
        return aa.length - bb.length;
      } else {
        return bb.length - aa.length;
      }
    };

    if (sorts.length>0){
      return arr.sort(alphanum);
    } else {
      return arr;
    }
  },
  filter: function(arr, filters, filter_logic){
    if(filters.length===0) return arr;

    var field_name, value, func,
        new_arr = [],
        included = d3.map(),
        filters_map = d3.map({
          lt: function(v){return v[field_name]<value;},
          lte: function(v){return v[field_name]<=value;},
          gt: function(v){return v[field_name]>value;},
          gte: function(v){return v[field_name]>=value;},
          contains: function(v){return v[field_name].toString().toLowerCase().search(value.toLowerCase())>=0;},
          not_contains: function(v){return v[field_name].toString().toLowerCase().search(value.toLowerCase())<0;},
          exact: function(v){return v[field_name].toString().toLowerCase() === value.toLowerCase();},
        }), isWithin = function(obj, arr){
          var within = false;
          arr.forEach(function(v){
            if(v===obj) within = true;
          });
          return within;
        };

    if(filter_logic==="and") new_arr = arr;

    for(var i=0; i<filters.length; i++){
      func = filters_map.get(filters[i].quantifier);
      field_name = filters[i].field_name;
      if(field_name === DataPivot.NULL_CASE) continue;
      value = filters[i].value;
      if (func){
        if(filter_logic==="and"){
          new_arr = new_arr.filter(func);
        } else {
          var vals = arr.filter(func);
          vals.forEach(function(v){ included.set(v._dp_pk, v); });
        }
      } else {
        console.log("Unrecognized filter: {0}".printf(filters[i].quantifier));
      }
    }

    if(filter_logic==="or") new_arr = included.values();

    return new_arr;
  },
  shouldInclude: function(row, bar, points){
    // Determine row inclusion. Rows can either be included by having any
    // single data-point field being numeric, OR, if both the low-range and
    // high-range fields are both true.
    if (_.some(points, function(d){ return $.isNumeric(row[d.field_name]); })) return true;
    return (($.isNumeric(row[bar.low_field_name])) && ($.isNumeric(row[bar.high_field_name])));
  }
});
_.extend(DataPivot_visualization.prototype, D3Plot.prototype, {
  set_defaults: function(){
    this.padding = $.extend({}, this.dp_settings.plot_settings.padding); //copy object
    this.padding.left_original = this.padding.left;
    this.w = this.dp_settings.plot_settings.plot_width;
    this.h = this.w;  // temporary; depends on rendered text-size
    this.textPadding = 5; // text padding on all sides of text

    var scale_type = (this.dp_settings.plot_settings.logscale) ? 'log' : 'linear',
        formatNumber = d3.format(",.f");

    this.text_spacing_offset = 10;
    this.x_axis_settings = {
      "scale_type": scale_type,
      "text_orient": "bottom",
      "axis_class": 'axis x_axis',
      "gridline_class": 'primary_gridlines x_gridlines',
      "number_ticks": 10,
      "axis_labels": true,
      "x_translate": 0,
      "label_format": formatNumber
    };

    this.y_axis_settings = {
      "scale_type": 'linear',
      "text_orient": 'left',
      "axis_class": 'axis y_axis',
      "gridline_class": 'primary_gridlines y_gridlines',
      "axis_labels": false,
      "x_translate": 0,
      "y_translate": 0,
      "label_format": undefined //default
    };
  },
  build_plot: function(){
    this.plot_div.html('');
    this.get_dataset();
    if (this.dp_data.length === 0 ){
      return HAWCUtils.addAlert("<strong>Error: </strong>no data are available to be plotted", this.plot_div);
    }
    if (this.datarows.length === 0 ){
      return HAWCUtils.addAlert("<strong>Error: </strong>data exists, but settings need to be modified (currently no rows are displayed).", this.plot_div);
    }
    this.build_plot_skeleton(true);
    this.set_font_style();
    this.layout_text();
    this.layout_plot();
    this.add_axes();
    this.draw_visualizations();
    this.add_final_rectangle();
    this.legend = new DataPivotLegend(
      this.vis,
      this.dp_settings.legend,
      this.dp_settings,
      {"offset": true, "editable": this.editable});
    this.add_menu();
    this.trigger_resize();
  },
  set_font_style: function(){
    var font;
    switch (this.dp_settings.plot_settings.font_style){
      case "Times New Roman":
        font = 'Times New Roman;';
        break;
      case "Arial":
      default:
        font = 'Arial;';
    }
    d3.select(this.svg).attr('style', 'font-family: {0}'.printf(font));
  },
  get_dataset: function(){
    var self = this,
        settings = {
          "datapoints": [],
          "bars": {},
          "descriptions": [],
          "sorts": [],
          "filters": [],
          "reference_lines": [],
          "reference_rectangles": [],
          "labels": [],
          "spacers": {},
          "spacer_lines": []},
        rows,
        get_associated_style = function(style_type, style_name){

          var defaults = {"symbols": StyleSymbol.default_settings,
                          "lines": StyleLine.default_settings,
                          "texts": StyleText.default_settings};

          return self.dp_settings.styles[style_type].filter(
              function(v){return v.name === style_name;})[0] ||
                  defaults[style_type]();
        };

    // unpack data-bars (expects only one bar)
    this.dp_settings.dataline_settings.forEach(function(datum){
      settings.bars.low_field_name = datum.low_field_name;
      settings.bars.high_field_name = datum.high_field_name;
      settings.bars.header_name = datum.header_name;
      settings.bars.marker_style = datum.marker_style;
    });

    // unpack datapoints and data bar settings
    this.dp_settings.datapoint_settings.forEach(function(datum){
      if (datum.field_name !== DataPivot.NULL_CASE){
        var copy = {};

        // get dpe settings (if any)
        if(datum.dpe !== DataPivot.NULL_CASE){
          DataPivotExtension.update_extensions(copy, datum.dpe);
        }

        // now, push extended settings values
        settings.datapoints.push($.extend(copy, datum));
      }
    });

    // unpack description settings
    this.dp_settings.description_settings.forEach(function(datum){
      if (datum.field_name !== DataPivot.NULL_CASE){
        var copy = {};
        // get dpe settings (if any)
        if(datum.dpe !== DataPivot.NULL_CASE){
          DataPivotExtension.update_extensions(copy, datum.dpe);
        }
        // now, push extended settings values
        settings.descriptions.push($.extend(copy, datum));
      }
    });

    var get_selected_fields = function(v){return v.field_name !== DataPivot.NULL_CASE;};
    settings.sorts = this.dp_settings.sorts.filter(get_selected_fields);
    settings.filters = this.dp_settings.filters.filter(get_selected_fields);

    // unpack reference lines
    this.dp_settings.reference_lines.forEach(function(datum){
      if($.isNumeric(datum.value)){
        settings.reference_lines.push({"style": get_associated_style("lines", datum.line_style),
                                       "x1": datum.value,
                                       "x2": datum.value});
      }
    });

    // unpack reference rectangles
    this.dp_settings.reference_rectangles.forEach(function(datum){
      if($.isNumeric(datum.x1) && $.isNumeric(datum.x2)){
        settings.reference_rectangles.push({"style": get_associated_style("rectangles", datum.rectangle_style),
                                            "x1": datum.x1,
                                            "x2": datum.x2});
      }
    });

    // unpack labels
    this.dp_settings.labels.forEach(function(d){
        d._style = get_associated_style("texts", d.style)
        settings.labels.push(d);
    });

    //build data-objects for visualization
    rows = _.chain(self.dp_data)
            .filter(
              _.partial(
                DataPivot_visualization.shouldInclude,
                _,
                settings.bars,
                self.dp_settings.datapoint_settings
              )
            )
            .map(function(d){
              // unpack any column-level styles
              var styles = {
                bars: get_associated_style("lines", settings.bars.marker_style)
              };

              _.chain(self.dp_settings.datapoint_settings)
                .filter(function(d){return d.field_name !== DataPivot.NULL_CASE})
                .each(function(d, i){
                  styles["points_" + i] = get_associated_style("symbols", d.marker_style);
              });

              _.chain(self.dp_settings.description_settings)
                .each(function(d, i){
                  styles["text_" + i] = get_associated_style("texts", d.text_style);
              });
              return _.extend(d, {"_styles": styles});
            })
            .value();

    rows = DataPivot_visualization.filter(rows, settings.filters,
                                          this.dp_settings.plot_settings.filter_logic);

    rows = DataPivot_visualization.sorter(rows, settings.sorts);

    // row-overrides: style, order
    this.dp_settings.row_overrides.forEach(function(v){
      // apply offsets
      if(v.offset !== 0){
        for(var i=0; i<rows.length; i++){
          if(rows[i]._dp_pk == v.pk){
            var new_off = i+v.offset;
            if (new_off >= rows.length) new_off = rows.length-1;
            if (new_off < 0) new_off = 0;
            rows.splice(new_off, 0, rows.splice(i, 1)[0]);
            break;
          }
        }
      }

      // apply style overrides
      if((v.text_style !== DataPivot.NULL_CASE) ||
         (v.line_style !== DataPivot.NULL_CASE) ||
         (v.symbol_style !== DataPivot.NULL_CASE)){
        rows.forEach(function(v2,i){
          if(v2._dp_pk === v.pk){
            for(var key in v2._styles){
              if((v.text_style !== DataPivot.NULL_CASE) && (key.substr(0,4) === "text")){
                v2._styles[key] = get_associated_style("texts", v.text_style);
              }

              if((v.line_style !== DataPivot.NULL_CASE) && (key === "bars")){
                v2._styles[key] = get_associated_style("lines", v.line_style);
              }

              if((v.symbol_style !== DataPivot.NULL_CASE) && (key.substr(0,6) === "points")){
                v2._styles[key] = get_associated_style("symbols", v.symbol_style);
              }
            }
          }
        });
      }
    });

    // row-overrides: remove (in separate loop, after offsets)
    this.dp_settings.row_overrides.forEach(function(v){
      if(v.include === false){
        for(var i=0; i<rows.length; i++){
          if(rows[i]._dp_pk === v.pk){
            rows.splice(i,1);
            break;
          }
        }
      }
    });

    // condition-formatting overrides
    this.dp_settings.datapoint_settings.forEach(function(datapoint, i){
      datapoint.conditional_formatting.forEach(function(cf){
        var arr = rows.map(function(d){return d[cf.field_name]; }),
            vals = DataPivot.getRowDetails(arr),
            styles = "points_" + i;

        switch(cf.condition_type){
          case "point-size":
            if (vals.range){
              var pscale = d3.scale.pow().exponent(0.5)
                    .domain(vals.range)
                    .range([cf.min_size, cf.max_size]);

              rows.forEach(function(d){
                if ($.isNumeric(d[cf.field_name])){
                  d._styles[styles] = $.extend({}, d._styles[styles]); //copy object
                  d._styles[styles].size = pscale( d[cf.field_name] );
                }
              });
            }
            break;
          case "point-color":
            if (vals.range){
              var cscale = d3.scale.linear()
                    .domain(vals.range)
                    .interpolate(d3.interpolateRgb)
                    .range([cf.min_color, cf.max_color]);

              rows.forEach(function(d){
                if ($.isNumeric(d[cf.field_name])){
                  d._styles[styles] = $.extend({}, d._styles[styles]); //copy object
                  d._styles[styles].fill = cscale( d[cf.field_name] );
                }
              });
            }
            break;
          case "discrete-style":

            var hash = d3.map();
            cf.discrete_styles.forEach(function(d){ hash.set(d.key, d.style); });

            rows.forEach(function(d){
              d._styles[styles] = get_associated_style("symbols", hash.get(d[cf.field_name]))
            });

            break;
          default:
            console.log("Unrecognized condition_type: {0}".printf(cf.condition_type));
        }

      });
    });

    // with final datarows subset, add index for rendered order
    rows.forEach(function(v, i){v._dp_index = i;})

    // unpack extra spacers
    this.dp_settings.spacers.forEach(function(v){
      settings.spacers["row_" + v.index] = v;
      if(v.show_line && v.index>0 && v.index<=rows.length){
        settings.spacer_lines.push({
          index: v.index-1,
          _styles: {bars: get_associated_style("lines", v.line_style)}
        });
      }
    });

    this.datarows = rows;
    this.merge_descriptions();

    this.title_str = this.dp_settings.plot_settings.title || "";
    this.x_label_text = this.dp_settings.plot_settings.axis_label || "";
    this.settings = settings;
    this.headers = this.settings.descriptions.map(function(v, i){
        return {"row": 0,
                "col": i,
                "text": v.header_name,
                "style": get_associated_style("texts", v.header_style),
                "cursor": "auto",
                "onclick": function(){},
                "max_width": v.max_width};
    });
  },
  merge_descriptions: function(){
    // Merge identical columns
    var field_names = this.dp_settings.description_settings.map(function(v){return v.field_name}),
        merge_until = this.dp_settings.plot_settings.merge_until || this.datarows.length-1;
    for(var i=this.datarows.length-1; i>0; i--){
      var isMerged = this.dp_settings.plot_settings.merge_descriptions;
      if(isMerged){
        // check if all columns are identical between this and the prior column
        for(var j=0; j<=merge_until; j++){
          if (this.datarows[i][field_names[j]] !== this.datarows[i-1][field_names[j]]){
            isMerged = false;
            break;
          }
        }
        // Merge if passed check
        if (isMerged){
          for(var j=0; j<=merge_until; j++){
            this.datarows[i][field_names[j]] = "";
          }
        }
      }
      this.datarows[i]._dp_isMerged = isMerged;
    }
  },
  add_axes: function(){
    var get_domain = function(self){
          var domain, fields;
          // use user-specified domain if valid
          domain = _.each(
            self.dp_settings.plot_settings.domain.split(","),
            _.partial(parseFloat, _, 10)
          );
          if ((domain.length === 2) && (_.all(domain, isFinite))) return domain;

          // calculate domain from data
          fields = _.pluck(self.settings.datapoints, "field_name");
          fields.push(self.settings.bars.low_field_name, self.settings.bars.high_field_name);
          return d3.extent(
            _.chain(self.datarows)
            .map(function(d){ return _.map(fields, function(f){ return d[f];}); })
            .flatten()
            .map(_.partial(parseFloat, _, 10))
            .value()
          )
        };

    $.extend(this.x_axis_settings, {
      gridlines: this.dp_settings.plot_settings.show_xticks,
      domain: get_domain(this),
      rangeRound: [0, this.w],
      y_translate: this.h
    });

    $.extend(this.y_axis_settings, {
      domain: [0, this.h],
      number_ticks: this.datarows.length,
      rangeRound: [0, this.h]
    });

    this.build_y_axis();
    this.build_x_axis();
  },
  build_background_rectangles: function(){
    var bgs = [],
        gridlines = [],
        y = this.y_scale,
        everyOther = true,
        self = this,
        pushBG = function(first, last){
          bgs.push({
            x: -self.text_width-self.padding.left,
            y: self.row_heights[first].min,
            w: self.text_width+self.padding.left,
            h: self.row_heights[last].max-self.row_heights[first].min
          });
        };

    if (this.datarows.length>0){
      first_index = 0;
      // starting with second-row, build rectangles
      for(var i=1; i<this.datarows.length; i++){
        if (!this.datarows[i]._dp_isMerged){
          if(everyOther) pushBG(first_index, i-1);
          everyOther = !everyOther;
          first_index = i;
          gridlines.push(self.row_heights[first_index].min);
        }
        // edge-case to push final-row if needed
        if (i === this.datarows.length-1 && everyOther) pushBG(first_index, i);
      }

    }
    this.bg_rectangles_data = (this.dp_settings.plot_settings.text_background) ? bgs : [];
    this.y_gridlines_data = (this.dp_settings.plot_settings.show_yticks) ? gridlines : [];
  },
  draw_visualizations: function(){

    var self = this,
        x = this.x_scale,
        y = this.y_scale,
        apply_styles = function(d) {
          var obj = d3.select(this);
          for (var property in d.style) {
            obj.style(property, d.style[property]);
          }
        }, apply_line_styles = function(d){
          var obj = d3.select(this);
          for (var property in d._styles.bars) {
            obj.style(property, d._styles.bars[property]);
          }
        }, apply_text_styles = function(obj, styles){
          obj = d3.select(obj);
          for (var property in styles) {
            obj.style(property, styles[property]);
          }
          if(styles.rotate>0){
            obj.attr("transform", "rotate({0} {1},{2})".printf(styles.rotate,
                                                               obj.attr("x"),
                                                               obj.attr("y")));
          }
        },
        cursor = (this.editable) ? "pointer": "auto",
        label_drag = (!this.editable) ? function(){} :
          HAWCUtils.updateDragLocationXY(function(x, y){
            var p = d3.select(this);
            p.data()[0].x = x;
            p.data()[0].y = y;
          }),
        title_drag = (!this.editable) ? function(){} :
          HAWCUtils.updateDragLocationXY(function(x, y){
            self.dp_settings.plot_settings.title_left = x;
            self.dp_settings.plot_settings.title_top = y;
          }),
        xlabel_drag = (!this.editable) ? function(){} :
          HAWCUtils.updateDragLocationXY(function(x, y){
            self.dp_settings.plot_settings.xlabel_left = x;
            self.dp_settings.plot_settings.xlabel_top = y;
          });


    // construct inputs for background rectangles and y-gridlines
    this.build_background_rectangles();

    // add text background rectangles behind text
    this.g_text_bg_rects = this.vis.append("g");
    this.text_bg_rects = this.g_text_bg_rects.selectAll()
        .data(this.bg_rectangles_data)
        .enter().append("rect")
            .attr("x", function(d){return d.x;})
            .attr("height", function(d){return d.h;})
            .attr("y", function(d){return d.y;})
            .attr("width", function(d){return d.w;})
            .style("fill", this.dp_settings.plot_settings.text_background_color);

    // add y-gridlines
    this.g_y_gridlines = this.vis.append("g")
        .attr("class", "primary_gridlines y_gridlines");
    this.y_gridlines = this.g_y_gridlines.selectAll()
        .data(this.y_gridlines_data)
      .enter().append("svg:line")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .attr("y1", function(d){return d;})
        .attr("y2", function(d){return d;})
        .attr("class", "primary_gridlines y_gridlines");

    // add x-range rectangles for areas of interest
    this.g_rects = this.vis.append("g");
    this.rects_of_interest = this.vis.selectAll("rect.rects_of_interest")
        .data(this.settings.reference_rectangles)
        .enter().append("rect")
            .attr("x", function(d){return x(d.x1);})
            .attr("height", this.h)
            .attr("y", 0).transition().duration(1000)
            .attr("width", function(d){return (x(d.x2)-x(d.x1));})
            .each(apply_styles);

    // draw reference lines
    this.g_reference_lines = this.vis.append("g");
    this.line_reference_lines = self.g_reference_lines.selectAll("line")
            .data(this.settings.reference_lines)
        .enter().append("svg:line")
            .attr("x1", function(v){return x(v.x1);})
            .attr("x2", function(v){return x(v.x2);})
            .attr("y1", 0).transition().duration(1000)
            .attr("y2", this.h)
            .each(apply_styles);

    // draw horizontal-spacer lines
    this.g_spacer_lines = this.vis.append("g");
    this.spacer_lines = self.g_spacer_lines.selectAll("line")
            .data(this.settings.spacer_lines)
        .enter().append("svg:line")
            .attr("x1", -this.text_width-this.padding.left)
            .attr("x2", this.w)
            .attr("y1", function(d){return self.row_heights[d.index].max;})
            .attr("y2", function(d){return self.row_heights[d.index].max;})
            .each(apply_line_styles);

    // Add bars

    // filter bars to include only bars where the difference between low/high
    // is greater than 0
    var bar_half_height = 5,
        bar_rows = this.datarows.filter(function(d){
        return ((d[self.settings.bars.high_field_name]-
                 d[self.settings.bars.low_field_name])>0);});

    this.g_bars = this.vis.append("g");
    this.dose_range_horizontal = this.g_bars.selectAll()
            .data(bar_rows)
        .enter().append("svg:line")
            .attr("x1", function(d){return x(d[self.settings.bars.low_field_name]);})
            .attr("x2", function(d){return x(d[self.settings.bars.high_field_name]);})
            .attr("y1", function(d){return self.row_heights[d._dp_index].mid;})
            .attr("y2", function(d){return self.row_heights[d._dp_index].mid;})
            .each(apply_line_styles);

    this.dose_range_lower_vertical = this.g_bars.selectAll()
            .data(bar_rows)
        .enter().append("svg:line")
            .attr("x1", function(d){return x(d[self.settings.bars.low_field_name]);})
            .attr("x2", function(d){return x(d[self.settings.bars.low_field_name]);})
            .attr("y1", function(d){return self.row_heights[d._dp_index].mid + bar_half_height;})
            .attr("y2", function(d){return self.row_heights[d._dp_index].mid - bar_half_height;})
            .each(apply_line_styles);

    this.dose_range_upper_vertical = this.g_bars.selectAll()
        .data(bar_rows)
        .enter().append("svg:line")
            .attr("x1", function(d){return x(d[self.settings.bars.high_field_name]);})
            .attr("x2", function(d){return x(d[self.settings.bars.high_field_name]);})
            .attr("y1", function(d){return self.row_heights[d._dp_index].mid + bar_half_height;})
            .attr("y2", function(d){return self.row_heights[d._dp_index].mid - bar_half_height;})
            .each(apply_line_styles);

    // add points
    this.g_dose_points = this.vis.append("g");
    this.settings.datapoints.forEach(function(datum, i){
      var numeric = self.datarows.filter(
              function(d){return d[datum.field_name] !== "";});

      self['points_' + i] = self.g_dose_points.selectAll()
            .data(numeric)
        .enter().append("path")
            .attr("d", d3.svg.symbol()
                .size(function(d){return d._styles['points_' + i].size;})
                .type(function(d){return d._styles['points_' + i].type;}))
            .attr("transform", function(d){
              return "translate({0},{1})".printf(x(d[datum.field_name]),
                                                 self.row_heights[d._dp_index].mid);
            }).each(function(d){
              var obj = d3.select(this);
              for (var property in d._styles['points_' + i]) {
                obj.style(property, d._styles['points_' + i][property]);
              }
            })
            .style('cursor', function(d){return(datum._dpe_datatype)?'pointer':'auto';})
            .on("click", function(d){if(datum._dpe_datatype){self.dpe.render_plottip(datum, d);}});
    });

    this.g_labels = this.vis.append("g");
    this.text_labels = this.g_labels.selectAll("text")
        .data(this.settings.labels)
      .enter().append("text")
          .attr('x', function(d){return d.x;})
          .attr('y', function(d){return d.y;})
          .text(function(d){return d.text;})
          .attr("cursor", cursor)
          .each(function(d){apply_text_styles(this, d._style);})
          .call(label_drag);

    this.add_title(this.dp_settings.plot_settings.title_left,
                   this.dp_settings.plot_settings.title_top);
    this.title
        .attr("cursor", cursor)
        .call(title_drag);

    this.build_x_label(this.dp_settings.plot_settings.xlabel_left,
                       this.dp_settings.plot_settings.xlabel_top);

    this.x_axis_label
        .attr("cursor", cursor)
        .call(xlabel_drag);
  },
  layout_text: function(){
    /*
     * Methodology for laying out a matrix of text in an SVG which requires
     * word-wrap. The working method is as follows. First, layout all text in
     * rows/columns, and get a matrix of objects which contains the element,
     * x-location, y-location, width, and height. Then, find the maximum width
     * in each column, and adjust x-location for each cell by column. Then, for
     * each row, find the maximum height for each row, and adjust the y-location
     * for each cell by column.
     */
    var self = this,
        apply_text_styles = function(obj, styles){
          obj = d3.select(obj);
          for (var property in styles) {
            obj.style(property, styles[property]);
          }
          if(styles.rotate>0){
            obj.attr("transform", "rotate({0} {1},{2})".printf(styles.rotate,
                                                               obj.attr("x"),
                                                               obj.attr("y")));
          }
        },
        matrix =[],
        row,
        textPadding = this.textPadding,
        left = this.padding.left,
        top = this.padding.top,
        min_row_height = this.dp_settings.plot_settings.minimum_row_height,
        midpoint_height,
        heights = [],
        height_offset;

    // build n x m array-matrix of text-component-data (including header, where):
    // n = number of rows, m = number of columns
    matrix = [this.headers];
    this.datarows.forEach(function(v, i){
      row = [];
      self.settings.descriptions.forEach(function(desc, j){
        var txt = v[desc.field_name];
        if($.isNumeric(txt) && (txt % 1 === 0)) txt = parseInt(txt, 10);
        row.push({
          "row": i+1,
          "col": j,
          "text": txt.toLocaleString(),
          "style": v._styles['text_' + j],
          "cursor": (desc._dpe_datatype)?'pointer':'auto',
          "onclick": function(){
            if(desc._dpe_datatype)self.dpe.render_plottip(desc, v);
          }
        })
      });
      matrix.push(row);
    });

    // naively layout components
    this.g_text_columns = d3.select(this.svg).append("g").attr("class", "text_g");

    this.text_rows = this.g_text_columns.selectAll("g")
        .data(matrix)
      .enter().append("g")
        .attr("class", "text_row");

    this.text_rows.selectAll("text")
        .data(function(d) { return d; })
      .enter().append("text")
          .attr("x", 0)
          .attr("y", 0)
          .text(function(d){return d.text;})
          .style("cursor", function(d){return d.cursor;})
          .on("click", function(d){return d.onclick();})
          .each(function(d){apply_text_styles(this, d.style);});

    // apply wrap text method
    this.headers.forEach(function(v,i){
      var sel = self.g_text_columns
                    .selectAll("text")
                    .filter(function(v){return v.col===i});
      if (v.max_width) _.each(sel[0], _.partial(HAWCUtils.wrapText, _, v.max_width));

      // get maximum column dimension and layout columns
      v.widths = d3.max(sel[0].map(function(v){return v.getBBox().width;}));
      sel.each(function(){
        var val = d3.select(this),
            anchor = val.style('text-anchor');
        if(anchor === "end"){
          val.attr("x", left+v.max_width);
          val.selectAll('tspan').attr("x", left+v.widths);
        } else if (anchor==="middle"){
          var width = v.max_width || v.widths;  // use max_width in case of overflow
          val.attr("x", left+width/2);
          val.selectAll('tspan').attr("x", left+width/2);
        } else { // default: left-aligned
          val.attr("x", left);
          val.selectAll('tspan').attr("x", left);
        }
      });
      left += v.widths + 2*textPadding;
    });

    // get maximum row dimension and layout rows
    var merged_row_height,
        extra_space,
        prior_extra = 0,
        text_rows = this.text_rows.selectAll('text');

    text_rows.forEach(function(v, i){
      for(var j=0; j<v.length; j++){
        var val = d3.select(v[j]);
        val.attr("y", textPadding+top);
        val.selectAll('tspan').attr("y", textPadding+top);
      }
      // get maximum-height of rendered text, and row-height
      var cellHeights = v.map(function(v){return v.getBBox().height;}),
          actual_height = d3.max(cellHeights),
          row_height = d3.max([min_row_height, actual_height]);

      // Peek-ahead and see if other rows are merged with this row; if so we may
      // want to adjust the actual row-height to allow for even spacing.
      // Only check for data rows (not header rows)
      if (i>0 && !self.datarows[i-1]._dp_isMerged){
        var numRows = 1, min_height = 0;
        for(var j=i+1; j<self.datarows.length; j++){

          // the row height should be the maximum-height of a non-merged cell
          if(j===i+1){
            text_rows[j]
              .map(function(v){ return v.getBBox().height; })
              .forEach(function(d,i){
                if (d>0) min_height = Math.max(min_height, cellHeights[i]);
            });
          }

          if(!self.datarows[j]._dp_isMerged) break;
          numRows +=1;
        }
        var extra = (actual_height-min_row_height);
        if (numRows === 1){
          merged_row_height = actual_height;
        } else if ((extra/numRows)<min_row_height){
          merged_row_height = min_row_height;
        } else {
          merged_row_height = min_row_height + extra/numRows;
        }
        row_height = Math.max(min_height, merged_row_height);
      }

      // add spacer if needed
      var spacer = self.settings.spacers["row_" + i];
      extra_space = (spacer && spacer.extra_space) ? min_row_height/2 : 0;

      // get the starting point for the top-row and offset all dimensions from this
      if (i===1) height_offset = top;

      // save object of relative heights of data rows, with-respect to first-data row
      if (i>0){
        heights.push({
          min: top - height_offset - prior_extra,
          mid: top - height_offset + textPadding + row_height/2,
          max: top - height_offset + row_height + 2*textPadding + extra_space
        });
      }

      //adjust height of next row
      top += row_height + 2*textPadding + 2*extra_space;

      // set for next row
      prior_extra = extra_space;
    });

    // remove blank text elements; can mess-up size calculations
    $(
      _.filter(
        this.g_text_columns.selectAll('text')[0],
          function(d){return d.textContent.length===0;}
      )
    ).remove();

    // calculate plot-height, text-width, and save heights array
    var textDim = this.g_text_columns.node().getBBox();
    this.text_width = textDim.width + textDim.x;
    this.h = heights[heights.length-1].max
    this.row_heights = heights;
  },
  layout_plot: function(){
    // Top-location to equal to the first-data row
    // Left-location to equal size of text plus left-padding
    var headerDims = this.g_text_columns.selectAll("g")[0][1].getBBox(),
        top = headerDims.y-this.textPadding,
        textDims = this.g_text_columns.node().getBBox(),
        left = textDims.width + textDims.x + this.padding.left;

    this.vis.attr("transform", "translate({0},{1})".printf(left, top));
    this.vis.select('.dp_bg').attr("height", this.h);

    // resize SVG to account for new size
    var svgDims = this.svg.getBBox(),
        w = svgDims.width  + svgDims.x + this.padding.right,
        h = svgDims.height + svgDims.y + this.padding.bottom;
    d3.select(this.svg)
      .attr("width", w)
      .attr("height", h)
      .attr("viewBox", "0 0 {0} {1}".printf(w, h));

    this.full_width = w;
    this.full_height = h;
  }
});


DataPivotExtension = function(){};
_.extend(DataPivotExtension, {
  update_extensions: function(obj, key){
    var map = d3.map({
          "study":            {_dpe_key: "Study HAWC ID",        _dpe_datatype: "study", _dpe_cls: Study},
          "experiment":       {_dpe_key: "Experiment ID",        _dpe_datatype: "experiment", _dpe_cls: Experiment},
          "animal_group":     {_dpe_key: "Animal Group ID",      _dpe_datatype: "animal_group", _dpe_cls: AnimalGroup},
          "endpoint":         {_dpe_key: "Endpoint Key",         _dpe_datatype: "endpoint", _dpe_cls: Endpoint, options: {complete: false}},
          "endpoint_complete":{_dpe_key: "Endpoint Key",         _dpe_datatype: "endpoint", _dpe_cls: Endpoint, options: {complete: true}},
          "study_population": {_dpe_key: "Study Population Key", _dpe_datatype: "study_population", _dpe_cls: StudyPopulation},
          "exposure":         {_dpe_key: "Exposure Key",         _dpe_datatype: "exposure", _dpe_cls: Exposure},
          "assessed_outcome": {_dpe_key: "Assessed Outcome Key", _dpe_datatype: "assessed_outcome", _dpe_cls: AssessedOutcome},
          "meta_protocol":    {_dpe_key: "Protocol Primary Key", _dpe_datatype: "meta_protocol", _dpe_cls: MetaProtocol},
          "meta_result":      {_dpe_key: "Result Primary Key",   _dpe_datatype: "meta_result", _dpe_cls: MetaResult},
          "iv_chemical":      {_dpe_key: "Chemical HAWC ID",     _dpe_datatype: "iv_chemical", _dpe_cls: IVChemical},
          "iv_experiment":    {_dpe_key: "IVExperiment HAWC ID", _dpe_datatype: "iv_experiment", _dpe_cls: IVExperiment},
          "iv_endpoint":      {_dpe_key: "IVEndpoint HAWC ID",   _dpe_datatype: "iv_endpoint", _dpe_cls: IVEndpoint}
        }),
        match = map.get(key);

    if (match){
      $.extend(obj, match);
    } else {
      console.log("Unrecognized DPE key: {0}".printf(key));
    }
  },
  get_options: function(dp){
    // extension options dependent on available data-columns
    var opts = ['<option value="{0}">{0}</option>'.printf(DataPivot.NULL_CASE)];

    if (dp.data.length>0){
      var headers = d3.set(d3.map(dp.data[0]).keys()),
          options = d3.map({
            "Study HAWC ID":        ['<option value="study">Show Study</option>'],
            "Study Population Key": ['<option value="study_population">Show Study Population</option>'],
            "Exposure Key":         ['<option value="exposure">Show Exposure</option>'],
            "Protocol Primary Key": ['<option value="meta_protocol">Show Epidemiology Meta-Protocol</option>'],
            "Result Primary Key":   ['<option value="meta_result">Show Epidemiology Meta-Result</option>'],
            "Experiment ID":        ['<option value="experiment">Show Experiment</option>'],
            "Animal Group ID":      ['<option value="animal_group">Show Animal Group</option>'],
            "Endpoint Key":         [
              '<option value="endpoint">Show Endpoint</option>',
              '<option value="endpoint_complete">Show Endpoint Complete Summary</option>'
            ],
            "Assessed Outcome Key": ['<option value="assessed_outcome">Show Assessed Outcome</option>'],
            "Chemical HAWC ID":     ['<option value="iv_chemical">Show In Vitro Chemical</option>'],
            "IVExperiment HAWC ID": ['<option value="iv_experiment">Show In Vitro Experiment</option>'],
            "IVEndpoint HAWC ID":   ['<option value="iv_endpoint">Show In Vitro Endpoint</option>'],
          });

      options.entries().forEach(function(v){
        if(headers.has(v.key)) opts.push.apply(opts, v.value);
      });
    }
    return opts;
  }
});
DataPivotExtension.prototype = {
  render_plottip: function(settings, datarow){
    var Cls = settings._dpe_cls,
        key = settings._dpe_key,
        options = settings.options
    Cls.displayAsModal(datarow[key], options);
  }
};


var StyleManager = function(pivot){
  this.pivot = pivot;
  this.styles = {"symbols":[], "lines": [], "texts": [], "rectangles": []};
  this.selects = {"symbols": [], "lines": [], "texts": [], "rectangles": []};
  this.se = {};

  //unpack styles
  var self = this;
  this.pivot.settings.styles.symbols.forEach(function(v){
    self.styles.symbols.push(new StyleSymbol(self, v, false));
  });
  this.pivot.settings.styles.lines.forEach(function(v){
    self.styles.lines.push(new StyleLine(self, v, false));
  });
  this.pivot.settings.styles.texts.forEach(function(v){
    self.styles.texts.push(new StyleText(self, v, false));
  });
  this.pivot.settings.styles.rectangles.forEach(function(v){
    self.styles.rectangles.push(new StyleRectangle(self, v, false));
  });
};
StyleManager.prototype = {
  add_select: function(style_type, selected_style, include_null){

    var select = $('<select class="span12"></select>').html(this._build_options(style_type));
    if(include_null){
      select.prepend('<option value="{0}">{0}</option>'.printf(DataPivot.NULL_CASE));
    }
    if(selected_style){
      select.find('option[value="{0}"]'.printf(selected_style)).prop('selected', true);
    }
    this.selects[style_type].push(select);
    return select;
  },
  update_selects: function(style_type){
    for(var i=0; i<this.selects[style_type].length; i++){
      var select = this.selects[style_type][i],
          sel = select.find('option:selected').val();
      select.html(this._build_options(style_type));
      select.find('option[value="{0}"]'.printf(sel)).prop('selected', true);
    }
  },
  _build_options: function(style_type){
    var options=[];
    this.styles[style_type].forEach(function(v){
      options.push($('<option value="{0}">{0}</option>'.printf(v.settings.name)).data('d', v));
    });
    return options;
  },
  build_styles_crud: function(style_type){
    // components
    var self = this,
        container = $('<div class="row-fluid"></div>'),
        title = $('<h3>{0}</h3>'.printf(style_type)),
        style_div = $('<div class="row-fluid"></div>'),
        form_div = $('<div class="span6"></div>'),
        vis_div = $('<div class="span6"></div>'),
        d3_div = $('<div></div>'),
        modal = $('<div class="modal hide fade">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '<h3></h3>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<div class="style_fields"></div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Close</a>' +
                    '</div>' +
                  '</div>'),
        button_well = $('<div class="well"></div>');

    // functionality
    var get_style = function(){
          return style_selector.find('option:selected').data('d');
        },
        load_style = function(){
          // load style into details portion of Styles tab
          var style = get_style();
          if(!self.se[style_type]){
            self.se[style_type] = new StyleViewer(d3_div, style);
          } else {
            self.se[style_type].update_style_object(style);
          }
        },
        new_style = function(){
          var func;
          switch(style_type){
            case "symbols":
              func = StyleSymbol;
              break;
            case "lines":
              func = StyleLine;
              break;
            case "texts":
              func = StyleText;
              break;
            case "rectangles":
              func = StyleRectangle;
              break;
          }
          var style = new func(self, undefined, true);
          modal.modal('show');
          style.draw_modal(modal);
        },
        edit_style = function(){
          var style = get_style();
          modal.modal('show');
          style.draw_modal(modal);
        },
        delete_style = function(){
          var style = get_style(), i;

          // remove from settings
          for(i=0; i<self.pivot.settings.styles[style_type].length; i++){
            if (self.pivot.settings.styles[style_type][i] === style.settings){
              self.pivot.settings.styles[style_type].splice(i, 1);
              break;
            }
          }

          // remove from style objects
          for(i=0; i<self.styles[style_type].length; i++){
            if (self.styles[style_type][i] === style){
              self.styles[style_type].splice(i, 1);
              break;
            }
          }

          delete style;

          // load next available style and update selects
          load_style();
          self.update_selects(style_type);
        },
        save_style = function(){
            var style = modal.data('d');
            if (self.save_settings(style, style_type)){
              self.update_selects(style_type);
              style_selector
                  .find('option[value="{0}"]'.printf(style.settings.name))
                  .prop('selected', true);
              modal.modal('hide');
            }
        };

    // create buttons and event-bindings
    var style_selector = this.add_select(style_type).on('change', load_style),
        button_new_style = $('<button style="margin-right:5px" class="btn btn-primary">New style</button>').click(new_style),
        button_edit_style = $('<button style="margin-right:5px" class="btn btn-info">Edit selected style</button>').click(edit_style),
        button_delete_style = $('<button style="margin-right:5<p></p>px" class="btn btn-danger">Delete selected style</button>').click(delete_style);

    modal.find('.modal-footer')
         .prepend($('<a href="#" class="btn btn-primary">Save and close</a>')
            .click(save_style));
    modal.on('hidden', load_style);

    // put all the pieces together
    form_div.html(['<h4>Select styles</h4>', style_selector]);
    button_well.append(
        button_new_style,
        button_edit_style,
        button_delete_style);
    style_div.append(form_div, vis_div.append('<h4>Style visualization</h4>', d3_div));
    container.html([title, style_div, modal, button_well]);

    load_style(); // load with initial style

    return container;
  },
  save_settings: function(style_object, style_type){

    var self = this,
        new_styles = style_object.get_modified_settings(),
        isNameUnique = function(style_type, name, style_object){
          var unique = true;
          self.styles[style_type].forEach(function(v){
            if((v.settings.name===name) && (v !== style_object)) unique=false;
          });
          return unique;
        };

    if (!isNameUnique(style_type, new_styles.name, style_object)){
      alert("Error - style name must be unique!");
      return false;
    }

    for(var field in new_styles){
      if(style_object.settings.hasOwnProperty(field)){
        style_object.settings[field] = new_styles[field];
      }
    }

    if (style_object.isNew){
      style_object.isNew = false;
      this.styles[style_type].push(style_object);
      this.pivot.settings.styles[style_type].push(style_object.settings);
    }

    return true;
  }
};


DataPivotLegend = function(vis, settings, dp_settings, options){
  this.vis = vis;
  this.settings = settings;
  this.dp_settings = dp_settings;
  this.selects = [];
  this.options = options || {"offset": false};
  if(this.settings.show) this._draw_legend();
};
DataPivotLegend.default_settings = function(){
  return {
    "show": true,
    "left": 5,
    "top": 5,
    "columns": 1,
    "style": {"border_color": "#666", "border_width": "2px"},
    "fields": []
  };
};
DataPivotLegend.prototype = {
  add_select: function(){
    var select = $('<select></select>').html(this._build_options());
    this.selects.push(select);
    return select;
  },
  _update_selects: function(){
    for(var i=0; i<this.selects.length; i++){
        var select = this.selects[i],
            sel = select.find('option:selected').val();
        select.html(this._build_options());
        select.find('option[value="{0}"]'.printf(sel)).prop('selected', true);
    }
  },
  _build_options: function(){
    var self = this;
    return this.settings.fields.map(function(v){
      return $('<option value="{0}">{0}</option>'.printf(v.label)).data('d', v);
    });
  },
  _draw_legend: function(){

    if(this.legend){
      this.legend.remove();
      delete this.legend;
    }

    var self = this,
        cursor = (this.options.editable) ? "pointer" : "auto",
        buffer = 5,
        apply_styles = function(d) {
          var obj = d3.select(this);
          for (var property in d.style) {
            obj.style(property, d.style[property]);
          }
        },
        drag = (!this.options.editable) ? function(){} :
        HAWCUtils.updateDragLocationTransform(function(x, y){
          self.settings.left = x;
          self.settings.top = y;
        });

    this.legend = this.vis.append("g");

    if (this.options.offset){
      this.legend.attr("cursor", cursor)
          .attr("transform", "translate({0},{1})".printf(self.settings.left, self.settings.top))
          .call(drag);
    }

    this.legend.append("svg:rect")
        .attr("stroke-width", this.settings.style.border_width)
        .attr("stroke", this.settings.style.border_color)
        .attr("fill", "white")
        .attr("height", 10)
        .attr("width", 10);

    var vertical_spacing = 22,
        text_x_offset = 24,
        columns = this.settings.columns,
        rows = Math.ceil(this.settings.fields.length/columns),
        style, colg, row_index;

    this.legend_columns = [];

    // add bars
    this.settings.fields.forEach(function(datum, i){

      if(i%rows === 0){
        colg = self.legend.append("g");
        self.legend_columns.push(colg);
        row_index = 0;
      }

      // add line
      if(datum.line_style !== DataPivot.NULL_CASE){
        style = self._get_line_style(datum);
        colg.selectAll()
            .data([{"x1":buffer,
                    "x2":buffer+text_x_offset,
                    "y1":((row_index+0.5)*vertical_spacing),
                    "y2":((row_index+0.5)*vertical_spacing),
                    "style": style},
                    {"x1":buffer,
                     "x2":buffer,
                     "y1":((row_index+0.25)*vertical_spacing),
                     "y2":((row_index+0.75)*vertical_spacing),
                     "style": style},
                    {"x1":buffer+text_x_offset,
                     "x2":buffer+text_x_offset,
                     "y1":((row_index+0.25)*vertical_spacing),
                     "y2":((row_index+0.75)*vertical_spacing),
                     "style": style}])
            .enter().append("svg:line")
                .attr("x1", function(v){return v.x1;})
                .attr("x2", function(v){return v.x2;})
                .attr("y1", function(v){return v.y1;})
                .attr("y2", function(v){return v.y2;})
                .each(apply_styles);
      }

      // add symbol
      if(datum.symbol_style !== DataPivot.NULL_CASE){
        style = self._get_symbol_style(datum);
        colg.selectAll()
            .data([{"x": buffer+text_x_offset/2,
                    "y": ((row_index+0.5)*vertical_spacing),
                    "style": style}])
            .enter().append("path")
              .attr("d", d3.svg.symbol()
                  .size(style.size)
                  .type(style.type))
              .attr("transform", function(d){
                  return "translate(" + (d.x) + "," + (d.y) + ")";
              }).each(apply_styles);
      }

      // add text
      colg.selectAll()
          .data([self.settings.fields[i]])
          .enter()
          .append("svg:text")
              .attr("x", 2*buffer+text_x_offset)
              .attr("class", "legend_text")
              .attr("dy", "3.5px")
              .attr("y", function(d){return ((row_index+0.5)*vertical_spacing);})
              .text(function(d){return d.label;});

      row_index += 1;
    });

    var offset=0;
    for(var i=1; i<this.legend_columns.length; i++){
      offset += this.legend_columns[i-1].node().getBoundingClientRect().width + buffer;
      this.legend_columns[i].attr("transform",
          function(){return "translate(" + (offset) + ",0)";});
    }

    var resize_legend = function(){
      var dim = self.legend.node().getBoundingClientRect();
      self.legend.select('rect')
          .attr('width', dim.width+buffer)
          .attr('height', dim.height+buffer);
    };

    resize_legend();
  },
  add_or_update_field: function(obj, legend_item){
    var self = this;

    if(isFinite(obj.symbol_index)){
      legend_item=this.settings.fields.filter(function(v){return v.symbol_index === obj.symbol_index;})[0];
    }

    if(isFinite(obj.line_index)){
      legend_item=this.settings.fields.filter(function(v){return v.line_index === obj.line_index;})[0];
    }

    if(legend_item){
      for(var key in obj){legend_item[key] = obj[key];}
    } else {
      if(!obj.line_style) obj.line_style = DataPivot.NULL_CASE;
      if(!obj.symbol_style) obj.symbol_style = DataPivot.NULL_CASE;
      this.settings.fields.push(obj);
    }
    this._update_selects();
  },
  _get_symbol_style: function(field){
    return this.dp_settings.styles.symbols.filter(
        function(v){return v.name === field.symbol_style;})[0] ||
            StyleSymbol.default_settings();
  },
  _get_line_style: function(field){
    return this.dp_settings.styles.lines.filter(
        function(v){return v.name === field.line_style;})[0] ||
            StyleLine.default_settings();
  },
  move_field: function(obj, offset){
    var fields = this.settings.fields;
    for(var i=0; i<fields.length; i++){
      if(fields[i] === obj){
        var new_off = i+offset;
        if (new_off >= fields.length) new_off = fields.length-1;
        if (new_off < 0) new_off = 0;
        fields.splice(new_off, 0, fields.splice(i, 1)[0]);
        return;
      }
    }
    this._update_selects();
  },
  delete_field: function(obj){
    for(var i=0; i<this.settings.fields.length; i++){
      if(this.settings.fields[i] === obj){
        this.settings.fields.pop(i);
        break;
      }
    }
    this._update_selects();
  }
};


var StyleSymbol = function(style_manager, settings, isNew){
  this.type = "symbol";
  this.isNew = isNew;
  this.style_manager = style_manager;
  this.settings = settings || StyleSymbol.default_settings();
  return this;
};
StyleSymbol.default_settings = function(){
  return {
    "name": "base",
    "type": "circle",
    "size": 130,
    "fill": "#000",
    "fill-opacity": 1.0,
    "stroke": "#fff",
    "stroke-width": 1
  };
};
StyleSymbol.prototype = {
  draw_modal: function($modal){
    this.$modal = $modal;
    this._draw_setting_controls();
    this.$modal.find('.style_fields').html(this.controls);
    this.$modal.find('.style_fields input[type="color"]')
        .spectrum({"showInitial": true, "showInput": true});
    $modal.data('d', this);
  },
  get_modified_settings: function(){
    var settings = {},
      fields = ['name', 'size', 'fill', 'fill-opacity', 'stroke', 'stroke-width'];
    for(var i=0; i<fields.length; i++){
      settings[fields[i]] = this.$modal.find('input[name="{0}"]'.printf(fields[i])).val();
    }
    settings.type = this.$modal.find('select[name="type"] option:selected').val();
    return settings;
  },
  _draw_setting_controls: function(){
    var form = $('<form class="form-horizontal"></form>'),
        set = this.settings,
        add_horizontal_field = function(label_text, html_obj){
          return $('<div class="control-group"></div>')
              .append('<label class="control-label">{0}</label>'.printf(label_text))
              .append( $('<div class="controls"></div>').append(html_obj));
        },
        image_div = $('<div></div>'),
        sv = new StyleViewer(image_div, this),
        self = this;

    //image
    form.append(image_div).on('change', 'input,select', function(){
      sv.apply_new_styles(self.get_modified_settings(), true);
    });

    //name
    var name_field = $('<input name="name" type="text">').val(set.name).change(update_title);
    form.append(add_horizontal_field('Name', name_field));
    var update_title = function(){
      self.$modal.find('.modal-header h3').html(name_field.val());
    };
    update_title();

    //size
    form.append(add_horizontal_field('Size',
         DataPivot.rangeInputDiv($('<input name="size" type="range" min="0" max="500" step="5" value="{0}">'
            .printf(set.size)))));

    //type
    var type = $('<select name="type"></select>').html([
        '<option value="circle">circle</option>',
        '<option value="cross">cross</option>',
        '<option value="diamond">diamond</option>',
        '<option value="square">square</option>',
        '<option value="triangle-down">triangle-down</option>',
        '<option value="triangle-up">triangle-up</option>',
       ]);

    type.find('option[value="{0}"]'.printf(set.type)).prop('selected', true);
    form.append(add_horizontal_field('Type', type));

    //fill
    form.append(add_horizontal_field('Fill',
        $('<input name="fill" type="color" value="{0}">'
            .printf(set.fill))));

    //fill-opacity
    form.append(add_horizontal_field('Fill-opacity',
         DataPivot.rangeInputDiv($('<input name="fill-opacity" type="range" min="0" max="1" step="0.05" value="{0}">'
            .printf(set["fill-opacity"])))));

    //stroke
    form.append(add_horizontal_field('Stroke',
        $('<input name="stroke" type="color" value="{0}">'
            .printf(set.stroke))));

    //stroke-width
    form.append(add_horizontal_field('Stroke-width',
         DataPivot.rangeInputDiv($('<input name="stroke-width" type="range" min="0" max="10" step="0.5" value="{0}">'
            .printf(set["stroke-width"])))));


    this.controls = form;
  }
};


var StyleText = function(style_manager, settings, isNew){
  this.type = "text";
  this.isNew = isNew;
  this.style_manager = style_manager;
  this.settings = settings || StyleText.default_settings();
  return this;
};
_.extend(StyleText, {
  default_settings: function(){
    return {
      "name": "base",
      "font-size": "12px",
      "font-weight": "normal",
      "fill": "#000",
      "text-anchor": "start",
      "rotate" : "0",
      "fill-opacity": 1
    };
  },
  default_header: function(){
    return {
      "name": "header",
      "font-size": "12px",
      "font-weight": "bold",
      "fill": "#000",
      "text-anchor": "middle",
      "rotate": "0",
      "fill-opacity": 1
    };
  },
  default_title: function(){
    return {
      "name": "title",
      "font-size": "12px",
      "font-weight": "bold",
      "fill": "#000",
      "text-anchor": "middle",
      "rotate" : "0",
      "fill-opacity": 1
    };
  }
});
StyleText.prototype = {
  draw_modal: function($modal){
    this.$modal = $modal;
    this._draw_setting_controls();
    this.$modal.find('.style_fields').html(this.controls);
    this.$modal.find('.style_fields input[type="color"]')
        .spectrum({"showInitial": true, "showInput": true});
    $modal.data('d', this);
  },
  get_modified_settings: function(){
    var settings = {},
        fields = ['name', 'font-size', 'fill', 'fill-opacity', 'rotate'];
    for(var i=0; i<fields.length; i++){
      settings[fields[i]] = this.$modal.find('input[name="{0}"]'.printf(fields[i])).val();
    }
    settings['font-size'] = settings['font-size'] + 'px';
    settings['text-anchor'] = this.$modal.find('select[name="text-anchor"] option:selected').val();
    settings['font-weight'] = this.$modal.find('select[name="font-weight"] option:selected').val();
    return settings;
  },
  _draw_setting_controls: function(){
    var form = $('<form class="form-horizontal"></form>'),
        set = this.settings,
        add_horizontal_field = function(label_text, html_obj){
          return $('<div class="control-group"></div>')
              .append('<label class="control-label">{0}</label>'.printf(label_text))
              .append( $('<div class="controls"></div>').append(html_obj));
        },
        image_div = $('<div></div>'),
        sv = new StyleViewer(image_div, this),
        self = this;

    //image
    form.append(image_div).on('change', 'input,select', function(){
      sv.apply_new_styles(self.get_modified_settings(), true);
    });

    //name
    var name_field = $('<input name="name" type="text">').val(set.name).change(update_title);
    form.append(add_horizontal_field('Name', name_field));
    var update_title = function(){
      self.$modal.find('.modal-header h3').html(name_field.val());
    };
    update_title();

    //size
    form.append(add_horizontal_field('Font Size',
         DataPivot.rangeInputDiv($('<input name="font-size" type="range" min="8" max="20" step="1" value="{0}">'
            .printf(parseInt(set['font-size'], 10))))));

    //fill
    form.append(add_horizontal_field('Fill',
        $('<input name="fill" type="color" value="{0}">'.printf(set.fill))));

    //fill opacity
    form.append(add_horizontal_field('Fill opacity',
         DataPivot.rangeInputDiv($('<input name="fill-opacity" type="range" min="0" max="1" step="0.05" value="{0}">'.printf(set['fill-opacity'])))));

    //text-anchor
    var text_anchor = $('<select name="text-anchor"></select>')
        .html(['<option value="start">start</option>',
               '<option value="middle">middle</option>',
               '<option value="end">end</option>']);
    text_anchor.find('option[value="{0}"]'.printf(set['text-anchor'])).prop('selected', true);
    form.append(add_horizontal_field('Type', text_anchor));

    //text-anchor
    var font_weight = $('<select name="font-weight"></select>')
        .html(['<option value="normal">normal</option>',
               '<option value="bold">bold</option>']);
    font_weight.find('option[value="{0}"]'.printf(set['font-weight'])).prop('selected', true);
    form.append(add_horizontal_field('Type', font_weight));

    //rotate
    form.append(add_horizontal_field('Rotation',
         DataPivot.rangeInputDiv($('<input name="rotate" type="range" min="0" max="360" step="15" value="{0}">'
            .printf(set.rotate)))));

    this.controls = form;
  }
};


var StyleLine = function(style_manager, settings, isNew){
  this.type = "line";
  this.isNew = isNew;
  this.style_manager = style_manager;
  this.settings = settings || StyleLine.default_settings();
  return this;
};
_.extend(StyleLine, {
  default_settings: function(){
    return {
      "name": "base",
      "stroke": "#708090",
      "stroke-dasharray": "none",
      "stroke-opacity": 0.9,
      "stroke-width": 3
    };
  },
  default_reference_line: function(){
    return {
      "name": "reference line",
      "stroke": "#00000",
      "stroke-dasharray": "none",
      "stroke-opacity": 0.8,
      "stroke-width": 2,
    };
  }
});
StyleLine.prototype = {
  draw_modal: function($modal){
    this.$modal = $modal;
    this._draw_setting_controls();
    this.$modal.find('.style_fields').html(this.controls);
    this.$modal.find('.style_fields input[type="color"]')
        .spectrum({"showInitial": true, "showInput": true});
    $modal.data('d', this);
  },
  get_modified_settings: function(){
    var settings = {},
        fields = ['name', 'stroke', 'stroke-width', 'stroke-opacity'];
    for(var i=0; i<fields.length; i++){
      settings[fields[i]] = this.$modal.find('input[name="{0}"]'.printf(fields[i])).val();
    }
    settings['stroke-dasharray'] = this.$modal.find('select[name="stroke-dasharray"] option:selected').val();
    return settings;
  },
  _draw_setting_controls: function(){
    var form = $('<form class="form-horizontal"></form>'),
        set = this.settings,
        add_horizontal_field = function(label_text, html_obj){
          return $('<div class="control-group"></div>')
              .append('<label class="control-label">{0}</label>'.printf(label_text))
              .append( $('<div class="controls"></div>').append(html_obj));
        },
        image_div = $('<div></div>'),
        sv = new StyleViewer(image_div, this),
        self = this;

    //image
    form.append(image_div).on('change', 'input,select', function(){
      sv.apply_new_styles(self.get_modified_settings(), true);
    });

    //name
    var name_field = $('<input name="name" type="text">').val(set.name).change(update_title);
    form.append(add_horizontal_field('Name', name_field));
    var update_title = function(){
      self.$modal.find('.modal-header h3').html(name_field.val());
    };
    update_title();

    //stroke
    form.append(add_horizontal_field('Stroke',
        $('<input name="stroke" type="color" value="{0}">'
            .printf(set.stroke))));

    //stroke-width
    form.append(add_horizontal_field('Stroke-width',
         DataPivot.rangeInputDiv($('<input name="stroke-width" type="range" min="0" max="10" step="0.5" value="{0}">'
          .printf(set["stroke-width"])))));

    //stroke-opacity
    form.append(add_horizontal_field('Stroke-opacity',
         DataPivot.rangeInputDiv($('<input name="stroke-opacity" type="range" min="0" max="1" step="0.05" value="{0}">'
            .printf(set["stroke-opacity"])))));

    //line-style
    var line_style = $('<select name="stroke-dasharray"></select>')
        .html([
            '<option value="none">solid</option>',
            '<option value="10, 10">dashed</option>',
            '<option value="2, 3">dotted</option>',
            '<option value="15, 10, 5, 10">dash-dotted</option>']);
    line_style.find('option[value="{0}"]'.printf(set['stroke-dasharray'])).prop('selected', true);
    form.append(add_horizontal_field('Line style', line_style));

    this.controls = form;
  }
};


var StyleRectangle = function(style_manager, settings, isNew){
  this.type = "rectangle";
  this.isNew = isNew;
  this.style_manager = style_manager;
  this.settings = settings || StyleRectangle.default_settings();
  return this;
};
StyleRectangle.default_settings = function(){
  return {
    "name": "base",
    "fill": "#be6a62",
    "fill-opacity": 0.3,
    "stroke": "#be6a62",
    "stroke-width": 1.5
  };
};
StyleRectangle.prototype = {
  draw_modal: function($modal){
    this.$modal = $modal;
    this._draw_setting_controls();
    this.$modal.find('.style_fields').html(this.controls);
    this.$modal.find('.style_fields input[type="color"]')
        .spectrum({"showInitial": true, "showInput": true});
    $modal.data('d', this);
  },
  get_modified_settings: function(){
    var settings = {},
        fields = ['name', 'fill', 'fill-opacity', 'stroke', 'stroke-width'];
    for(var i=0; i<fields.length; i++){
      settings[fields[i]] = this.$modal.find('input[name="{0}"]'.printf(fields[i])).val();
    }
    return settings;
  },
  _draw_setting_controls: function(){
    var form = $('<form class="form-horizontal"></form>'),
        set = this.settings,
        add_horizontal_field = function(label_text, html_obj){
          return $('<div class="control-group"></div>')
              .append('<label class="control-label">{0}</label>'.printf(label_text))
              .append( $('<div class="controls"></div>').append(html_obj));
        },
        image_div = $('<div></div>'),
        sv = new StyleViewer(image_div, this),
        self = this;

    //image
    form.append(image_div).on('change', 'input,select', function(){
      sv.apply_new_styles(self.get_modified_settings(), true);
    });

    //name
    var name_field = $('<input name="name" type="text">').val(set.name).change(update_title);
    form.append(add_horizontal_field('Name', name_field));
    var update_title = function(){
      self.$modal.find('.modal-header h3').html(name_field.val());
    };
    update_title();

    //fill
    form.append(add_horizontal_field('Fill',
        $('<input name="fill" type="color" value="{0}">'
            .printf(set.fill))));

    //fill-opacity
    form.append(add_horizontal_field('Fill-opacity',
         DataPivot.rangeInputDiv($('<input name="fill-opacity" type="range" min="0" max="1" step="0.1" value="{0}">'
            .printf(set["fill-opacity"])))));

    //stroke
    form.append(add_horizontal_field('Stroke',
        $('<input name="stroke" type="color" value="{0}">'
            .printf(set.stroke))));

    //stroke-width
    form.append(add_horizontal_field('Stroke-width',
         DataPivot.rangeInputDiv($('<input name="stroke-width" type="range" min="0" max="10" step="0.5" value="{0}">'
            .printf(set["stroke-width"])))));

    this.controls = form;
  }
};


var StyleViewer = function($plot_div, style, settings){
  var self = this;
  D3Plot.call(this); // call parent constructor
  this.style=style;
  this.settings = settings || StyleViewer.default_settings();
  this.set_defaults();
  this.plot_div = $plot_div;
  if(this.settings.plot_settings.build_plot_startup){this.build_plot();}
};
StyleViewer.default_settings = function(){
  return {
    "plot_settings": {
      "show_menu_bar": false,
      "build_plot_startup": true,
      "width": 50,
      "height": 50,
      "padding": {
        "top": 10,
        "right": 10,
        "bottom": 10,
        "left": 10
      }
    }
  };
};
_.extend(StyleViewer.prototype, D3Plot.prototype, {
  build_plot: function(){
    this.plot_div.html('');
    this.get_plot_sizes();
    this.build_plot_skeleton(false);
    this.draw_visualizations();
  },
  get_plot_sizes: function(){
    this.w = this.settings.plot_settings.width;
    this.h = this.settings.plot_settings.height;
    var menu_spacing = (this.settings.plot_settings.show_menu_bar) ? 40 : 0;
    this.plot_div.css({'height': (this.h + this.padding.top + this.padding.bottom + menu_spacing) + 'px'});
  },
  set_defaults: function(){
    this.padding = $.extend({}, this.settings.plot_settings.padding); //copy object

    this.x_axis_settings = {
        "domain": [0, 2],
        "rangeRound": [0, this.settings.plot_settings.width],
        "x_translate": 0,
        "y_translate": 0,
        "scale_type": 'linear',
        "text_orient": "bottom",
        "axis_class": 'axis x_axis',
        "gridlines": false,
        "gridline_class": 'primary_gridlines x_gridlines',
        "number_ticks": 10,
        "axis_labels": false,
        "label_format": undefined
    };

    this.y_axis_settings = {
        "domain": [0, 2],
        "rangeRound": [0, this.settings.plot_settings.height],
        "number_ticks": 10,
        "x_translate": 0,
        "y_translate": 0,
        'scale_type': "linear",
        'text_orient': "left",
        'axis_class': "axis y_axis",
        'gridlines': false,
        'gridline_class': "primary_gridlines y_gridlines",
        'axis_labels':false,
        'label_format': undefined
    };
  },
  draw_visualizations: function(){
    this.build_y_axis();
    this.build_x_axis();

    var self = this,
        x = this.x_scale,
        y = this.y_scale;

    if (this.style.type === 'line'){
      this.lines = this.vis.selectAll()
          .data([{"x1": 0.25, "x2": 1.75, "y1": 1, "y2": 1},
                 {"x1": 0.25, "x2": 0.25, "y1": 0.5, "y2": 1.5},
                 {"x1": 1.75, "x2": 1.75, "y1": 0.5, "y2": 1.5}])
          .enter().append("svg:line")
              .attr("x1", function(v){return x(v.x1);})
              .attr("x2", function(v){return x(v.x2);})
              .attr("y1", function(v){return y(v.y1);})
              .attr("y2", function(v){return y(v.y2);})
          .on('click', function(){self._update_styles(self.style.settings, true);});

      this._update_styles(this.style.settings, false);
    }

    if (this.style.type === 'rectangle'){
      this.rectangles = this.vis.selectAll()
          .data([{"x": 0.25, "y": 0.25, "width": 1.5, "height": 1.5}])
          .enter().append("svg:rect")
              .attr("x", function(v){return x(v.x);})
              .attr("y", function(v){return x(v.y);})
              .attr("width", function(v){return y(v.width);})
              .attr("height", function(v){return y(v.height);})
          .on('click', function(){self._update_styles(self.style.settings, true);});

      this._update_styles(this.style.settings, false);
    }

    if (this.style.type === 'symbol'){
      this.symbol = this.vis.selectAll("path")
          .data([{"x":0.5, "y":0.5},
                 {"x":1.5, "y":0.5},
                 {"x":1.5, "y":1.5},
                 {"x":0.5, "y":1.5}])
          .enter().append("path")
              .attr("d", d3.svg.symbol())
              .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
          .on('click', function(){self._update_styles(self.style.settings, true);});

      this._update_styles(this.style.settings, false);
    }

    if (this.style.type === "text"){
      this.lines = this.vis.selectAll()
          .data([{"x1": 1.25, "x2": 0.75, "y1": 1, "y2": 1},
                 {"x1": 1, "x2": 1, "y1": 1.25, "y2": 0.75}])
          .enter().append("svg:line")
              .attr("x1", function(v){return x(v.x1);})
              .attr("x2", function(v){return x(v.x2);})
              .attr("y1", function(v){return y(v.y1);})
              .attr("y2", function(v){return y(v.y2);})
              .attr("stroke-width", 2)
              .attr("stroke", "#ccc");

      this.text = this.vis.append("svg:text")
          .attr("x", x(1))
          .attr("y", y(1))
          .text("text");

      this._update_styles(this.style.settings, false);
    }

    if (this.style.type == "legend"){
      if(this.settings.line_style) this.add_legend_lines();
      if(this.settings.line_style) this.add_legend_symbols();
      this._update_styles(this.style, false);
    }
  },
  add_legend_lines: function(){

    var x = this.x_scale,
        y = this.y_scale;

    this.lines = this.vis.selectAll()
        .data([
            {"x1": 0.25, "x2": 1.75, "y1": 1, "y2": 1},
            {"x1": 0.25, "x2": 0.25, "y1": 0.5, "y2": 1.5},
            {"x1": 1.75, "x2": 1.75, "y1": 0.5, "y2": 1.5}])
        .enter().append("svg:line")
            .attr("x1", function(v){return x(v.x1);})
            .attr("x2", function(v){return x(v.x2);})
            .attr("y1", function(v){return y(v.y1);})
            .attr("y2", function(v){return y(v.y2);});
  },
  add_legend_symbols: function(){

    var x = this.x_scale,
        y = this.y_scale;

    this.symbol = this.vis.selectAll("path")
        .data([{"x":1, "y":1}])
        .enter().append("path")
            .attr("d", d3.svg.symbol())
            .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
  },
  _update_styles: function(style_settings, randomize_position){
    var x = this.x_scale,
        y = this.y_scale;

    if (this.style.type === 'line'){
      this.lines.transition()
          .duration(1000)
          .style(style_settings);
    }

    var randomize_data = function(){
      return [
          {"x":Math.random()*2, "y":Math.random()*2},
          {"x":Math.random()*2, "y":Math.random()*2},
          {"x":Math.random()*2, "y":Math.random()*2},
          {"x":Math.random()*2, "y":Math.random()*2}];
    };

    if (this.style.type === 'symbol'){

      var d = (randomize_position) ? randomize_data() : this.symbol.data();

      this.symbol
          .data(d)
          .transition()
          .duration(1000)
          .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
          .attr("d", d3.svg.symbol()
              .size(style_settings.size)
              .type(style_settings.type))
          .style(style_settings);
    }

    if (this.style.type === 'text'){
      this.text.attr('transform', undefined);
      this.text
          .transition()
          .duration(1000)
          .attr("font-size", style_settings['font-size'])
          .attr("font-weight", style_settings['font-weight'])
          .attr("fill", style_settings.fill)
          .attr("fill-opacity", style_settings["fill-opacity"])
          .attr("text-anchor", style_settings["text-anchor"])
          .attr("transform", "rotate({0} 25,25)".printf(style_settings["rotate"]));
    }

    if (this.style.type === 'rectangle'){
      this.rectangles
          .transition()
          .duration(1000)
          .style(style_settings);
    }

    if (this.style.type === 'legend'){

      if(style_settings.line_style){
        if (!this.lines) this.add_legend_lines();
        this.lines.transition()
            .duration(1000)
            .style(style_settings.line_style.settings);
      } else {
        if (this.lines){
          this.lines.remove();
          delete this.lines;
        }
      }

      if(style_settings.symbol_style){
        if (!this.symbol) this.add_legend_symbols();
        this.symbol
            .transition()
            .duration(1000)
            .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
            .attr("d", d3.svg.symbol()
                .size(style_settings.symbol_style.settings.size)
                .type(style_settings.symbol_style.settings.type))
            .style(style_settings.symbol_style.settings);
      } else {
        if (this.symbol){
          this.symbol.remove();
          delete this.symbol;
        }
      }
    }
  },
  apply_new_styles: function(style_settings, randomize_position){
    // don't change the object, just the styles rendered in viewer
    this._update_styles(style_settings, randomize_position);
  },
  update_style_object: function(style){
    // change the style object
    this.style=style;
    this._update_styles(this.style.settings, true);
  }
});
