---
layout: post
title: "Abstract of my research"
date: 2016-03-01
comments: false
---

<b> Abstract </b>

<!-- <p style="text-align:justify">
Small-Unmanned Aerial Vehicles (S-UAVs) have emerged as low-cost alternatives for aerial surveillance over cluttered environments such as forests and urban regions. However, they provide limited coverage owing to their low altitudes and short endurance. Therefore, a quick and effective surveillance necessitates optimal flying paths, maximizing ground visibility. The occlusion of ground points due to obstacles and vegetation is significant and has to be considered for designing the flight path. My research proposes probabilistic sensing model, faster visibility computations and also considers kinematic constraints of the vehicle to determine near-optimal flight paths for multiple S-UAVs. Simulation studies conducted on synthetic terrains and a reconstructed terrain, from satellite data of tree-cover and Digital Elevation Model (DEM), show the effectiveness of the proposed methods in improving the ground visibility.
</p> -->

<p style="text-align:justify">
Small-Unmanned Aerial Vehicles (S-UAVs) provide significant advantages in several civilian applications such as search-and-rescue
operations in disaster regions, anti-poaching operations, and policing
for civil security. In essence, they provide a low-cost alternative for
obtaining a better situational awareness through a bird’s-eye view of
unreachable locations. However, their effective coverage area is starkly
reduced by the presence of occlusions in the field-of-view(FOV) of the
sensor. In this work, to obtain a quick and effective aerial surveillance, three path planning strategies are developed that enhancesground/target visibility.</p>
<p style="text-align:justify">
The first path planning approach improves the ground visibility over
large cluttered environments with vegetation. Visibility occlusions
are considered in two forms: partial occlusions due to vegetation
and complete occlusions due to buildings and terrains. The gradual
reduction in visibility along the line-of-sight(LOS) due to foliage
in a forested region is modeled probabilistically using the crown
cover density of that region. To obtain near-uniform visibility of the
ground points, the waypoints (also the imaging points) are set as the
generator points of a Centroidal Voronoi Tessellation(CVT). The CVT
is computed with a combination of the forest crown cover density and
the topographical profile as the density distribution function. The
Dubin’s flight path through these waypoints is solved by an improved
spiral-alternating algorithm. Visibility with the proposed method
is computed for: (1) a synthetically generated forest terrain, and
(2) actual satellite tree cover data & digital elevation model. It is
then compared with the visibility from regular grid based observation
points.</p>
<p style="text-align:justify">
The second path planning approach optimizes both the duration of
a target visibility and path length in an urban environment. For an
urban region modelled in the form of 3D occupancy grids, determination of from-point visibility is computationally very expensive. In this
work, we utilize a parallel Fast-marching method(FMM) to compute
the 3D visibility for real-time applications. This work also attempts
to standardize the selection of urban models for simulation studies by
different researchers. A Visibility-Based Fast-Marching field is constructed to function as the cost field for the path planning. A 2-step
finite horizon local path planner is also proposed that incorporates
the kinematic constraints of the UAV and collision avoidance. This
algorithm is compared with a simple shortest path planner.</p>
<p style="text-align:justify">
Another path planning strategy is proposed for searching and tracking
a moving target in urban environments. An algorithm to determine
the camera footprint for a given view direction from the S-UAV is
developed. The target detection is achieved through color segmentation and the target is localized in the world coordinate system with
photogrammetry. It is assumed that the target’s position is not known
to the S-UAV and it estimates the target location using particle filters.
We also developed the k-medoids clustering method for selecting the
best goal points for path planning and best view directions for the
two-axis gimballed camera.</p>
<p style="text-align:justify">
Highly realistic simulations are performed using the Robot Operating System(ROS) and the Gazebo platform. The results show the
effectiveness of the proposed path planning methods in enhancing the
visibility of targets in cluttered environments (buildings and trees).
</p>

<p style="text-align:justify">
Concepts Used:
	<ul>
	<li>Path planning - Sampling based path planners, 2 step finite horizon path planner, Clustered Spiral Alternating Path planner</li>
	<li>Waypoint deployment - Centroidal Voronoi Tessellations </li>
	<li>Robot Dynamics -  Fixed wing UAV model, Dubin's path, Deformable B-Spline paths </li>
	<li>Robot Localization/ Tracking - Recursive Bayesian Filters, Particle filters </li>
	<li>Visibility Computation - Fast Marching Methods</li>
	</ul>
</p> 