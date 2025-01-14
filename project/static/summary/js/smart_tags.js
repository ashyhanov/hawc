var SmartTag = function(tag){
    var self = this;
    this.$tag = $(tag).data('d', this);
    this.type = this.$tag.data('type');
    this.pk = this.$tag.data('pk');
    this.resource = undefined;
    this.rendering = this.$tag.is('span') ? "tooltip" : "inline";
    if (this.rendering === "tooltip"){
        this.$tag.on('click', function(e){self.display_modal(e);});
    } else {
        this.display_inline();
    }
};
_.extend(SmartTag, {
    toggle_disabled: function(e){
        e.preventDefault();
        $('span.smart-tag').toggleClass('active');
    },
    initialize_tags: function($frame){
        var doc = $frame || $(document);

        doc.find('span.smart-tag')
            .each(function(i, v){ if(!$(this).data('d')){new SmartTag(v);}})
            .addClass('active');

        doc.find('div.smart-tag')
            .each(function(i, v){if(!$(this).data('d')){new SmartTag(v);}});
    },
    context: {
        "endpoint":     {"Cls": Endpoint,    "inline_func": "display_endpoint"},
        "study":        {"Cls": Study,       "inline_func": "display_study"},
        "aggregation":  {"Cls": Aggregation, "inline_func": "display_aggregation"},
        "data_pivot":   {"Cls": DataPivot,   "inline_func": "display_data_pivot"},
    },
});
_.extend(SmartTag.prototype, {
    display_inline: function(){
        var self = this,
            Cls = SmartTag.context[this.type].Cls,
            inline_func = SmartTag.context[this.type].inline_func,
            cb = function(resource){
                self.resource = resource;
                self.inline = new InlineRendering(self);
                self.inline[inline_func](self.resource);
            };
        Cls.get_object(this.pk, cb);
    },
    display_modal: function(e){
        SmartTag.context[this.type].Cls.displayAsModal(this.pk);
    }
});


InlineRendering = function(smart_tag){
    this.smart_tag = smart_tag;
    this.$title_div = $('<div></div>');
    this.$div = $('<div class="inline-content"></div>');
    this.$caption = $('<div class="caption">{0}</div>'.printf(smart_tag.$tag.text()));
    this.$container = $('<div class="inline-smart-tag-container row-fluid"></div>')
                        .data('d', this)
                        .append(this.$div, this.$caption);

    $('<div class="span10 offset1 inline-smart-tag"></div>')
        .appendTo(this.$container)
        .append([this.$title_div, this.$div, this.$caption]);

    this.smart_tag.$tag.replaceWith(this.$container);
    return this;
};
_.extend(InlineRendering, {
    reset_renderings: function($frame){
        var doc = $frame || $(document);
        doc.find('.inline-smart-tag-container').each(function(){
            var rendering = $(this).data('d');
            rendering.$container.replaceWith(rendering.smart_tag.$tag);
        });
    }
});
_.extend(InlineRendering.prototype, {
    _build_title: function($content){
        var self = this,
            toggler = $('<a title="click to toggle visibility" class="toggler btn btn-small pull-right"><i class="icon-minus"></i></a>');
        this.$title_div.append($content.append(toggler));
        this.maximized = true;
        this.$title_div.on('click', '.toggler', function(){
            var v = (self.maximized) ? self.minimize_content() : self.maximize_content();
        });
    },
    minimize_content: function(){
        this.$title_div.find('.icon-minus').removeClass('icon-minus').addClass('icon-plus');
        this.$div.fadeOut("slow");
        this.maximized = false;
    },
    maximize_content: function(){
        this.$title_div.find('.icon-plus').removeClass('icon-plus').addClass('icon-minus');
        this.$div.fadeIn("slow");
        this.maximized = true;
    },
    display_endpoint: function(endpoint){
        var title  = $('<h4><b>{0}</b></h4>'.printf(endpoint.build_breadcrumbs())),
            plot_div = $('<div style="height:350px; width:350px"></div'),
            tbl = $(endpoint.build_endpoint_table($('<table class="table table-condensed table-striped"></table>'))),
            content = [plot_div,
                       tbl];
        this._build_title(title);
        this.$div.html(content);
        new EndpointPlotContainer(endpoint, plot_div);
    },
    display_study: function(study){
        var title  = $('<h4><b>{0}</b></h4>'.printf(study.build_breadcrumbs())),
            content = $('<div></div');
        this.$div.html([content]);
        this._build_title(title);
        new StudyQuality_TblCompressed(study, content, {'show_all_details_startup': false});
    },
    display_aggregation: function(aggregation){
        var title  = $('<h4>{0}</h4>'.printf(aggregation.name)),
            plot_div = $('<div></div>'),
            tbl_div = $('<div></div>'),
            tbl_toggle = $('<a class="btn btn-small" id="table_toggle">Toggle table style <i class="icon-chevron-right"></i></a>'),
            content = [plot_div, tbl_div, tbl_toggle];
        aggregation.build_table(tbl_div);
        this.$div.html(content);
        this._build_title(title);
        aggregation.build_plot(plot_div);
    },
    display_data_pivot: function(data_pivot){
        var title  = $('<h4>{0}</h4>'.printf(data_pivot.title)),
            plot_div = $('<div>');

        this.$div.html(plot_div);
        this._build_title(title);
        data_pivot.build_data_pivot_vis(plot_div);
    },
    reset_rendering: function(){
        this.$container.replaceWith(this.smart_tag.$tag);
    }
});
