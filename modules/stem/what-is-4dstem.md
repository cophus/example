---
title: What is 4D-STEM?
---

# What is 4D-STEM?

In scanning transmission electron microscopy (STEM), we focus the electron beam into a converged probe and raster it over the sample. A conventional STEM detector integrates the scattered electrons over a fixed angular range, for example an annular dark field (ADF) detector, and records one number per probe position. In four-dimensional STEM (4D-STEM), we replace or supplement these detectors with a pixelated detector that records the full diffraction pattern at each probe position. The result is a 4D dataset: two real-space dimensions from the scan and two reciprocal-space dimensions from the detector [@ophus2019].

:::{figure} ../../videos/4dstem-scan.mp4
:alt: STEM geometry with the probe, sample, ADF detector and pixelated detector
:width: 55%

STEM geometry. The converged probe passes through the sample, the ADF detector collects high-angle scattering, and the pixelated detector records the diffraction pattern.
:::

## Try it: virtual detectors

Because the full diffraction pattern is stored, we can define any detector after the experiment. A virtual bright field (BF) image integrates the central disk, a virtual annular dark field image integrates an annulus, and a small virtual aperture placed on one Bragg disk produces a dark field (DF) image of the grains that satisfy that Bragg condition. The widget below builds a synthetic 4D-STEM dataset of several crystalline grains, an amorphous region, and a hole. Select a probe position on the left to see its diffraction pattern, and move or resize the virtual detector on the right.

:::{anywidget} ../../widgets/virtual-detector.js
:::

## Data rates

Modern direct electron detectors run at kHz to tens of kHz frame rates, which makes 4D-STEM data volumes large. In 2018, a Gatan K2 IS dataset with 256 × 256 probe positions and 1920 × 1792 pixel diffraction patterns contained 225 billion pixels (420 gigabytes) and was recorded in approximately 3 minutes. In 2024, current detectors record 1 terabyte in 6 seconds. Manipulating and analyzing these datasets requires efficient and robust algorithms and software.

:::{figure} ../../images/slides/slide-005.jpg
:alt: probe rastered over a WS2 crystal with diffraction patterns recorded on a direct electron detector

A converged probe rastered over a tungsten disulfide 2D crystal (TEAM I microscope), with the diffraction pattern recorded at each position on a direct electron detector (Gatan K2 IS). Each diffraction image shown is an average over 40 × 40 probe positions.
:::

:::{figure} ../../images/slides/slide-006.jpg
:alt: the same dataset shown at finer sampling with data volume numbers

The same experiment with each diffraction image averaged over 7 × 7 probe positions, showing how quickly the number of recorded patterns grows.
:::

## Why do 4D-STEM experiments?

4D-STEM serves two purposes. First, recording the full diffraction pattern improves resolution and signal-to-noise over conventional detectors, because phase retrieval methods such as ptychography use all of the scattered electrons. Second, 4D-STEM measures structure and properties over functional length scales: phase and crystal orientation, strain, atomic packing density, short and medium range order, and electric and magnetic fields, over fields of view from nanometers to micrometers.

:::{figure} ../../images/slides/slide-007.jpg
:alt: examples of 4D-STEM measurements of resolution, structure and properties

Examples of 4D-STEM measurements, from improved resolution in few layer BN (conventional dark field STEM compared to 4D-STEM ptychography) to structure classification, crystallinity, strain, and orientation across a thin film battery stack. The version of this slide from the lecture shows additional examples from Christian Kübel's group: crystallographic texture of nanocrystalline Pd [@kobler2013], residual strain fields and density variations in a deformed metallic glass [@kang2023], the local atomic structure of metallic glasses [@kang2024], the magnetic field in a ferromagnetic amorphous alloy [@kang2025], and electric fields, potentials, and charge densities at grain boundaries in a ferroelectric ceramic (S. Kang et al., in preparation).
:::

## Crystalline and amorphous diffraction

The diffraction pattern at each probe position acts as a fingerprint of the local structure. For crystalline samples, the positions and intensities of the Bragg disks encode the local phase and orientation, and small shifts of the disks encode strain. For amorphous samples, the positions and shapes of the diffuse halos encode the local structure factor, which is set by the mean atomic arrangement.

::::{grid} 1 1 2 2
:::{figure} ../../videos/crystal-grains-scan.mp4
:alt: probe scanned across three crystalline grains

Probe scanned across three grains with different orientations. The Bragg disk pattern changes at each grain boundary.
:::
:::{figure} ../../videos/amorphous-scan.mp4
:alt: probe scanned across an amorphous sample

Probe scanned across an amorphous sample. The diffraction pattern is a set of diffuse rings.
:::
::::

## Example: an ion-irradiated pyrochlore

Savitzky et al. used a single 4D-STEM experiment to map the structure of gadolinium titanate (Gd₂Ti₂O₇) after ion irradiation and annealing [@savitzky2021]. The starting material is a single crystal with the pyrochlore structure. Ion irradiation amorphizes the near-surface region, and annealing partially recrystallizes it into fluorite grains. The 4D-STEM scan across the cross section passes through all of these regions.

::::{grid} 1 1 3 3
:::{figure} ../../videos/gto-irradiation.mp4
:alt: single crystal pyrochlore under ion irradiation

Ion irradiation of single crystal Gd₂Ti₂O₇.
:::
:::{figure} ../../videos/gto-annealing.mp4
:alt: annealing of the irradiated layer

Annealing of the damaged layer.
:::
:::{figure} ../../videos/gto-4dstem.mp4
:alt: 4D-STEM scan across the sample

4D-STEM scan across the cross section.
:::
::::

:::{figure} ../../images/slides/slide-012.jpg
:alt: diffraction patterns from single crystal pyrochlore, amorphous, and recrystallized fluorite regions

Diffraction patterns recorded across the sample, from single crystal pyrochlore, through amorphous and mixed regions, to polycrystalline and recrystallized fluorite [@savitzky2021].
:::

## py4DSTEM

We developed [py4DSTEM](https://github.com/py4dstem/py4DSTEM), an open source Python package for 4D-STEM analysis, created by Benjamin Savitzky and me. The core developer team also includes Steve Zeltmann, Steph Ribet, Alex Rakowski, and George Varnavides, and we run a teaching workshop at the Microscopy & Microanalysis meeting. py4DSTEM measures:

- virtual bright field and dark field images;
- structure classification;
- phase, orientation, and strain maps of crystalline materials;
- short range order (SRO) and fluctuation electron microscopy (FEM) of amorphous materials;
- phase contrast images from differential phase contrast, parallax imaging, ptychography, and ptychographic atomic electron tomography.

:::{figure} ../../images/slides/slide-013.jpg
:alt: py4DSTEM overview and development team

py4DSTEM overview and development team [@savitzky2021].
:::
