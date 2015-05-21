      case "treemap":

        vars.evt.register("highlightOn", function(d) {
          vars.svg.selectAll("rect")
            .filter(function(e, j) { return e === d; })
            .classed("focus", true);
        });

        vars.evt.register("highlightOut", function(d) {
          vars.svg.selectAll("rect")
            .classed("focus", false);
        });

        var treemap = d3.layout.treemap()
            .padding(4)
            .sticky(true)
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        // PRE-UPDATE
        var gPoints = vars.svg.data([vars.r]).selectAll("g")
            .data(treemap.nodes);

        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d) { 
                          return "translate(" + d.x + "," + d.y + ")"; 
                        });

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark)

        /*
        // ENTER
        // TODO: turn into a mark creation
        // vistk.utils.items_mark 
        var cell_enter = cell.enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { 
              return "translate(" + d.x + "," + d.y + ")"; 
            });

        cell_enter.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            });

        // TODO: persistent bug when hovering a cell
        cell
          .on("mousemove", function(d) {      
            vars.evt.call("highlightOn", d);
          }).on("mouseout", function(d) {
            vars.evt.call("highlightOut", d);
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
            .on("mouseenter", function(d, i) {
              vars.dispatch.highlightOn(d);
            }).on("mouseout", function(d) {
              vars.dispatch.highlightOut(d);
            });

        // EXIT
        var cell_exit = cell.exit().remove();

        // UPDATE
        cell.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell.select("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .classed("focus", function(d, i) { return d.focus; });

        cell.select("text")
            .call(wrap);
*/
      break;