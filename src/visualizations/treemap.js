      case "treemap":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.ordinal()
                      .rangeRoundBands([0, vars.width], .1)
                      .domain(vars.data.map(function(d) { return d[vars.var_x]; })),
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height, 0])
                      .domain([0, d3.max(vars.data, function(d) { return d[vars.var_y]; })]),
            }
          ],

          items: [{
            attr: "depth2",
            marks: [{
                type: "rect",
                rotate: "0"
              },{
                attr: "depth1",
                type: "text",
                rotate: "0",
                translate: [5, 20]
              }]
          }],

          connect: [],
        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.evt.register("highlightOn", function(d) {
          vars.svg.selectAll("rect")
            .filter(function(e, j) { return e === d; })
            .classed("focus", true);
        });

        vars.evt.register("highlightOut", function(d) {
          vars.svg.selectAll("rect")
              .classed("focus", false);
        });

        // Remove any existing grid or axes
        vars.svg.selectAll(".x, .y").remove();

        vars.treemap = d3.layout.treemap()
            .padding(vars.padding)
            .sticky(true)
            .sort(function(a,b) { return a[vars.var_size] - b[vars.var_size]; })
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        // PRE-UPDATE
        var gItems = vars.svg.data([vars.root]).selectAll("g")
            .data(vars.treemap.nodes);

        // ENTER
        var gItems_enter = gItems.enter()
                      .insert("g", ":first-child")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d) { 
                          return "translate(" + d.x + "," + d.y + ")"; 
                        });

        gItems.transition().duration(vars.duration)
              .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
              });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.translate = d.translate;

          var new_items = gItems_enter
                .filter(function(d, j) {
                    return (vars.mark.type == "rect" && d.depth == 2) || (vars.mark.type == "text" && d.depth == 1);
                  })
                .each(vistk.utils.items_mark)

          gItems.select("rect")
                .transition().duration(vars.duration)
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; });

          gItems.select("text")
                .call(vistk.utils.wrap);

        });


        vistk.utils.background_label(vars.title);


      /*

        // Add items graphical mark (DEPTH 2)
        gItems_enter
            .filter(function(d, j) { 
              return d.depth === 2;
            })
            .each(vistk.utils.items_mark)
            .select("rect")
            .style("fill", function(d) {

              return vars.color(d[vars.var_color]);
//              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; });

        cell_enter.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            });

        cell_enter.append("text")
            .attr("x", function(d) { return 10; })
            .attr("y", function(d) { return 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .style("font-size", 15)
            .text(function(d) { 
              if(d.depth === 1) {
                return d.name;
              } else {
                return "";
              }
            //  return d.children ? null : d[vars.var_text].slice(0, 3)+"..."; 
            })

        cell.select("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .classed("focus", function(d, i) { return d.focus; });

*/
      break;
      