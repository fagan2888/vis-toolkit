  // Default parameters for all charts
  var default_vars = {

    //
    this_chart: null,

    // Processed dataset used for the visualization
    new_data: null,

    dev : false,
    id : "id",
    id_var : "id",
    var_group: null,

    data: [],

    nodes: [],
    links: [],

    // ids to join the nodes/link data (product space)
    var_node_id: 'id',

    // Displayed on top of the chart
    title: "",

    // Default dimensions, margins and orientation
    width: 800,
    height: 400,
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    rotate: 0,

    // Default mapping variables
    var_color: null,
    var_sort_asc: false,

    // Interaction states
    highlight: [],
    selection: [],
    filter: [],
    zoom: [],

    time: {
      var_time: null,
      current_time: null,
      parse: function(d) { return d; }
    },

    // TABLE
    columns: [],
    sort_by: {'column': 'name', 'asc': true},

    // DOTPLOT
    x_type: "linear",
    x_scale: [],
    x_ticks: 5,
    x_axis: null,
    x_format: function(d) { return d; },
    x_tickSize: 10,
    x_tickPadding: 0,
    x_tickValues: null,
    x_tickRotate: 0,
    x_axis_show: false,
    x_axis_orient: "bottom",
    x_grid_show: false,
    x_text: true,
    x_text_custom: "",
    x_axis_translate: [0, 0],
    x_invert: false,
    x_domain: null,
    x_range: null,

    // SCATTERPLOT (extends DOTPLOT)
    y_type: "linear",
    y_scale: [],
    y_ticks: 5,
    y_axis: null,
    y_format: function(d) { return d; },
    y_tickSize: 10,
    y_tickPadding: 0,
    y_tickValues: null,
    y_axis_show: false,
    y_axis_orient: "left",
    y_grid_show: false,
    y_text: true,
    y_text_custom: "",
    y_axis_translate: [0, 0],
    y_invert: false,
    y_domain: null,
    y_range: null,

    r_scale: null,
    r_domain: null,

    var_cutoff: 'cutoff',

    // Automatically generate UI elements (e.g. time slider, filters)
    ui: true,

    // Locale related options
    lang: 'en_US', // 'es_ES, fr_FR'
    locales: {}, // Translations for various lang

    // Graphical properties for graphical marks
    color: d3.scale.category20c(),
    size: d3.scale.linear(),

    // Events management
    dispatch: [],
    evt: {register: function() {}, call: function() {} },

    // SVG Container
    container: "#viz",
    svg: null,      // Contains the svg element
    root_svg: null, // Contains the group children to the svg element
    ratio: 0.5, // Visualization aspect ratio

    // Animation and interpolation
    duration: 1000,
    interpolate: "monotone",

    layout: {},

    padding: 1,

    // TREEMAP
    treemap_mode: 'squarify',

    treemap: {
      padding: 1,
      d_x: 30,
      d_y: 30,
      depth_text: 1,
      depth_rect: 2
    },

    // STACKED
    offset: null,

    radius: 5,
    radius_min: 2,
    radius_max: 10,

    mark: {
      height: 10,
      width: 10,
      rotate: 0,
      radius: 5,
      fill: function(d) { return vars.color(vars.accessor_values(d)[vars.var_color]); }
    },

    accessor_values: function(d) { return d; },
    accessor_items: function(d) { return d; },

    accessor_static: function(d) { return d; },
    accessor_data: function(d) {
      return d.values[vars.time.current_time];
    },

    // Flags to redraw the whole interface
    refresh: true,
    init: true,
    redraw_all: false,

    // Copy of the user parameters
    _user_vars: {},

    list: {type: ["sparkline", "dotplot", "barchart", "linechart", "scatterplot", "grid",
                  "stacked", "piechart", "slopegraph", "slopegraph_ordinal", "productspace", "treemap", "geomap",
                  "stackedbar", "ordinal_vertical", "ordinal_horizontal", "matrix", "radial",
                  "rectmap", "caterplot", "caterplot_time", "barchart_vertical"],
      mark: ['rect', 'circle', 'star', 'shape']
    },

    // Init by the src/marks/*.js and src/templates/*.js includes
    default_params: {},
    default_marks: {},

    // Order we use to draw the various marks
    z_index: [
    // {selector: '.mark__group', attribute: '__aggregated', type: 'productspace', weight: 1},
      {selector: '.connect__group', type: 'productspace', weight: 1, event: 'highlightOut'},
      {selector: '.mark__group', type: 'productspace', weight: 1, event: 'highlightOut'},
      {selector: '.connect__group', attribute: '__highlighted', type: 'productspace', weight: 1, event: 'highlightOn'},
      {selector: '.mark__group', attribute: '__highlighted', type: 'productspace', weight: 1, event: 'highlightOn'},
      {selector: '.mark__group', attribute: '__highlighted__adjacent', type: 'productspace', weight: 1, event: 'highlightOn'},
      {selector: '.mark__group', attribute: '__highlighted', type: 'scatterplot', weight: 1, event: 'highlightOn'},
    ],

    // Used for aggregation
    set: [],

    scale: 1,
    translate_x: 0,
    translate_y: 0,
    translate: [0, 0],

    // WIP for option not to use groups for elements
    flat_scene: false
  };

  vars = vistk.utils.merge(vars, default_vars);
