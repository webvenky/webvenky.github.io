---
layout: post
title: "Simple Airplane package for ROS and Gazebo"
date: 2016-09-26
comments: true
---

Simple Airplane package for ROS and Gazebo

Click <a href="https://github.com/webvenky/simple-airplane">here</a> to access the web editor.

## Synopsis

This Simple ROS package provides a quick headstart for testing high level path planning / visual servoing algorithms on multiple fixed-wing unmanned aerial vehicles. This package requires Gazebo Simulation environment.

## Installation

Just place this ROS package under the src folder of your catkin workspace before running `catkin_make`

(Tested with ROS-Indigo and Gazebo 2.3)

## Example

Run the following commands in different terminal windows

```$ roslaunch simple_airplane_gazebo simple_airplane_empty_world.launch```

```$ rostopic pub /suav1/cam_target geometry_msgs/Point -r 1 -- '2.0' '0.0' '0.0'```

```$ rostopic pub /suav1/cmd_vel geometry_msgs/Twist -r 1 -- '[1.0, 0.0, 0.0]' '[0.0, 0.0, 0.2]'```

