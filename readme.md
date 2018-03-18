# DevCanvas
A lightweight canvas framework.

## Installing
- Install using npm.
```bash
    npm i -S devcanvas
```

# Documentation

## Engine
>
> Engine is the core of devcanvas.  You should have one Engine instance per Canvas.
>
> ### Usage
> ```ts
> import { Engine } from 'devcanvas';
> 
> let canvas = document.getElementById('canvasId');
> let engine = new Engine(canvas, canvas.getContext('2d'));
> ```