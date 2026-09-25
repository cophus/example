---
title: Opportunities for 4D-STEM
site:
  hide_outline: true
---

# Opportunities for 4D-STEM

Four-dimensional scanning transmission electron microscopy (4D-STEM) records a full 2D diffraction pattern at every position of a 2D grid of probe positions. Every image, spectrum, and map we can compute from a conventional STEM experiment can be computed after the fact from a 4D-STEM dataset [@ophus2019], and many measurements that conventional detectors cannot make, including strain, crystal orientation, local atomic ordering in amorphous materials, and the projected electrostatic potential, become routine. This site is a written version of a lecture I give at electron microscopy schools, with the figures, movies, and interactive widgets from the lecture.

:::{figure} videos/4dstem-scan.mp4
:alt: a converged electron probe scanned over a sample, with a diffraction pattern recorded on a pixelated detector at each position
:width: 60%

A 4D-STEM experiment. A converged electron probe is scanned over the sample, and a pixelated detector records the diffraction pattern at each probe position, in place of (or in addition to) the integrated signal of an annular dark field detector.
:::

## How the site is organized

1. [STEM and 4D-STEM](modules/stem/what-is-4dstem.md) defines the experiment and its data, and covers experiment design: probe convergence angle, focus and exposure, cryo and drift, and electron beam damage.
2. [Crystalline samples](modules/crystals/organic-films.md) covers Bragg disk detection, phase and orientation mapping, and strain mapping, with examples from organic films, battery cathodes, and ferroelectric thin films.
3. [Disordered samples](modules/disordered/pair-distribution-function.md) covers the electron pair distribution function, fluctuation electron microscopy, and strain mapping in metallic glasses.
4. [Phase contrast](modules/phase-contrast/differential-phase-contrast.md) covers differential phase contrast and ptychography, including gradient descent and deep learning reconstructions.
5. [Beyond 4D-STEM](modules/beyond/beyond-4dstem.md) covers 5D-STEM experiments, where 4D-STEM is repeated over time, mechanical load, or sample tilt.

[Resources](resources.md) lists the review papers, open source codes, and collaborators behind this work.

## Software

Nearly all of the analysis on this site can be reproduced with open source Python codes. [py4DSTEM](https://github.com/py4dstem/py4DSTEM) covers virtual imaging, Bragg disk detection, strain, orientation, and amorphous analysis, and phase retrieval, and ships with tutorial notebooks for each. [quantEM](https://github.com/electronmicroscopy/quantem) is our newer machine-learning-driven code for quantitative electron microscopy, and we are looking for contributors.
