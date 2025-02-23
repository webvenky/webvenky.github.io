---
layout: post
title: "Simulation of Target Search and Tracking using Particle Filters"
date: 2016-12-25
comments: true
---

Simulation of Target Search and Tracking using Particle Filters

## Abstract

Determining the view direction for a gimballed camera onboard an S-UAV is critical for aerial surveillance tasks and search-and-rescue missions. We have used the Recursive Bayesian Filter to track the target. We have developed the particle filter method that implements an approximation of the Recursive Bayesian Filter technique. We also developed the k-medoids clustering method for selecting the optimal goal points for search path planning and view direction selection within the visible regions to maximize the chances of seeing a target. Several simulations were performed: without the target, with a static target, target moving in a square path and target moving randomly along the streets. The S-UAV tries to explore and does a full search of the entire region if it loses the target. Also, it carefully chooses the view direction only to clear the possible target locations. It is also able to estimate of the target at a future time through the target's motion model. It attempts to regain sight of the target from the other side of the obstacle when it loses the sight of the target from one side. All these useful features of this method can greatly improve the search task efficiency during a real-time implementation of aerial surveillance. This can also be used with multiple UAVs where the particle distribution will be shared among the different UAVs and other probable locations of targets can be assigned to other UAVs.

Here's a video of a simulation of aerial surveillance in urban regions (Click to play).

<!--[![Simulation of UAV surveillance with ROS and Gazebo](http://img.youtube.com/vi/3aeWXLxOzbw/0.jpg)](https://youtu.be/oHvSGMqYlqQ "Simulation of Target Search and Tracking using Particle Filters")    -->

<div id="outer" style="width:100%; margin:0 auto;text-align:center">  
  <iframe align="center" width="480" height="320" src="https://www.youtube.com/embed/oHvSGMqYlqQ" frameborder="0" allowfullscreen></iframe>
</div>

