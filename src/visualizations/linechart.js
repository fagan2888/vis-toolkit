      case "linechart":

        vars.params = {

          accessor_values: function(d) { return d.values; },

          x_scale: [{
              name: "linear",
              func: d3.time.scale()
                  .range([0, vars.width-100])
                  .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_time]; }))
            }
          ],

          y_scale: d3.scale.linear()
                      .range([vars.height - 4, 0])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; })),

          path: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); }),

          items: [{
            type: "diamond",
            rotate: "0"
          },{
            type: "text",
            rotate: "-30"
          }],

          connect: {
            type: "path"
          },

        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.evt.register("highlightOn", function(d) {

          vars.svg.selectAll(".connect__group:not(.selected)").style("opacity", 0.2);
          vars.svg.selectAll(".text:not(.selected)").style("opacity", 0.2);

          vars.svg.selectAll("#"+d[vars.var_id]).style("opacity", 1);

          vars.svg.selectAll(".connect__group").filter(function(e, j) { return e === d; }).style("stroke-width", 3);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "underline");

        });

        vars.evt.register("highlightOut", function(d) {

          vars.svg.selectAll(".country:not(.selected)").style("opacity", 1);

          vars.svg.selectAll(".connect__group").filter(function(e, j) { return e === d; }).style("stroke-width", 1);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "none");

        });

        vars.evt.register("selection", function(d) {

          vars.svg.selectAll("#"+d[vars.var_id])
                  .classed("selected", !vars.svg.selectAll("#"+d[vars.var_id]).classed("selected"));

        });

        vars.y_scale = d3.scale.linear()
            .range([0, vars.height-100]);

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale[0]["func"])
            .orient("top");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left");

        // TODO: use the connection mark instead of the line
        // FIX FOR MISSING VALUES
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        vars.line = d3.svg.line()
        // https://gist.github.com/mbostock/3035090
            .defined(function(d) { return d[vars.var_y] != null; })
            .interpolate(vars.interpolate)
            .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_time]); })
            .y(function(d) { return vars.y_scale(d[vars.var_y]); });

        // TODO: fix the color scale
        vars.color.domain(d3.keys(vars.new_data[0]).filter(function(key) { return key !== "date"; }));

        vars.y_scale.domain([
          d3.min(items, function(c) { return d3.min(c.values, function(v) { return v[vars.var_y]; }); }),
          d3.max(items, function(c) { return d3.max(c.values, function(v) { return v[vars.var_y]; }); })
        ]);

        // Grid layout (background)
        vars.svg.append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height, 0, 0)
            .tickFormat(""));

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + -5 + ")")
            .call(vars.x_axis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(vars.y_axis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.71em")
            .style("text-anchor", "end")
            .text(vars.y_text);

        // TODO: add all the line and not just the filtered one
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(items);//, function(d, i) { return i; });
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .each(vistk.utils.connect_group);

        // Enter connect graphical marks
        gConnect_enter.each(vistk.utils.connect_mark)
                        .style("stroke", function(d) { return vars.color(d[vars.var_color]); });

        var gItems = vars.svg.selectAll(".items__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          console.log(d,  vars.x_scale[0]["func"](d[vars.time.var_time]))
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

        });

        // Enter items
        gItems_enter.each(vistk.utils.items_mark);

/*
        // Enter groups for items graphical marks
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](vars.accessor_values(d)[vars.time.var_time]) + ", " + vars.y_scale(vars.accessor_values(d)[vars.var_y]) + ")";
                        });

        gItems_enter.each(vistk.utils.items_mark)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](vars.accessor_values(d)[vars.time.var_time]) + ", " + vars.y_scale(vars.accessor_values(d)[vars.var_y]) + ")";
                        });


        // TODO: turn into an item mark
        gItems_enter.append("text")
            .datum(function(d) { 
              d.values.sort(function(a, b) { return a.year > b.year;}); 
              return {name: d.name, id: d[vars.var_id], value: d.values[d.values.length - 1]}; 
            })
            .attr("transform", function(d) { 
              return "translate(" + vars.x_scale[0]["func"](vars.accessor_values(d)[vars.var_time]) + "," + vars.y_scale(vars.accessor_values(d)[vars.var_y]) + ")"; 
            })
            .attr("x", 3)
            .attr("class", function(d) {

              var c = "country text";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            })
            .attr("dy", ".35em")
            .attr("id", function(d) { return d[vars.var_id]; })
            .text(function(d) { return d[vars.var_text]; })
*/
        break;
