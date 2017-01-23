---
layout: post
title: "Simple Airplane package for ROS and Gazebo"
date: 2016-09-26
comments: true
---

Simple Airplane package for ROS and Gazebo

The repository can be accessed at [https://github.com/webvenky/simple-airplane](https://github.com/webvenky/simple-airplane)

## Synopsis

This Simple ROS package provides a quick headstart for testing high level path planning / visual servoing algorithms on multiple fixed-wing unmanned aerial vehicles. This package requires Gazebo Simulation environment.
This includes Gazebo plugins that emulate the kinematic constraints of a simple aircraft.
More details will be added in the future. 

## Installation

Just place this ROS package under the src folder of your catkin workspace before running `catkin_make`

(Tested with ROS-Indigo and Gazebo 2.3)

## Example

Run the following commands in different terminal windows

```$ roslaunch simple_airplane_gazebo simple_airplane_empty_world.launch```

```$ rostopic pub /suav1/cam_target geometry_msgs/Point -r 1 -- '2.0' '0.0' '0.0'```

```$ rostopic pub /suav1/cmd_vel geometry_msgs/Twist -r 1 -- '[1.0, 0.0, 0.0]' '[0.0, 0.0, 0.2]'```

Here's a video of a simulation of aerial surveillance in urban regions  (Click to play)..

[![Simulation of UAV surveillance with ROS and Gazebo](http://img.youtube.com/vi/W2Pnz9mk2l8/0.jpg)](https://youtu.be/W2Pnz9mk2l8 "Simulation of UAV surveillance with ROS and Gazebo")    



