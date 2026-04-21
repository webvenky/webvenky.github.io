---
layout: post
title: "Understanding VLA"
date: 2026-04-21
category: robotics
author: Venky Govind
tags: [robotics, machine-learning, VLA]
summary: Vision-Language-Action models bridge perception and motor control for robotic manipulation.
comments: true
math: true
---

## Introduction: Bridging AI and Physical Robotics

If you have taken an undergraduate robotics course, you are likely familiar with controlling a standard 6 Degrees of Freedom (6-DoF) robot arm equipped with a 1-DoF gripper. Traditionally, getting this arm to pick up an object requires a pipeline of isolated steps: object detection, camera-to-world calibration, path planning, and computing inverse kinematics.

Vision-Language-Action (VLA) models collapse this rigid, brittle pipeline. Instead of relying on hardcoded math to bridge perception and movement, a VLA acts as an end-to-end "brain." You feed it a camera image and a natural language command (e.g., "pick up the red block"), and the model outputs the precise motor commands for your 6-DoF arm and gripper.

But how does a language model know how to move a physical motor? To understand this, we have to look at how these models are architected.

## 2. What a VLA Model Receives

A Vision-Language-Action model starts by taking in a snapshot of the world and the robot's current physical state. For a standard 6-DoF robot arm with a gripper, the inputs must be rich enough to understand both the geometry of the workspace and the mechanics of the arm.

The standard inputs for a state-of-the-art VLA like Physical Intelligence's π0 (Pi-Zero) include:

- **Multi-View Vision:** A single camera is rarely enough because the robot's own arm will block its view (occlusion). VLAs typically ingest synchronized RGB video streams from 2 to 3 cameras (e.g., an external fixed camera looking at the scene, and a "wrist camera" mounted right above the gripper) running at 10 to 50 Hz.

- **Proprioception (Robot State):** The model needs to know its own body configuration. This includes the current angles of all 6 joints, the speed they are moving, and the open/closed state of the gripper.

- **Language Instructions:** The text command from the human (e.g., "assemble the box").

- **Force and Tactile Data (Emerging):** While early VLAs only used vision and joint angles, newer architectures are beginning to integrate force-torque sensors at the wrist or even tactile sensors on the gripper tips. This allows the model to "feel" when a block snaps into place or when it is gripping a delicate object too tightly.

The model's VLM backbone (such as PaliGemma) takes these diverse inputs—images, text, and numerical sensor data—and mathematically projects them into a single, unified "embedding space." Once vision, language, and the robot's physical state are fused together, the model has a complete understanding of the scene and can decide how the arm should move next.

## 3. From Action Tokens to Continuous Control

Now that we know what information a VLA receives, the next question is simple: how does the model decide the robot's next movement?

For a 6-DoF robot arm with a gripper, the output is not just a label like "pick" or "place." The model must produce a precise motion for each joint and also decide how the gripper should open or close. That is much harder than generating words, because robot motion is continuous and must stay physically smooth.

### 3.1 The first idea: action tokens

One early approach was to represent robot actions the same way language models represent words: as discrete tokens. Early VLA methods therefore converted continuous robot actions into a finite set of action tokens, so the model could predict actions one token at a time.

This idea is attractive because it lets researchers reuse the same next-token prediction framework that already works well in large language models. But a robot joint angle or end-effector pose is not naturally discrete, so turning motion into bins introduces quantization error and can make control less precise.

You can think of this as rounding every movement to the nearest allowed command. That may work for coarse tasks, but it becomes limiting when the robot must make small corrections during insertion, grasp adjustment, or contact-rich manipulation.

### 3.2 A short introduction to diffusion models

To understand the newer approach, it helps to first look at diffusion models.

A diffusion model learns to generate data by starting from noise and gradually transforming that noise into a meaningful output. In image generation, that output could be a picture; in robotics, the output can be an action trajectory or a sequence of control values.

The intuition is simple: instead of asking the model to guess the final answer in one step, we let it refine an initially random guess over multiple steps. Each step removes some of the noise and pushes the sample closer to a valid result.

This idea is useful in robotics because action generation is complicated. There may be many valid ways to reach for an object, and a generative model can learn a whole distribution of plausible motions rather than a single hardcoded rule.

### 3.3 From diffusion to flow matching

Flow matching is closely related in spirit, but it reframes the generation process in a cleaner way.

Instead of learning how to reverse a noisy corruption process step by step, flow matching learns a continuous velocity field that tells the model how a sample should move from noise toward a valid action. In other words, the model learns the direction and speed of change needed to turn an initial random action into a useful robot command.

That makes the idea easier to picture: imagine placing a leaf in a river. The velocity field describes how the water should carry that leaf from its starting point to its destination. In a VLA, the "leaf" is an initial noisy action, and the destination is a smooth motion for the robot arm.

For students, the key difference is this:

- Diffusion often emphasizes gradual denoising.
- Flow matching emphasizes learning the continuous path of transformation from noise to action.

### 3.4 Why flow matching fits robot control

This matters because robots operate in continuous space. Joint angles, wrist poses, velocities, and gripper motion are all real-valued quantities, so a continuous generative method is a natural fit.

Physical Intelligence's π0 uses conditional flow matching instead of discrete action tokenization for robot control. In π0, the model conditions on visual inputs, language instructions, and robot state, then generates continuous actions for the arm and gripper rather than emitting tokenized motion commands.

This design helps the robot produce smoother and more precise behavior. Reports describing π0 note that it can output continuous control at 50 Hz, which is much better aligned with real robot execution than slow token-by-token decoding.

### 3.5 The main takeaway

So the historical progression is:

1. First, researchers tried to make robot actions look like language tokens.
2. Then generative approaches inspired by diffusion offered a better way to model many possible continuous motions.
3. Flow matching pushed this further by directly learning how actions should continuously evolve from noise into usable motor commands, which is the idea used in π0.

## 4. Case Study: The Architecture of π0 and π0.5

To see how continuous generative control works in practice, we can look at Physical Intelligence's **π0** (Pi-Zero), a state-of-the-art vision-language-action flow model. Rather than building a new model from scratch, π0 cleverly modifies an existing Large Vision-Language Model (like PaliGemma) to output physical forces instead of just words.[^1][^2][^3]

### 4.1 The VLM Backbone and the "Action Expert"

In π0, the base VLM acts as the "brain's" perception center. It takes in the camera feeds and text instructions, converting them into a rich mathematical representation called an **embedding space**. However, a standard VLM only knows how to output text tokens.[^3][^1]

To bridge the gap to physical robotics, π0 introduces a specialized neural network module called an **Action Expert**. The Action Expert uses a mechanism called **Cross-Attention** to "look at" the VLM's embeddings. By cross-attending to the visual and linguistic features, the Action Expert extracts exactly what it needs to generate physical movement without forcing the VLM to speak in discrete robot tokens.[^2][^1]

### 4.2 The Math of Conditional Flow Matching (CFM)

Instead of classification, the Action Expert performs **Conditional Flow Matching (CFM)**. In this framework, generating an action is treated as solving an Ordinary Differential Equation (ODE).[^1][^2]

The process starts with pure, random noise, denoted as $$x_0$$. The Action Expert is trained to output a **Vector Field**, $$v_\theta(x_t, I, x, s)$$, which dictates the "velocity" or direction the noise must be pushed to become a valid action. Here, $$I$$ is the image, $$x$$ is the text command, and $$s$$ is the robot's proprioceptive state (joint angles).[^2][^1]

To get the final robot command, the system uses an **ODE Solver** (like the Euler method you learn in undergraduate calculus) to integrate this vector field over a continuous time variable $$t$$ from 0 to 1:

$$
x_1 = x_0 + \int_{0}^{1} v_\theta(x_t, I, x, s) dt
$$

The final result, $$x_1$$, is a smooth, continuous motor command tailored perfectly to the current scene.[^1][^2]

### 4.3 Action Chunking for 50 Hz Control

If the model had to solve this ODE from scratch for every single micro-movement, it would be too slow. To achieve fluid 50 Hz control, π0 uses a technique called **Action Chunking**.[^3][^1]

Instead of predicting just the very next position for your 6-DoF arm, the flow model predicts a "chunk" or trajectory of future waypoints (for example, the next 50 joint positions) all at once. The robot executes the first few steps of this chunk while the VLA model computes the next chunk in the background. This ensures the 6-DoF arm and gripper never stutter or pause to "think" during dynamic tasks like catching or sliding.[^3][^1]

### 4.4 Scaling up to π0.5

While π0 proved that flow matching works for robotics, models like **π0.5** focus on scaling this architecture for **Open-World Generalization**.[^4]

When training a VLA on massive datasets of robot movements, there is a risk of **Catastrophic Forgetting**—where the VLM backbone "forgets" how to understand general web images and text because it is too focused on robot joints. π0.5 employs advanced co-training strategies to balance internet-scale semantic knowledge (like knowing what a "spatula" is) with physical execution (knowing how to grasp it). For an undergraduate, the takeaway is that π0.5 represents a shift from narrow, lab-specific models to true "generalist" brains that can be dropped into any 6-DoF hardware setup.[^4]

## 5. Conclusion

Vision-Language-Action models matter because they connect perception, language, and motor control inside one learning system instead of treating robot behavior as a long chain of separate hand-engineered modules. For students, that makes VLAs a useful lens for understanding where robotics is heading: away from brittle pipelines and toward models that can interpret a scene, understand an instruction, and produce actions in a more unified way.

This evolution also explains why action representation is so important. Earlier approaches often modeled robot behavior with discrete action tokens, but newer systems such as π0 show why continuous generative control is a better fit for real robot motion, especially when actions must stay smooth, precise, and reactive to the environment.

Recent models like π0 and π0.5 highlight a broader trend in robotics research: keeping the strong multimodal understanding of vision-language models while improving the way actions are generated for physical control. In other words, the field is moving from "robots that describe and then act" toward "robots that directly transform understanding into motion".

For undergraduate robotics, the key takeaway is not that classical robotics is obsolete. It is that future robot systems will likely combine both worlds: the reliability of kinematics, calibration, and control theory, together with learned models that can generalize across objects, scenes, and instructions.

### References:

[^1]: https://www.pi.website/download/pi0.pdf

[^2]: https://arxiv.org/html/2410.24164v1

[^3]: https://www.pi.website/blog/pi0

[^4]: https://huggingface.co/docs/lerobot/pi05
