---
layout: post
title: "Machine Learning with OpenAI Gym on ROS Development Studio"
date: 2017-05-03
comments: true
---

Machine Learning with OpenAI Gym on ROS Development Studio

## Abstract

Imagine how easy it would be to learn skating, if only it doesn't hurt everytime you fall. Unfortunately, we, humans,  don't have that option. Robots, however, can now "<strong>learn</strong>" their skills on a simulation platform without being afraid of crashing into a wall. Yes, "<strong>it learns</strong>"! This is possible with the reinforcement learning algorithms provided by <a href="https://gym.openai.com/" target="_blank">OpenAI Gym</a> and the ROS Development Studio.


You can now train your robot to navigate through an environment filled with obstacles just based on the sensor inputs, with the help of OpenAI Gym. In April 2016, OpenAI introduced "Gym", a platform for developing and comparing reinforcement learning algorithms. Reinforcement learning is an area of machine learning that allows an intelligent agent (for example, robot) to learn the best behaviors in an environment by trial-and-error. The agent takes actions in an environment so as to maximize its rewards. We have deployed the <a href="https://github.com/erlerobot/gym-gazebo" target="_blank">gym_gazebo</a> package from ErleRobotics Inc. in the ROS Development Studio. It enables the users to test their reinforment learning for their robots in Gazebo.
<h2>How to Train your Robot</h2>
<a href="http://www.theconstructsim.com/wp-content/uploads/2017/04/Maze1.png" rel="attachment wp-att-5866"><img class="size-medium wp-image-5866" src="http://www.theconstructsim.com/wp-content/uploads/2017/04/Maze1-300x127.png" alt="Robot training to navigate through an environment with obstacles" width="600" height="254" /></a> Robot training to navigate through an environment with obstacles[/caption]

In this example we will be seeing how a turtlebot is able to learn navigating through an environment without hitting an obstacle. The turtlebot will use a reinforcement learning method known as Q-learning.

There are four environments already available for the user to test their simulations with. These environments can be launched using the respective launch files:
<ul>
	<li>GazeboCircuitTurtlebotLidar_v0.launch</li>
	<li>GazeboCircuit2TurtlebotLidar_v0.launch</li>
	<li>GazeboRoundTurtlebotLidar_v0.launch</li>
	<li>GazeboMazeTurtlebotLidar_v0.launch</li>
</ul>
The images of the different environments are given below:
<table><caption>The various environments already available:</caption><colgroup> <col width="20%" /> <col width="20%" /> </colgroup>
<tbody>
<tr class="odd">
<td align="center">Circuit
<img style="width: 144px;height: 218px" src="http://www.theconstructsim.com/wp-content/uploads/2017/04/circuit.png" alt="" /></td>
<td align="center">Circuit2
<img style="width: 144px;height: 218px" src="http://www.theconstructsim.com/wp-content/uploads/2017/04/circuit2.png" alt="" /></td>
</tr>
<tr class="even">
<td align="center">Round
<img style="width: 144px;height: 218px" src="http://www.theconstructsim.com/wp-content/uploads/2017/04/round.png" alt="" /></td>
<td align="center">Maze
<img style="width: 144px;height: 218px" src="http://www.theconstructsim.com/wp-content/uploads/2017/04/maze.png" alt="" /></td>
</tr>
</tbody>
</table>
The user is requested to try out the existing environment before developing their own environments for training the robot. An environment is where the robot's possible actions and rewards are defined. For example, in the available environments, there are three possible actions for the Turtlebot robot:

- Forward ( with a reward of 5 points)
- Left ( with a reward of 1 point)
- Right ( with a reward of 1 point)

If it collides into the walls, then the training episode ends (with a penalty of 200 points). The turtlebot has to learn to navigate through the environment, based on the rewards obtained from different episodes. This can be achieved using the Q-learning algorithm. Let us see, how it can be done using the ROS Development Studio.
<h2>Using the ROS Development Studio for training the robot</h2>
First, we have to set the path in the jupyter-notebook as given below:

<pre><code>import sys
sys.path.append("/usr/local/lib/python2.7/dist-packages/")
sys.path.append("/home/ubuntu/gym-gazebo")
sys.path.append("/home/user/catkin_ws/src/gym_construct/src")
%matplotlib inline
</code></pre>

The python scripts in the folder <code>gym_construct/src/</code> help us simulate the reinforcement learning techniques for a Turtlebot. Currently, the number of episodes has been set to 20.
Feel free to increase the number of episodes in the python scripts (usually up to 5000) to actually train the robot to navigate the environment completely.Run the  only the script corresponding to the environment:

Run the python corresponding to the environment:
<pre><code>python /home/user/catkin_ws/src/gym_construct/src/circuit2_turtlebot_lidar_qlearn.py
</code></pre>

The robot undergoes several training episodes and each of these episodes are rewarded based on the number of steps taken by the robot before hitting the environment. We will be able to see that the robot incrementally increases its rewards over time compared to its previous versions. With a very large number of episodes, the robot will learn to navigate the environment without hitting the obstacle.
<h2>Plotting the learning curve of the robot</h2>
The machine learning algorithm generates the output files in the output directory specified in the python script file. In order to plot the curve, we run the <code>display_plot.py</code>. But before that, don't forget to restart the kernel and set the path once again.

<img class="aligncenter size-medium wp-image-5904" src="http://www.theconstructsim.com/wp-content/uploads/2017/05/download2-300x207.png" alt="download2" width="450" height="307" />

As the number of episodes increases, we will see that the robot's mean rewards also increases. The user can choose his own robot, environments, action and rewards for testing his reinforcement learning algorithms in OpenAI Gym and RDS. Watch the video below for more on this.

<h2>Video describing the procedure to run OpenAI Gym on RDS</h2>
<div id="outer" style="width:100%; margin:0 auto;text-align:center">  
  <iframe align="center" width="480" height="320" src="http://www.youtube.com/embed/5Cp9ExbSZsA" frameborder="0" allowfullscreen></iframe>
</div>
<br/>
I hope you were able to follow the tutorial.  So, that's all folks. It's now up to you to develop and test reinforcement learning algorithms in OpenAI Gym and RDS.

Have fun training your robot!

<h2>Credits</h2>

<table><colgroup> <col width="30%" /> <col width="70%" /> </colgroup>
<tbody>
<tr class="odd">
<td align="center">
<img style="width: 200px;height: 75px" src="http://www.theconstructsim.com/wp-content/uploads/2017/05/OpenAI_Logo-300x109.png" alt="" /></td>
<td align="left">Machine Learning Toolkit from OpenAI - (<a href="https://openai.com/" target="_blank">https://gym.openai.com/</a>)</td>
</tr>
<tr class="odd">
<td align="left">
<img style="width: 300px;height: 74px" src="http://www.theconstructsim.com/wp-content/uploads/2017/05/Erle_logo-300x74.png" alt="" /></td>
<td align="left">Simulation package from ErleRobotics - gazebo_gym (<a href="https://github.com/erlerobot/gym-gazebo/" target="_blank">https://github.com/erlerobot/gym-gazebo/</a>)</td>
</tr>
</tbody>
</table>

Deployed in RDS by:
<ul>
	<li>Vengatesan Govindaraju (<a href="http://sg.linkedin.com/in/vengatesang" target="_blank"> LinkedIn Profile </a>)</li>
	<li>Miguel Angel Rodriguez (<a href="https://www.linkedin.com/in/miguelarodriguezm/" target="_blank"> LinkedIn Profile </a>)</li>
</ul>