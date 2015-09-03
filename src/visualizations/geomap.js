 vars.default_params["geomap"] = function(scope) {

  var params = {};

  params.accessor_data = function(d) { return d.data; };
  params.accessor_values = function(d) { return d.data.values; };

  if(vars.refresh) {

    // countries contains bot the data and coordinates for shapes drawing
    vars.countries = topojson.object(vars.topology, vars.topology.objects.countries).geometries;
    vars.neighbors = topojson.neighbors(vars.topology, vars.countries);

    vars.countries.forEach(function(d) { 

      // Retrieve the country name based on its id
      d[vars.var_id] = vars.names.filter(function(n) { return d.id == n.id; })[0][vars.var_id];

      // TODO: should merge on a more reliable join (e.g. 2-char)
      d.data = vars.new_data.filter(function(n) { return d[vars.var_id] === n[vars.var_id]; })[0];

      // Two reasons why it is not defined
      // 1/ No data
      // 2/ Current country
      if(typeof d.data == "undefined") {
        var data = {}
        data[vars.var_id] = "N/A"
        d.data = data;
      }

      d.__redraw = true;

    });

    vars.new_data = vars.countries;

    // http://techslides.com/demos/d3/d3-world-map-colors-tooltips.html
    vars.projection = d3.geo.mercator()
                   // .translate([vars.width/2, vars.height/2])
                    .scale(100);

    // This is the main function that draws the shapes later on
    vars.path = d3.geo.path()
        .projection(vars.projection);

  }

  params.x_scale = [{
    func: d3.scale.linear()
            .domain(d3.extent(vars.countries, function(d) { return d[vars.var_x]; }))
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .domain(d3.extent(vars.countries, function(d) { return d[vars.var_y]; }))
            .range([scope.height - vars.margin.top - vars.margin.bottom, scope.margin.top])
  }];

  params.items = [{
    marks: [{
      type: "shape",
      fill: d3.scale.linear()
              .domain([d3.min(vars.new_data, function(d) { 
                  return d[vars.var_color]; 
                }), d3.max(vars.new_data, function(d) { 
                  return d[vars.var_color]; 
                })])
              .range(["red", "green"])
    }]
  }];

  return params;

};
