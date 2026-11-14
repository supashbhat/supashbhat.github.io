# Supash Bhat portfolio

This is the static site behind [supashbhat.github.io](https://supashbhat.github.io/). The main page collects my physics, simulation, research, and music work; the small project pages live alongside it so I can open them without a build step.

## Preview locally

From this folder, run a static file server and open its local address in a browser. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. A local server keeps project assets and navigation working as they do on GitHub Pages.

## Project pages

- [Vayu](vayu.html) — audio effects plugin overview.
- [Physics Engine](physics-engine.html) — numerical simulation project and interactive demos.
- [Aerial Control Lab](aerial-control-lab/) — browser controls and estimation sandbox.
- [Physical AI Learner Lab](https://supashbhat.github.io/physical-ai-learner-lab/) — MuJoCo robotics tutorial and [case study](https://supashbhat.github.io/physical-ai-learner-lab/case-study/).
- [Wavefunction Graffiti](https://supashbhat.github.io/fourier-applet/) — Physics 137A wavefunction and Fourier applet.
- [Malombo Archive](malombo-archive/) — research archive on Venda Malombo and Philip Tabane.

The small spinning icosahedron uses the same canvas renderer on the portfolio and its project pages. Drag it to rotate; a click without dragging still follows a linked brand mark.
