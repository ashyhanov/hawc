var StudyPopulation = function(data){
    this.data = data;
};

StudyPopulation.prototype.build_breadcrumbs = function(){
    var urls = [
        { url: this.data.study.url, name: this.data.study.short_citation },
        { url: this.data.url, name: this.data.name }
    ];
    return HAWCUtils.build_breadcrumbs(urls);
};

StudyPopulation.prototype.build_details_table = function(div){
    var tbl = new DescriptiveTable();

    tbl.add_tbody_tr("Study design", this.data.design);
    tbl.add_tbody_tr("Country", this.data.country);
    tbl.add_tbody_tr("State", this.data.state);
    tbl.add_tbody_tr("Region", this.data.region);
    tbl.add_tbody_tr_list("Inclusion criteria", this.data.inclusion_criteria);
    tbl.add_tbody_tr_list("Exclusion criteria", this.data.exclusion_criteria);
    tbl.add_tbody_tr_list("Confounding criteria", this.data.confounding_criteria);
    tbl.add_tbody_tr("N", this.data.n);
    tbl.add_tbody_tr("Sex", this.data.sex);
    tbl.add_tbody_tr_list("Ethnicities", this.data.ethnicity);
    tbl.add_tbody_tr("Fraction male", this.data.fraction_male,
                 {calculated: this.data.fraction_male_calculated});
    tbl.add_tbody_tr("Age description", this.data.age_description);
    tbl.add_tbody_tr("Age {0} (yrs)".printf(this.data.age_mean_type),
                 this.data.age_mean,
                 {calculated: this.data.age_calculated});
    tbl.add_tbody_tr("Age {0} (yrs)".printf(this.data.age_sd_type),
                 this.data.age_sd,
                 {calculated: this.data.age_calculated});
    tbl.add_tbody_tr("Age {0} (yrs)".printf(this.data.age_lower_type),
                 this.data.age_lower,
                 {calculated: this.data.age_calculated});
    tbl.add_tbody_tr("Age {0} (yrs)".printf(this.data.age_upper_type),
                 this.data.age_upper,
                 {calculated: this.data.age_calculated});

    $(div).html(tbl.get_tbl());
};


var AssessedOutcome = function(data){
    this.aog = [];
    this.main_finding = false;
    this.data = data;
    this._build_aogs();
};

AssessedOutcome.prototype._build_aogs = function(){
    this.data.groups.sort(function(a, b){
      return a.exposure_group.exposure_group_id -
             b.exposure_group.exposure_group_id;});

    for(var i=0; i<this.data.groups.length; i++){
        var aog = new AssessedOutcomeGroup(this.data.groups[i])
        this.aog.push(aog);
        aog.data.main_finding = (aog.data.exposure_group.id === this.data.main_finding);
        if (aog.data.main_finding) this.main_finding = aog;
    }
    delete this.data.groups;
};

AssessedOutcome.prototype.build_ao_table = function(div){
    var tbl = new DescriptiveTable();
    tbl.add_tbody_tr("Assessed outcome", this.data.name);
    tbl.add_tbody_tr("Location in literature", this.data.data_location);
    tbl.add_tbody_tr("Population description", this.data.population_description);
    tbl.add_tbody_tr("Population exposure description", this.data.exposure.exposure_description);
    tbl.add_tbody_tr("Diagnostic", this.data.diagnostic);
    tbl.add_tbody_tr("Diagnostic description", this.data.diagnostic_description);
    tbl.add_tbody_tr("Outcome N", this.data.outcome_n);
    tbl.add_tbody_tr("Summary", this.data.summary);
    if (this.main_finding) tbl.add_tbody_tr("Main finding supported?", this.data.main_finding_support);
    tbl.add_tbody_tr("Prevalence Incidence", this.data.prevalence_incidence);
    tbl.add_tbody_tr("Statistical metric presented", this.data.statistical_metric.metric);
    tbl.add_tbody_tr("Statistical metric description", this.data.statistical_metric_description);
    tbl.add_tbody_tr("Statistical power sufficient?",
        this.data.statistical_power,
        {annotate: this.data.statistical_power_details});
    tbl.add_tbody_tr("Dose response trend?",
        this.data.dose_response,
        {annotate: this.data.dose_response_details});
    tbl.add_tbody_tr("Effect tags", this.data.effects.map(function(v){return v.name;}).join(", "));
    this._ao_tbl_adjustments_columns(tbl.get_tbody());

    $(div).html(tbl.get_tbl());
};

AssessedOutcome.prototype._ao_tbl_adjustments_columns = function(tbody){

    var adjs = _.clone(this.data.adjustment_factors),
        confs = _.clone(this.data.confounders_considered),
        content = ['<i>None</i>'],
        tr = $('<tr>');

    for (var i = confs.length-1; i>=0; i--){
        if (adjs.indexOf(confs[i])>=0){
            confs.splice(i, 1);   // remove from array
        } else{
            confs[i] = confs[i] + "<sup>a</sup>";
        }
    };

    if (adjs.length>0 || confs.length>0){
        content = [$('<ul>')
                    .append(adjs.map(function(v){return '<li>{0}</li>'.printf(v);}))
                    .append(confs.map(function(v){return '<li>{0}</li>'.printf(v);}))];
        if(confs.length>0){
            content.push("<p><sup>a</sup> Examined but not included in final model.</p>");
        }
    }

    tr.append('<th>{0}</th>'.printf("Adjustment factors"))
      .append($('<td></td>').append(content));

    tbody.append(tr);
};

AssessedOutcome.prototype.get_statistical_metric_header = function(){
    var txt = this.data.statistical_metric.metric;
    txt = txt.charAt(0).toUpperCase() + txt.substr(1);
    // assumes confidence interval is the same for all assessed-outcome groups
    if (this.aog.length>0) txt += this.aog[0].get_confidence_interval();
    return txt;
};

AssessedOutcome.prototype.build_aog_table = function(div){
    var tbl = $('<table class="table table-condensed table-striped"></table>'),
        tcol = $("<colgroup><colgroup>"),
        thead = $('<thead></thead>'),
        tbody = $('<tbody></tbody>'),
        tfoot = $('<tfoot></tfoot>'),
        footnotes  = new TableFootnotes();

    // build header
    var estimate_header = this.get_statistical_metric_header();
    thead.append('<tr><th>Exposure-group</th><th>N</th><th>{0}</th><th>SE</th><th><i>p</i>-value</th></tr>'.printf(estimate_header));

    // build colgroup
    tcol.append([
        $('<col width="30%">'),
        $('<col width="15%">'),
        $('<col width="25%">'),
        $('<col width="15%">'),
        $('<col width="15%">')
        ]);

    // build body
    this.aog.forEach(function(v){ tbody.append(v.build_aog_table_row(footnotes)); });

    // build footer
    var tfoot_txt = footnotes.html_list().join('<br>');
    tfoot.append('<tr><td colspan="{0}">{1}</td></tr>'.printf(10, tfoot_txt));

    $(div).html(tbl.append(tcol, thead, tfoot, tbody));
};

AssessedOutcome.prototype.has_aogs = function(){
    return (this.aog.length>0);
};

AssessedOutcome.prototype.build_breadcrumbs = function(){
    var urls = [
        {
            url: this.data.exposure.study_population.study.url,
            name: this.data.exposure.study_population.study.short_citation
        },
        {
            url: this.data.exposure.study_population.url,
            name: this.data.exposure.study_population.name
        },
        {
            url: this.data.exposure.url,
            name: this.data.exposure.exposure_form_definition
        },
        {
            url: this.data.url,
            name: this.data.name
        }
    ];
    return HAWCUtils.build_breadcrumbs(urls);
};

AssessedOutcome.prototype.build_forest_plot = function(div){
    this.plot =  new AOForestPlot(this.aog, this, div);
};


var AssessedOutcomeGroup = function(data){
    this.data = data;
    this.tooltip = new PlotTooltip({"width": "500px", "height": "380px"});
};

AssessedOutcomeGroup.prototype.build_aog_table_row  = function(footnotes){
    var self = this,
        name = this.data.exposure_group.description;

    if(this.data.main_finding){
        name = name + footnotes.add_footnote(["Main finding as selected by HAWC assessment authors."]);
    }

    return $('<tr></tr>').append([
                    $('<td>').append($('<a>').attr('href', '#')
                                             .html(name)
                                             .on('click', function(e){e.preventDefault();
                                                                      self.tooltip.display_exposure_group_table(self, e);})),
                    $('<td>').text(this.data.n || "-"),
                    $('<td>').text(this.build_formatted_estimate()),
                    $('<td>').text(this.data.se || "-"),
                    $('<td>').text(this.data.p_value_text || "-")]);
};

AssessedOutcomeGroup.prototype.build_formatted_estimate = function(){
    var txt = "-";
    if (this.data.estimate) txt = this.data.estimate;
    if ((this.data.lower_ci) && (this.data.upper_ci)){
        txt += ' ({0},{1})'.printf(this.data.lower_ci, this.data.upper_ci);
    }
    return txt;
};

AssessedOutcomeGroup.prototype.get_confidence_interval = function(){
    var txt = "";
    if(this.data.ci_units) txt = " ({0}% CI)".printf(this.data.ci_units*100);
    return txt;
};

AssessedOutcomeGroup.prototype.get_ci = function(){
    var ci = {"lower_ci": undefined, "upper_ci": undefined};

    if ((this.data.lower_ci!==null) && (this.data.upper_ci!==null)){
        ci.lower_ci = this.data.lower_ci;
        ci.upper_ci = this.data.upper_ci;
    } else if ((this.data.estimate!==null) && (this.data.se!==null) && (this.data.n!==null)){
        ci.lower_ci = this.data.estimate - 1.96 * this.data.se * Math.sqrt(this.data.n);
        ci.upper_ci = this.data.estimate + 1.96 * this.data.se * Math.sqrt(this.data.n);
    }
    return ci;
};

AssessedOutcomeGroup.prototype.build_exposure_group_table = function(div){
    var tbl = $('<table class="table table-condensed table-striped"></table>'),
        colgroup = $('<colgroup></colgroup>'),
        tbody = $('<tbody></tbody>'),
        add_tbody_tr = function(description, value, calculated){
            if(value){
                if(calculated){value="[{0}]".printf(value);}  // [] = estimated
                tbody.append($('<tr></tr>').append($("<th>").text(description))
                                           .append($("<td>").text(value)));
            }
        }, add_tbody_tr_list = function(description, list_items){
            var ul = $('<ul></ul>').append(
                        list_items.map(function(v){return $('<li>').text(v); })),
                tr = $('<tr></tr>')
                        .append('<th>{0}</th>'.printf(description))
                        .append($('<td></td>').append(ul));

        tbody.append(tr);
    };

    colgroup.append('<col style="width: 30%;"><col style="width: 70%;">');
    add_tbody_tr("Name", this.data.exposure_group.description);
    add_tbody_tr("Comparison description", this.data.exposure_group.comparative_name);
    add_tbody_tr("Exposure N", this.data.exposure_group.exposure_n);
    add_tbody_tr("Demographic Starting N", this.data.exposure_group.starting_n);
    add_tbody_tr("Demographic N", this.data.exposure_group.n);
    add_tbody_tr("Sex", this.data.exposure_group.sex);

    add_tbody_tr_list("Ethnicities", this.data.exposure_group.ethnicity);

    add_tbody_tr("Fraction male", this.data.exposure_group.fraction_male,
                                  this.data.exposure_group.fraction_male_calculated);

    add_tbody_tr("Age description", this.data.exposure_group.age_description);
    add_tbody_tr("Age {0} (yrs)".printf(this.data.exposure_group.age_mean_type),
                 this.data.exposure_group.age_mean,
                 this.data.exposure_group.age_calculated);
    add_tbody_tr("Age {0} (yrs)".printf(this.data.exposure_group.age_sd_type),
                 this.data.exposure_group.age_sd,
                 this.data.exposure_group.age_calculated);
    add_tbody_tr("Age {0} (yrs)".printf(this.data.exposure_group.age_lower_type),
                 this.data.exposure_group.age_lower,
                 this.data.exposure_group.age_calculated);
    add_tbody_tr("Age {0} (yrs)".printf(this.data.exposure_group.age_upper_type),
                 this.data.exposure_group.age_upper,
                 this.data.exposure_group.age_calculated);

    $(div).html(tbl.append(colgroup, tbody));
};


var AOForestPlot = function(aogs, ao, plot_div, options){
    // Assessed-outcome forest plot. Expects:
    // - an array of AssessedOutcomeGroup objects,
    // - a div to display the figure,
    // - (optionally) a title string for the plot, and
    // - (optionally) a units string for the plot, and
    // - (optionally) an options object
    D3Plot.call(this); // call parent constructor
    this.options = options || this.default_options();
    this.set_defaults();
    this.plot_div = $(plot_div);
    this.ao = ao;
    this.aogs = aogs;
    this.title_str = ao.data.name || "";
    this.x_label_text = ao.data.statistical_metric.metric || "(unitless)";
    if(this.options.build_plot_startup){this.build_plot();}
};

AOForestPlot.prototype = new D3Plot();
AOForestPlot.prototype.constructor = AOForestPlot;

AOForestPlot.prototype.default_options = function(){
    return {"build_plot_startup": true};
};

AOForestPlot.prototype.build_plot = function(){
    this.plot_div.empty();
    this.get_dataset();
    this.get_plot_sizes();
    this.build_plot_skeleton(true);
    this.add_axes();
    this.build_x_label();
    this.draw_visualizations();
    this.add_title();
    this.add_final_rectangle();
    this.add_menu();
    this.resize_plot_dimensions();
    this.trigger_resize();
};

AOForestPlot.prototype.set_defaults = function(){
    this.padding = {top:35, right:20, bottom:40, left:20};
    this.padding.left_original = this.padding.left;
    this.x_axis_settings = {
        "scale_type": "linear",
        "text_orient": "bottom",
        "axis_class": "axis x_axis",
        "number_ticks": 6,
        "x_translate": 0,
        "gridlines": true,
        "gridline_class": 'primary_gridlines x_gridlines',
        "axis_labels": true,
        "label_format": undefined //default
    };

    this.y_axis_settings = {
        "scale_type": 'ordinal',
        "text_orient": 'left',
        "axis_class": 'axis y_axis',
        "gridlines": true,
        "gridline_class": 'primary_gridlines y_gridlines',
        "axis_labels": true,
        "label_format": undefined //default
    };

    this.row_height = 30;
};

AOForestPlot.prototype.get_dataset = function(){
    var estimates = [], lines = [], names = [], vals =[];

    this.aogs.forEach(function(aog, idx){
        var name = aog.data.exposure_group.description.toString();
        names.push(name);
        if(aog.data.estimate !== null){
            estimates.push({"aog": aog, "name": name,
                            "estimate": aog.data.estimate});
            vals.push(aog.data.estimate);
        }
        var ci = aog.get_ci();
        if(ci.lower_ci !== undefined){
            ci.name=name;
            lines.push(ci);
            vals.push(ci.lower_ci, ci.upper_ci);
        }
    });
    this.scale_type = (this.ao.data.statistical_metric.isLog) ? "log" : "linear";
    this.estimates = estimates;
    this.lines = lines;
    this.names = names;
    this.get_x_domain(vals);
};

AOForestPlot.prototype.get_x_domain = function(vals){
    var domain = d3.extent(vals);
    if(domain[0] === domain[1]){
        // set reasonable defaults for domain if there is no domain.
        if (this.scale_type === "log"){
            domain[0] = domain[0] * 0.1;
            domain[1] = domain[1] * 10;
        } else {

            if (domain[0] > 0){
                domain[0] = 0
            } else if(domain[0] >= -1){
                domain[0] = -1;
            } else {
                domain[0] = domain[0]*2;
            }

            if ((domain[1] >= -1) && (domain[1] <= 1)) domain[1] = 1;
        }
    }
    this.x_domain = domain;
};

AOForestPlot.prototype.get_plot_sizes = function(){
    this.h = this.row_height*this.names.length;
    this.w = this.plot_div.width() - this.padding.right - this.padding.left; // extra for margins
    var menu_spacing = (this.options.show_menu_bar) ? 40 : 0;
    this.plot_div.css({'height': (this.h + this.padding.top + this.padding.bottom +
        menu_spacing) + 'px'});
};

AOForestPlot.prototype.add_axes = function() {
    if (this.scale_type === "log" && this.x_domain[0]>=1) this.x_domain[0]=0.1;

    $.extend(this.x_axis_settings, {
        "domain": this.x_domain,
        "rangeRound": [0, this.w],
        "y_translate": this.h,
        "scale_type": this.scale_type
    });

    $.extend(this.y_axis_settings, {
        "domain": this.names,
        "number_ticks": this.names.length,
        "rangeRound": [0, this.h],
        "x_translate": 0,
        "y_translate": 0
    });

    this.build_y_axis();
    this.build_x_axis();
};

AOForestPlot.prototype.draw_visualizations = function(){
    var plot = this,
        x = this.x_scale,
        y = this.y_scale,
        mid = y.rangeBand()/2;

    // vertical reference line at 1 relative risk
    this.vis.append("line")
      .attr("x1", x(1))
      .attr("y1", 0)
      .attr("x2", x(1))
      .attr("y2", this.h)
      .attr('class','reference_line');

    // estimate range
    this.estimate_range = this.vis.append("g").attr("class", "estimates_range");
    this.estimate_range.selectAll("line.temp")
      .data(this.lines)
    .enter().append("line")
      .attr("x1", function(d) { return x(d.lower_ci); })
      .attr("y1", function(d) {return  y(d.name) + mid;})
      .attr("x2", function(d) { return x(d.upper_ci); })
      .attr("y2", function(d) {return  y(d.name) + mid;})
      .attr('class','dr_err_bars');

    this.estimate_range.selectAll("line.temp")
      .data(this.lines)
    .enter().append("line")
      .attr("x1", function(d) { return x(d.lower_ci); })
      .attr("y1", function(d) {return  y(d.name) + mid*1.5;})
      .attr("x2", function(d) { return x(d.lower_ci); })
      .attr("y2", function(d) {return  y(d.name) + mid*0.5;})
      .attr('class','dr_err_bars');

    this.estimate_range.selectAll("line.temp")
      .data(this.lines)
    .enter().append("line")
      .attr("x1", function(d) { return x(d.upper_ci); })
      .attr("y1", function(d) {return  y(d.name) + mid*1.5;})
      .attr("x2", function(d) { return x(d.upper_ci); })
      .attr("y2", function(d) {return  y(d.name) + mid*0.5;})
      .attr('class','dr_err_bars');

    // central estimate
    this.estimates_group = this.vis.append("g").attr("class", "estimates");
    this.estimates = this.estimates_group.selectAll("path.dot")
      .data(this.estimates)
    .enter().append("circle")
      .attr("class", "dose_points")
      .attr("r", 7)
      .attr("cx", function(d){return x(d.estimate);})
      .attr("cy", function(d){return y(d.name) + mid;})
      .style("cursor", "pointer")
      .on('click', function(d){d.aog.tooltip.display_exposure_group_table(d.aog, d3.event);})
      .append('title').text(function(d){return "{0}: click to view exposure-group details".printf(d.estimate);});
};

AOForestPlot.prototype.resize_plot_dimensions = function(){
    // Resize plot based on the dimensions of the labels.
    var ylabel_width = this.plot_div.find('.y_axis')[0].getBoundingClientRect().width;
    if (this.padding.left < this.padding.left_original + ylabel_width){
        this.padding.left = this.padding.left_original + ylabel_width;
        this.build_plot();
    }
};


var AOVersion = function(obj, revision_version){
    // implements requirements for js/hawc_utils Version interface
    // unpack JSON object into Assessment
    for (var i in obj) {
        this[i] = obj[i];
    }
    // convert datetime formats
    this.created = new Date(this.created);
    this.last_updated = new Date(this.last_updated);
    this.revision_version = revision_version;
    this.banner = this.revision_version + ': ' + String(this.last_updated) + ' by ' + this.changed_by;
};

AOVersion.field_order = ['name', 'summary', 'statistical_metric',
    'outcome_n', 'diagnostic_description', 'prevalence_incidence',
    'created', 'last_updated'];


var MetaProtocol = function(data){
    this.data = data;
};

MetaProtocol.prototype.build_details_table = function(div){
    var tbl = new DescriptiveTable();
    tbl.add_tbody_tr("Description", this.data.name);
    tbl.add_tbody_tr("Protocol type", this.data.protocol_type);
    tbl.add_tbody_tr("Literature search strategy", this.data.lit_search_strategy);
    tbl.add_tbody_tr("Literature search start-date", this.data.lit_search_start_date);
    tbl.add_tbody_tr("Literature search end-date", this.data.lit_search_end_date);
    tbl.add_tbody_tr("Literature search notes", this.data.lit_search_notes);
    tbl.add_tbody_tr("Total references from search", this.data.total_references);
    tbl.add_tbody_tr_list("Inclusion criteria", this.data.inclusion_criteria.map(function(v){return v.description;}));
    tbl.add_tbody_tr_list("Exclusion criteria", this.data.exclusion_criteria.map(function(v){return v.description;}));
    tbl.add_tbody_tr("Total references after inclusion/exclusion", this.data.total_studies_identified);
    tbl.add_tbody_tr("Additional notes", this.data.notes);

    $(div).html(tbl.get_tbl());
};

MetaProtocol.prototype.build_breadcrumbs = function(){
    var urls = [
        { url: this.data.study.url, name: this.data.study.short_citation },
        { url: this.data.url, name: this.data.name }
    ];
    return HAWCUtils.build_breadcrumbs(urls);
};


var MetaResult = function(data){
    this.data = data;
    this.single_results = [];
    this._unpack_single_results();
};

MetaResult.prototype._unpack_single_results = function(){
    var single_results = this.single_results;
    this.data.single_results.forEach(function(v,i){
        single_results.push(new SingleStudyResult(v));
    });
    this.data.single_results = [];
};

MetaResult.prototype.build_details_table = function(div){
    var tbl = new DescriptiveTable();
    tbl.add_tbody_tr("Health outcome", this.data.health_outcome);
    tbl.add_tbody_tr("Data location", this.data.data_location);
    tbl.add_tbody_tr("Health outcome notes", this.data.health_outcome_notes);
    tbl.add_tbody_tr("Exposure name", this.data.exposure_name);
    tbl.add_tbody_tr("Exposure details", this.data.exposure_details);
    tbl.add_tbody_tr("Number of studies", this.data.number_studies);
    tbl.add_tbody_tr_list("Adjustment factors", this.data.adjustment_factors);
    tbl.add_tbody_tr("N", this.data.n);
    tbl.add_tbody_tr(this.get_statistical_metric_header(), this.get_risk_estimate_text(this.data));
    tbl.add_tbody_tr("Statistical notes", this.data.statistical_notes);
    tbl.add_tbody_tr("Hetereogeneity notes", this.data.heterogeneity);
    tbl.add_tbody_tr("Notes", this.data.notes);
    $(div).html(tbl.get_tbl());
};

MetaResult.prototype.get_statistical_metric_header = function(){
    var txt = this.data.statistical_metric.abbreviation;
    if(this.data.ci_units) txt += " ({0}% CI)".printf(this.data.ci_units*100);
    return txt;
};

MetaResult.prototype.get_risk_estimate_text = function(data){
    var txt = "{0}".printf(data.estimate);
    if (data.lower_ci && data.upper_ci){
        txt += " ({0}-{1})".printf(data.lower_ci, data.upper_ci);
    }
    return txt;
};

MetaResult.prototype.has_single_results = function(){
    return(this.single_results.length>0);
};

MetaResult.prototype.build_single_results_table = function(div){
    var tbl = $('<table class="table table-condensed table-striped"></table>'),
        thead = $('<thead></thead>').append('<tr><th>Name</th><th>Weight</th><th>N</th><th>Risk Estimate</th><th>Notes</th></tr>'),
        colgroup = $('<colgroup></colgroup>').append('<col style="width: 30%;"><col style="width: 15%;"><col style="width: 15%;"><col style="width: 15%;"><col style="width: 25%;">'),
        tbody = $('<tbody></tbody>');

    this.single_results.forEach(function(v){
        v.build_table_row(tbody);
    });

    tbl.append(colgroup, thead, tbody);
    div.append(tbl);
};

MetaResult.prototype.build_breadcrumbs = function(){
    var urls = [
        { url: this.data.protocol.study.url, name: this.data.protocol.study.short_citation },
        { url: this.data.protocol.url, name: this.data.protocol.name },
        { url: this.data.url, name: this.data.label }
    ];
    return HAWCUtils.build_breadcrumbs(urls);
};


var SingleStudyResult = function(data){
    this.data=data
};

SingleStudyResult.prototype.build_table_row = function(tbody){
    var self=this,
        addIfExists = function(v){return (v) ? v : "-";},
        tr = $('<tr></tr>').appendTo(tbody),
        getValues = function(self){
            var d = {
                "name": self.exposure_name_link(),
                "weight": self.data.weight,
                "notes": self.data.notes
            };
            if (self.data.outcome_group){
                d["n"] = self.data.outcome_group.n;
                d["risk"] = self.get_risk_estimate_text(self.data.outcome_group);
            } else {
                d["n"] = self.data.n;
                d["risk"] = self.get_risk_estimate_text(self.data);
            }
            return d;
        },
        d = getValues(this);
    tr.append('<td>{0}</td>'.printf(addIfExists(d.name)))
      .append('<td>{0}</td>'.printf(addIfExists(d.weight)))
      .append('<td>{0}</td>'.printf(addIfExists(d.n)))
      .append('<td>{0}</td>'.printf(addIfExists(d.risk)))
      .append('<td>{0}</td>'.printf(addIfExists(d.notes)))
};

SingleStudyResult.prototype.get_risk_estimate_text = function(data){
    return MetaResult.prototype.get_risk_estimate_text.call(this, data);
};

SingleStudyResult.prototype.exposure_name_link = function(){

    var txt = "";
    if(this.data.study){
        txt = '<a href="{0}" target="_blank">{1}</a>: '.printf(
            this.data.study.url,
            this.data.study.short_citation);
    };

    if(this.data.outcome_group){
        txt += '<a href="{0}" title="{1}" target="_blank">{1}</a>'.printf(
            this.data.outcome_group.assessed_outcome.url,
            this.data.outcome_group.assessed_outcome.name);
    } else {
        txt += this.data.exposure_name
    };
    return txt;
};
