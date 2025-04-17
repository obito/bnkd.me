---
title: "Faaaster"
imageSrc: "../../assets/faaaster-project.png"
imageAlt: "Screenshot of the Second Project"
description: "Faaaster is a high-performance hosting solution tailored specifically for WordPress, aimed at simplifying the workflow for freelancers, agencies, and website managers."
sitePreviewUrl: "https://faaaster.io/" # Replace with actual URL
services:
  - Backend Development
  - Site Reliability Engineering
  - Infrastructure Optimization
tools:
  - Go
  - PHP
  - Google Cloud Platform
  - Kubernetes
  - Keda
field:
  - Hosting
  - CRM
year: 2021-2022
slug: "faaaster"
order: 3
---

### Redesigning Backend Infrastructure

We undertook a complete redesign of the backend infrastructure using **Google Cloud Platform (GCP)**, **Go**, and **Kubernetes**, transitioning from a monolithic architecture to a robust microservices setup. This change allowed us to dynamically spawn new Kubernetes pods to host user websites efficiently.

### Scale-to-Zero System with KEDA

To optimize costs and resource management, I implemented a scale-to-zero system for WordPress using **KEDA (Kubernetes Event-Driven Autoscaler)**. KEDA is composed of three primary components:

- **Scaler:** Monitors the metrics to decide when scaling should occur.
- **Metrics Adapter:** Integrates custom metrics into Kubernetes' Horizontal Pod Autoscaler (HPA).
- **Controller:** Manages the lifecycle of scaling actions based on defined metrics.

If a user's website received no requests for 15 minutes, the system automatically shut down the pod. Upon receiving a new request through our load balancer, the pod quickly spun back up. This optimization was especially effective as most of our users were independent professionals with lower traffic sites. As a result, we successfully reduced infrastructure costs by approximately 50%.

### REST API and WordPress Plugin

I developed a custom REST API in **Go** for seamless communication between Kubernetes and WordPress. Additionally, I built a dedicated PHP plugin for WordPress, enabling users to:

- Restart pods
- Manage various backend operations

This empowered users to perform essential administrative tasks directly from their dashboards, eliminating the need for support intervention and enhancing user experience significantly.

### Kubernetes Controller for ProxySQL & GCP Resources

I also developed a specialized Kubernetes controller responsible for efficiently managing **ProxySQL** and associated **GCP resources**. This component significantly streamlined our database proxy handling and resource management, contributing to overall improved infrastructure stability and performance.
