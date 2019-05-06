Visualizing Meteorite Landings using Brushing and Filtering
===========================================================

<p align="center">
    <img src="/assets/example.png" alt="Meteorite Landings"/>
</p>

Here is a very simple (and inefficient) webapp for visualizing the classic NASA "Meteorite Landings" dataset by using D3 and the usual web development stack (HTML, Javascript and CSS). It uses brushing and filtering to make the visualization easier. There are a lot of improvements that could be done, such as adding a clustering algorithm and actually running this on the GPU. The app also allows you to filter by time of impact (see the timeline in the screenshot above). It was made for TNM048 "Information Visualization" (2016) course at Linköping University. I've also written a short "report" and presentation on it:

* [*"Investigating Meteorite Landings with Filtering and Brushing"*](https://eriksvjansson.net/papers/imlbfg.pdf) by Erik S. V. Jansson (2016) for "Information Visualization"

Running It
----------

Just open `index.html`. No need to open a `localhost` server or stuff like that as there is no node.js crap here (thank god).

Interacting
-----------

Use the mouse to drag the map around, and scroll to zoom in/out. You can press the meteorite classes and masses to filter by that value, press it again to disable the filter. You can drag a range in the timeline in the bottom of the page to filter by time of impact, which filters the results further. Hovering over a meteorite impace will give you more information about it, such as name/class/mass. The rest you can probably figure out on your own. 

Technology
----------

Uses `d3` for drawing and `topojson` for the actual map. The rest is the usual web-based "stack": HTML, Javascript and CSS.

Copyright
---------

The "Meteorite Landings" dataset belongs to NASA, and is being used for research purposes, I don't claim any sort of ownership of it. I also don't claim ownership of any libraries that are bundled with the webapp, such as d3. The favicon is under the public domain (see the license).
