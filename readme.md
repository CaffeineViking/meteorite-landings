Visualizing "Meteorite Landings" using Brushing and Filtering
===========================================================

<p align="center">
    <img src="/assets/example.png" alt="Meteorite Landings"/>
</p>

* [*"Investigating Meteorite Landings with Filtering and Brushing"*](https://eriksvjansson.net/papers/imlbfg.pdf) by Erik S. V. Jansson (2016) for "Information Visualization"

Interacting
-----------

Use the mouse to drag the map around, and scroll to zoom in/out. You can press the meteorite classes and masses to filter by that value, press it again to disable the filter. You can drag a range in the timeline in the bottom of the page to filter by time of impact, which filters the results further. Hovering over a meteorite impace will give you more information about it, such as name/class/mass. The rest you can probably figure out on your own. 

Technology
----------

Uses `d3` for drawing and `topojson` for the actual map. The rest is the usual web-based "stack": HTML, Javascript and CSS.

Copyright
---------

The "Meteorite Landings" dataset belongs to NASA, and is being used for research purposes, I don't claim any sort of ownership of it. I also don't claim ownership of any libraries that are bundled with the webapp, such as d3. The favicon is under the public domain (see the license).
