      case "matrix":

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        var x = d3.scale.ordinal().rangeBands([0, vars.width]),
            z = d3.scale.linear().domain([0, 4]).clamp(true),
            c = d3.scale.category10().domain(d3.range(10));

          var matrix = [],
              nodes = vars.nodes,
              n = nodes.length;

          // Compute index per node.
          nodes.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
          });

          // Convert links to matrix; count character occurrences.
          vars.links.forEach(function(link) {
            matrix[link.source][link.target].z += link.value;
            matrix[link.target][link.source].z += link.value;
            matrix[link.source][link.source].z += link.value;
            matrix[link.target][link.target].z += link.value;
            nodes[link.source].count += link.value;
            nodes[link.target].count += link.value;
          });

          // Precompute the orders.
          var orders = {
            name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
            count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
            group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
          };

          // The default sort order.
          x.domain(orders.name);

          vars.svg.append("rect")
              .attr("class", "background")
              .attr("width", vars.width)
              .attr("height", vars.height);

          var row = vars.svg.selectAll(".row")
              .data(matrix)
            .enter().append("g")
              .attr("class", "row")
              .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
              .each(row);

          row.append("line")
              .attr("x2", vars.width);

          row.append("text")
              .attr("x", -6)
              .attr("y", x.rangeBand() / 2)
              .attr("dy", ".32em")
              .attr("text-anchor", "end")
              .text(function(d, i) { return nodes[i].name; });

          var column = vars.svg.selectAll(".column")
              .data(matrix)
            .enter().append("g")
              .attr("class", "column")
              .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

          column.append("line")
              .attr("x1", -vars.width);

          column.append("text")
              .attr("x", 6)
              .attr("y", x.rangeBand() / 2)
              .attr("dy", ".32em")
              .attr("text-anchor", "start")
              .text(function(d, i) { return nodes[i].name; });

          function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
              .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.rangeBand())
                .attr("height", x.rangeBand())
                .style("fill-opacity", function(d) { return z(d.z); })
                .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
          }

          function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
          }

          function mouseout() {
            d3.selectAll("text").classed("active", false);
          }

          d3.select("#order").on("change", function() {
            order(this.value);
          });

          function order(value) {
            x.domain(orders[value]);

            var t = vars.svg.transition().duration(2500);

            t.selectAll(".row")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
              .selectAll(".cell")
                .delay(function(d) { return x(d.x) * 4; })
                .attr("x", function(d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
          }

/*
        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER

        // Add a group for marks
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group);

        // Add a graphical mark
        gItems_enter.each(vistk.utils.items_mark);

        // Add an other graphical mark (e.g. text labels)

        // Add a connection mark
        gItems_enter.each(vistk.utils.connect_mark)

        // Add axis
        gItems_enter.each(vistk.utils.axis)

        // Add grid layer

        // EXIT
        var gItems_exit = gItems.exit();

        // POST-UPDATE
        gItems
            .transition();
*/
      break;