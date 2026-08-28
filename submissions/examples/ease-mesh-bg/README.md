# ⚡ Ease Animated Gradient Background Mesh

A stunning, fluidly transforming fluid ambient color mesh background component engineered for EaseMotion CSS.

## ✨ What it does
Creates high-performance multi-layered glowing organic color blobs that float dynamically behind application layouts. It uses multi-stage transform tracks wrapped in structural blurred overlays (`filter: blur()`) to avoid raw page layout painting degradation.

## 🚀 How to Use
Add the background configuration directly beneath your root wrapper structures:
```html
<div class="ease-mesh-bg">
  <div class="ease-mesh-bg__blob ease-mesh-bg__blob--1"></div>
  <div class="ease-mesh-bg__blob ease-mesh-bg__blob--2"></div>
  <div class="ease-mesh-bg__blob ease-mesh-bg__blob--3"></div>
</div>