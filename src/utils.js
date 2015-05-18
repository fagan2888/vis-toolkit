vistk.utils.add_mark = function(d, i) {

  if(typeof vars.mark != "undefined") {

    switch(vars.mark.type) {

      case "circle":

        d3.select(this).append("circle")
                        .attr("r", 5)
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("class", "dot__circle");

        break;

      case "rect":

       d3.select(this).append("rect")
                        .attr("height", vars.mark.height)
                        .attr("width", vars.mark.width)                              
                        .attr("x", -vars.mark.width/2)
                        .attr("y", -vars.mark.height/2)
                        .attr("class", "dot__circle");

        break;

      case "diamond":

       d3.select(this).append("rect")
                        .attr("height", vars.mark.height)
                        .attr("width", vars.mark.width)                              
                        .attr("x", -vars.mark.width/2)
                        .attr("y", -vars.mark.height/2)
                        .attr("class", "dot__circle")
                        .attr("transform", "rotate(45)")

        break;
    }

  }

}

// TODO: add accessor as argument and var_time
vistk.utils.flatten_years = function(data) {
    var flat = [];

    //for each country
    data.forEach(function(root) {
      
        //for each year in each country
        root.years.forEach(function(year) {
            //extend the year object with the common properties stored just once in the country object

          var current_year = merge(root, year);
          delete current_year.years;

            //add it to the final flat array
            flat.push(current_year);
        })
    });

    return flat;
}

// UTIS FUNCTIONS

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
var merge = function() {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};

// One way to wrap text.. but creates too many elements..
// http://bl.ocks.org/mbostock/7555321

function wrap(text, width) {

  text.each(function() {

    width = d3.select(this).data()[0].dx;

    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function find_node_by_id(id) {
  var res = vars.nodes.filter(function(d) {
    return d.id == id;
  })[0];

  if(typeof res == "undefined")
    console.log("id not found", id)

  return res;
}

function find_data_by_id(id) {
  var res = new_data.filter(function(d) {
    return d[vars.var_id] == +id;
  })[0];

  if(typeof res == "undefined")
    console.log("Data id not found", id)

  return res;
}

function update_filters(value, add) {
  if(vars.dev) console.log("[update_filters]", value);  
  // If we add a new value to filter
  if(add) {
    if(vars.filter.indexOf(value) < 0) {
      vars.filter.push(value)
    }
  } else {
    var index = vars.filter.indexOf(value)
    if(index > -1)
      vars.filter.splice(index, 1);
  }
}
