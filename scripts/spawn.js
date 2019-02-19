function notice() {
    var message = "'Meteorite Landings' © 2017 Erik S. Vasconcelos Jansson is distributed under 'The MIT License'.";
    message  += "\n'Meteorite Landings Dataset' © The Meteoritical Society and NASA is under public domain/access.";
    message  += "\n'Meteorite Impact Icon' © Oliviu Stoian from the Noun Project is distributed under the C.C 3.0.";
    console.log(message);
}

function main() {
    // Set these if some margin is desired for the screen.
    var margin = { top: 0, left: 0, bottom: 0, right: 0 };
    var fullDisplayContainer = d3.select("#full-display");
    // Applies the margin to the container and scales them down.
    fullDisplayContainer.style("margin", margin.top    + "px " +
                                         margin.right  + "px " +
                                         margin.bottom + "px " +
                                         margin.left   + "px");

    var timeFormat = d3.time.format.utc("%Y");
    var filterParameters = { meteoriteMass: undefined,
                             meteoriteClass: undefined,
                             meteoriteStart: undefined,
                             meteoriteEnd: undefined };
    var filter = function() {
        // Below we attempt to filter data points with above parameters.
        svgDataPointGroup.selectAll(".point").style("display", function(d) {
            var withinClass = filterParameters.meteoriteClass == undefined
                              || d["type"] == filterParameters.meteoriteClass;
            var withinMass = filterParameters.meteoriteMass == undefined
                             || Math.log10(d["mass"]) >= filterParameters.meteoriteMass;
            var withinTime = (filterParameters.meteoriteStart == undefined
                              || filterParameters.meteoriteEnd == undefined)
                             || (d["date"] >= filterParameters.meteoriteStart
                                 && d["date"] <= filterParameters.meteoriteEnd);
            if (withinClass && withinMass && withinTime) return null;
            else return "none";
        });
    }

    // Fetch and set the initial size of the charts.
    var width  = fullDisplayContainer.style("width");
    var height = fullDisplayContainer.style("height");
    width  = parseInt(width) - margin.left - margin.right;
    height = parseInt(height) - margin.top - margin.bottom;
    var aspectRatio = width / height; // Either 16:9 or 10.

    var svgContainer = fullDisplayContainer.append("svg")
                       .attr("width", width).attr("height", height)
                       .attr("viewBox", "0 0 " + width + " " + height)
                       .attr("preserveAspectRatio", "xMidYMid meet")
                       .attr("class", "view").attr("opacity", 0.0);
    var svgMercatorGroup  = svgContainer.append("g").attr("class", "mercator");
    var svgOverlayGroup = svgContainer.append("g").attr("class", "overlay");
    svgOverlayGroup.append("rect").attr("width", width).attr("height", height).attr("opacity", 0);
    var svgDataPointGroup = svgContainer.append("g").attr("class", "datapoint");
    var svgInterfaceGroup = svgContainer.append("g").attr("class", "interface");
    var svgBrushGroup = svgInterfaceGroup.append("g").attr("class", "brush");
    svgBrushGroup.attr("transform", "translate(0, " + (height - 32) + ")");
    var svgLegendGroup = svgInterfaceGroup.append("g").attr("class", "legend");
    svgLegendGroup.attr("transform", "translate(8, " + (height-240-60) + ")");

    // Start adding the legend toolbar on the left side, lots of manual work... Skip this?
    svgLegendGroup.append("rect").attr("opacity", 0.50).attr("width", 160).attr("height", 240);
    svgLegendGroup.append("text").attr("class", "legend-title").attr("x", 0).attr("y", -8).text("Meteorite Classes");

    svgLegendGroup.append("circle").attr("class", "legend-circle").attr("cx", 110).attr("cy", 50)
                                   .attr("rr", Math.log10(10000000)).attr("r", Math.log10(1000000));
    svgLegendGroup.append("circle").attr("class", "legend-circle").attr("cx", 110).attr("cy", 140)
                                   .attr("rr", Math.log10(100000)).attr("r", Math.log10(100000));
    svgLegendGroup.append("circle").attr("class", "legend-circle").attr("cx", 110).attr("cy", 210)
                                   .attr("rr", Math.log10(1000)).attr("r", Math.log10(1000));

    svgLegendGroup.append("text").attr("class", "legend-text-black").attr("text-anchor", "middle")
                                 .attr("x", 140).attr("y", 32).text("10⁷");
    svgLegendGroup.append("text").attr("class", "legend-text-black").attr("text-anchor", "middle")
                                 .attr("x", 140).attr("y", 122).text("10⁵");
    svgLegendGroup.append("text").attr("class", "legend-text-black").attr("text-anchor", "middle")
                                 .attr("x", 140).attr("y", 202).text("10³");
    svgLegendGroup.append("text").attr("class", "legend-text-black").attr("font-weight", "bold")
                                  .attr("text-anchor", "middle").attr("x", 112).attr("y", 32).text("kg");

    // Setup the timeline brushing graphics down below...
    var svgUnselectedGroup = svgBrushGroup.append("g").attr("class", "brush-unselected");
        svgUnselectedGroup.append("rect") .attr("width", width).attr("height", 32);
    var svgSelectedGroup = svgBrushGroup.append("g").attr("class", "brush-selected");
    var svgSelectedLeftHook = svgSelectedGroup.append("path").attr("class", "brush-selected-left");
    var svgSelectedRightHook = svgSelectedGroup.append("path").attr("class", "brush-selected-right");;
    var svgSelectedMoveHook = svgSelectedGroup.append("rect").attr("height", 32).attr("x", 8)
                                              .attr("class", "brush-selected-move");

    var svgPointTooltip = svgInterfaceGroup.append("g").attr("class", "point-tooltip");
    svgPointTooltip.append("rect").attr("opacity", 0.75).attr("width", 320).attr("height", 142);
    svgPointTooltip.append("path").attr("class", "point-tooltip-bottom").attr("d", "M 152 142 L 160 150 L 168 142 z").attr("opacity", 0.75).attr("display", "none");
    svgPointTooltip.append("path").attr("class", "point-tooltip-right").attr("d", "M 320 71 L 328 79 L 320 88 z").attr("opacity", 0.75).attr("display", "none");
    svgPointTooltip.append("path").attr("class", "point-tooltip-left").attr("d", "M 0 63 L -8 71 L 0 80 z").attr("opacity", 0.75).attr("display", "none");
    svgPointTooltip.append("path").attr("class", "point-tooltip-top").attr("d", "M 152 0 L 160 -8 L 168 0 z").attr("opacity", 0.75).attr("display", "none");
    svgPointTooltip.append("text").attr("class", "point-tooltip-title point-tooltip-name").attr("x", 14).attr("y", 30);
    svgPointTooltip.append("text").attr("class", "point-tooltip-text point-tooltip-class").attr("x", 14).attr("y", 64);
    svgPointTooltip.append("text").attr("class", "point-tooltip-text point-tooltip-mass").attr("x", 14).attr("y", 84);
    svgPointTooltip.append("text").attr("class", "point-tooltip-text point-tooltip-falling").attr("x", 14).attr("y", 104);
    svgPointTooltip.append("text").attr("class", "point-tooltip-text point-tooltip-year").attr("x", 14).attr("y", 124);

    var svgBrushTooltipPositionY = height - 32 - 488;
    var svgBrushTooltip = svgInterfaceGroup.append("g").attr("class", "brush-tooltip");
    svgBrushTooltip.append("rect").attr("opacity", 0.75).attr("width", 480).attr("height", 480);
    svgBrushTooltip.append("path").attr("d", "M 232 480 L 240 488 L 248 480 z").attr("opacity", 0.75);
    svgBrushTooltip.attr("transform", "translate(0, " + (svgBrushTooltipPositionY) + ")");

    var previousScaling = 1.0;
    var zoom = d3.behavior.zoom().size([width, height]).scaleExtent([1, 12]).on("zoom", function() {
        var translation = d3.event.translate;
        var scaling = d3.event.scale;
        var scaledWidth  = width * scaling; var scaledHeight = height * scaling;

        if (translation[0] > 0.0) translation[0] = 0.0; // Checks the horizontal bounds.
        else if (translation[0] + scaledWidth < width) translation[0] = width - scaledWidth;
        if (translation[1] > 0.0) translation[1] = 0.0; // Checks the vertial map bounds too.
        else if (translation[1] + scaledHeight < height) translation[1] = height - scaledHeight;

        zoom.translate(translation); // Applies transformtion on the svg container.
        var transform = "translate("  +  translation  +  ")scale(" + scaling + ")";
        svgDataPointGroup.style("stroke-width", 1/scaling).attr("transform", transform);
        svgMercatorGroup.style("stroke-width", 1/scaling).attr("transform", transform);

        svgPointTooltip.style("opacity", 0.0);
        if (previousScaling != scaling) {
            svgLegendGroup.selectAll(".legend-circle").attr("r", function() {
                return d3.select(this).attr("rr") * scaling / Math.log10(10*scaling);
            });
            svgDataPointGroup.selectAll(".point").attr("r", function() {
                return d3.select(this).attr("rr") / Math.log10(10*scaling);
            });
        }

        previousScaling = scaling;
    }); svgOverlayGroup.call(zoom);

    // Thereafter, update them when resizing.
    d3.select(window).on("resize", function() {
        width  = fullDisplayContainer.style("width");
        width  = parseInt(width) - margin.left - margin.right;
        svgContainer.attr("height", width / aspectRatio)
                    .attr("width", width);
    });

    // Create a map of the world by using topojson + svg.
    d3.json("assets/world.json", function(error, world) {
        if (error) return console.error(error);
        var countries = topojson.feature(world,
                      world.objects.countries);

        // Below we setup the preliminary path and scale.
        // We are later going to do this again, but doing
        // a centering and re-scaling towards the screen.

        var scales = 150.0;
        var center = d3.geo.centroid(countries);
        center[0] -= 29.0; center[1] -= 5.0; // Fiddle...
        var projection = d3.geo.mercator().center(center)
                           .translate([width/2,height/2])
                                          .scale(scales);
        var path = d3.geo.path().projection(projection);

        // Below we calculate the bounds of the initial world map, then
        // we use these to calculate the required rescaling of the map.
        // This is done by choosing if height or width are to be given.

        var bounds = path.bounds(countries);
        var horizontal = scales*width / (bounds[1][0] - bounds[0][0]);
        var vertical = scales*height  / (bounds[1][1] - bounds[0][1]);
        scales = (horizontal > vertical) ? horizontal : vertical;
        var offset = [width  - (bounds[0][0] + bounds[1][0]) / 2,
                      height - (bounds[0][1] + bounds[1][1]) / 2];

        // Finally, we create the actual projection we want and we
        // thereafter create the corresponding SVG path objects...

        projection = d3.geo.mercator().center(center)
                                      .translate(offset)
                                      .scale(scales);
        path  = d3.geo.path().projection(projection);

        cnt = countries.features; // Extracts the raw row data.

        // After a lot of pain we append the actual SVG polygon.
        var world = svgMercatorGroup.selectAll(".country-path").data(cnt)
                                    .enter().insert("path")
                                    .attr("d",   path) // Make path.
                                    .attr("id", function(d) { return d.id; })
                                    .attr("class",   "country-path");


        // Load the dataset and thereafter create our representation.
        d3.csv("assets/meteorites.csv", function(error, meteorites) {
            if (error) return console.error(error);
            // Let's remove data points before the 10's.
            meteorites = meteorites.filter(function(d, i) {
                if (d["year"] < 1909) return false;
                else return true;
            });

            var timeline = d3.time.scale().range([0, width]);
            var timelineBrush = d3.svg.brush().x(timeline)
                         .on("brush", function() {
                var timeExtent = timelineBrush.extent();
                var brushExtent = [timeline(timeExtent[0]), timeline(timeExtent[1])];
                if (Math.abs(brushExtent[1] - brushExtent[0]) >= 16) {
                    filterParameters.meteoriteEnd = timeExtent[1];
                    filterParameters.meteoriteStart = timeExtent[0];
                    svgSelectedLeftHook.attr("d", "M " + brushExtent[0] + " 16 L " + (brushExtent[0] + 8) + " 0 L " + (brushExtent[0] + 8) + " 32 z");
                    svgSelectedRightHook.attr("d", "M " + brushExtent[1] + " 16 L " + (brushExtent[1] - 8) + " 0 L " + (brushExtent[1] - 8) + " 32 z");
                    svgSelectedMoveHook.attr("width", brushExtent[1] - brushExtent[0] - 16).attr("height", 32).attr("x", brushExtent[0] + 8);
                } else {
                    svgSelectedLeftHook.attr("d", "");
                    svgSelectedRightHook.attr("d", "");
                    filterParameters.meteoriteEnd = undefined;
                    filterParameters.meteoriteStart = undefined;
                    svgSelectedMoveHook.attr("width", null).attr("height", 32).attr("x", brushExtent[0] + 8);
                }

                filter(); // Actually filter stuff out now.
            });

            timeline.domain(d3.extent(meteorites, function(d) {
                return timeFormat.parse(d["year"]);
            })); svgUnselectedGroup.call(timelineBrush);

            // Add the year/date timeline axis to represent.
            var timelineAxis = d3.svg.axis().scale(timeline)
                                            .orient("top")
                                            .ticks(d3.time.year, 5)
                                            .tickFormat(d3.time.format("%Y"));
            svgUnselectedGroup.append("g").attr("class", "axis")
                              .attr("transform", "translate(0, " + 6 + ")")
                              .call(timelineAxis)
                              .selectAll(".tick text")
                              .style("text-anchor", "start")
                              .attr("y", -12);

            // Filter out small classes.
            var meteoriteClasses = {  };
            meteorites.forEach(function(d) {
                if (!meteoriteClasses[d["class"]])
                    meteoriteClasses[d["class"]] = 0;
                meteoriteClasses[d["class"]] += 1;
            });

            var nextColor = 0;
            var meteoriteOtherClasses = 0;
            var colors = ['#a6cee3','#1f78b4','#b2df8a',
                          '#33a02c','#fb9a99','#e31a1c',
                          '#fdbf6f','#ff7f00','#cab2d6'];

            var meteoriteClassColors = {};
            for (var k in meteoriteClasses) {
                if (meteoriteClasses[k] < 256) {
                    delete meteoriteClasses[k];
                    meteoriteOtherClasses += 1;
                } else {
                    meteoriteClassColors[k] = colors[nextColor];
                    nextColor += 1;
                }
            }

            meteoriteClassColors["other"] = colors[8];
            meteoriteClasses["other"] = undefined;

            // Cache the parsing of the year, which is very slow (not on each point).....
            meteorites.forEach(function(d) {
                d["date"] = timeFormat.parse(d["year"]);
                var type = "other";
                for (var k in meteoriteClasses) {
                    if (k == d["class"]) {
                        type = k;
                        break;
                    }
                } d["type"] = type;
            });

            var legendXOffset = 14.0,
                legendYOffset = 14.0;
            for (var k in meteoriteClasses) {
                svgLegendGroup.append("rect").attr("class", "legend-rect")
                                             .attr("fill", function() { classColor = meteoriteClassColors[k];
                                                           return (classColor != undefined ? classColor : colors[8]); })
                                             .attr("stroke", function() { classColor = meteoriteClassColors[k];
                                                             return (classColor != undefined ? classColor : colors[8]); })
                                             .attr("width", 14).attr("height", 14).attr("x", legendXOffset)
                                             .attr("y", legendYOffset).attr("classy", k);
                svgLegendGroup.append("text").attr("class", "legend-text")
                                             .attr("x", legendXOffset + 25)
                                             .attr("y", legendYOffset + 12)
                                             .text(k);
                legendYOffset += 25;
            }

            svgLegendGroup.selectAll(".legend-rect").on("click", function() {
                svgLegendGroup.selectAll(".legend-rect").style("stroke",
                    function(d) { return d3.select(this).style("fill"); });
                var meteoriteClass = d3.select(this).attr("classy");
                if (filterParameters.meteoriteClass == meteoriteClass)
                    filterParameters.meteoriteClass = undefined;
                else {
                    d3.select(this).style("stroke", "#000000");
                    filterParameters.meteoriteClass = meteoriteClass;
                }

                filter();
            });

            svgLegendGroup.selectAll(".legend-circle").on("click", function() {
                svgLegendGroup.selectAll(".legend-circle").style("stroke",
                    function() { return d3.select(this).style("fill"); });
                var meteoriteMass = d3.select(this).attr("rr");
                if (filterParameters.meteoriteMass == meteoriteMass)
                    filterParameters.meteoriteMass = undefined;
                else {
                    d3.select(this).style("stroke", "#000000");
                    filterParameters.meteoriteMass = meteoriteMass;
                }

                filter();
            });

            svgDataPointGroup.selectAll(".point").data(meteorites).enter()
                            .append("circle").attr("class", "point").attr("fill", function(d) { classColor = meteoriteClassColors[d["class"]];
                                                                                 return (classColor != undefined ? classColor : colors[8]); })
                                                                    .attr("stroke", function(d) { classColor = meteoriteClassColors[d["class"]];
                                                                                 return (classColor != undefined ? classColor : colors[8]);  })
                            .attr("cx", function(d) { return projection([parseFloat(d["longitude"]), parseFloat(d["latitude"])])[0]; })
                            .attr("cy", function(d) { return projection([parseFloat(d["longitude"]), parseFloat(d["latitude"])])[1]; })
                            .attr("r",  function(d) { return Math.log10(d["mass"]); })
                            .attr("rr", function(d) { return Math.log10(d["mass"]); })
                            .on("mousemove", function(d, i) {
                                this.parentNode.appendChild(this);
                                d3.select(this).style("cursor", "pointer");
                                svgPointTooltip.select(".point-tooltip-name").text(d["name"]);
                                svgPointTooltip.select(".point-tooltip-class").text("Meteorite class: " + d["class"]);
                                svgPointTooltip.select(".point-tooltip-mass").text("Mass in kilograms: " + (parseFloat(d["mass"]) / 1000.0).toFixed(2));

                                var seenFalling = d["fall"] == "Fell" ? "yes" : "no (found)";
                                svgPointTooltip.select(".point-tooltip-falling").text("Seen falling: " + seenFalling);
                                svgPointTooltip.select(".point-tooltip-year").text("Year found/seen: " + d["year"]);

                                var x = d3.event.clientX, y = d3.event.clientY;
                                var leftDistance = x, rightDistance = width - x;
                                var upDistance = y, downDistance = height - y;
                                var horizontalDistance = Math.min(leftDistance, rightDistance);
                                var verticalDistance = Math.min(upDistance, downDistance);

                                var alignHorizontal = horizontalDistance < verticalDistance;
                                var alignUp = upDistance < downDistance;
                                var alignLeft = leftDistance < rightDistance;

                                svgPointTooltip.select(".point-tooltip-left").attr("display", "none");
                                svgPointTooltip.select(".point-tooltip-right").attr("display", "none");
                                svgPointTooltip.select(".point-tooltip-top").attr("display", "none");
                                svgPointTooltip.select(".point-tooltip-bottom").attr("display", "none");

                                if (alignHorizontal) {
                                    y -= 74;
                                    if (alignLeft) {
                                        x += 32;
                                        svgPointTooltip.select(".point-tooltip-left").attr("display", null);
                                    } else {
                                        x -= 320 + 32;
                                        svgPointTooltip.select(".point-tooltip-right").attr("display", null);
                                    }
                                } else {
                                    x -= 160;
                                    if (alignUp) {
                                        y += 32;
                                        svgPointTooltip.select(".point-tooltip-top").attr("display", null);
                                    } else {
                                        y -= 142 + 32;
                                        svgPointTooltip.select(".point-tooltip-bottom").attr("display", null);
                                    }
                                }

                                svgPointTooltip.attr("transform", "translate(" + x + "," + y + ")");
                                svgPointTooltip.style("opacity", 1.0);
                            })
                            .on("mouseout", function(d, i) {
                                d3.select(this).style("cursor", "default");
                                svgPointTooltip.style("opacity", 0.0);
                            });
            svgContainer.style("opacity", 1.0);
        });
    });
}
