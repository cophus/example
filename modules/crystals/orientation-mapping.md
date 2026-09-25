---
title: Phase and orientation mapping
---

# Phase and orientation mapping

Automated crystal orientation mapping (ACOM) determines the crystal phase and orientation at each probe position by comparing the measured diffraction pattern to a library of calculated patterns. Rauch and Dupuy developed fast template matching of spot diffraction patterns [@rauch2005], and Rauch and Véron applied it to automated orientation mapping in the TEM [@rauch2005b]. Brunetti et al. used this approach to map LiFePO₄ and FePO₄ phases in battery electrodes [@brunetti2011].

:::{figure} ../../images/slides/slide-043.jpg
:alt: correlation of an experimental diffraction image with calculated templates to produce phase and orientation maps

Phase and orientation mapping by correlating experimental diffraction images with calculated templates [@ophus2019; @rauch2005; @rauch2005b; @brunetti2011].
:::

## Sparse correlation ACOM in py4DSTEM

In py4DSTEM, we accelerate ACOM by working with the detected Bragg peaks rather than the full images [@ophus2022]. We start from the unit cell structure and the single atom scattering factors, compute the structure factors, and select the range of zone axes that the crystal symmetry makes unique. We then calculate a library of diffraction patterns over all unique orientations and correlate each measured set of Bragg peaks against this library.

:::{figure} ../../images/slides/slide-044.jpg
:alt: unit cell, structure factors, and zone axis range for gold

Unit cell, structure factors, and the unique zone axis range for a face-centered cubic crystal [@ophus2022].
:::

:::{figure} ../../images/slides/slide-045.jpg
:alt: diffraction pattern library over unique orientations

A library of calculated diffraction patterns over the unique orientations [@ophus2022].
:::

The tutorial notebook `orientation_01_AuAgPd_wire.ipynb` in the [py4DSTEM tutorials](https://github.com/py4DSTEM/py4DSTEM_tutorials) walks through the full workflow on a AuAgPd nanowire: building the probe template, detecting Bragg peaks, computing the orientation library, fitting the orientation at every probe position, and plotting the in-plane and out-of-plane orientation maps.

::::{grid} 1 1 2 2
:::{figure} ../../images/slides/slide-046.jpg
:alt: probe template in the tutorial notebook

Probe template.
:::
:::{figure} ../../images/slides/slide-047.jpg
:alt: detected Bragg peaks in the tutorial notebook

Detected Bragg peaks.
:::
:::{figure} ../../images/slides/slide-049.jpg
:alt: orientation fits in the tutorial notebook

Orientation fits to the detected peaks.
:::
:::{figure} ../../images/slides/slide-050.jpg
:alt: orientation maps of a AuAgPd nanowire

In-plane and out-of-plane orientation maps of the nanowire.
:::
::::

## Precession 4D-STEM

Precessing the beam around the optical axis, as introduced by Vincent and Midgley [@vincent1994], averages out much of the dynamical scattering in each pattern, which makes the Bragg intensities closer to kinematical and improves both ACOM and strain measurements. @ribet2025 developed multi-angle precession electron diffraction (MAPED) and compared conventional and precession 4D-STEM for orientation and strain mapping.

:::{figure} ../../images/slides/slide-051.jpg
:alt: precession geometry and precessed diffraction patterns

Precession geometry and diffraction patterns at different positions of the precession cycle [@ribet2025].
:::

:::{figure} ../../images/slides/slide-052.jpg
:alt: conventional and precession diffraction patterns and strain maps

Single and mean diffraction patterns and strain maps from conventional 4D-STEM [@ribet2025].
:::

## Ferroelectric HZO

Ferroelectric hafnium zirconium oxide (HZO) is a CMOS-compatible ferroelectric, and its ferroelectric response comes from one orthorhombic phase ($Pca2_1$) among several possible HZO crystal structures. Diebold et al. mapped the orientation and phase of a functional HZO layer between titanium nitride electrodes on a silicon substrate [@diebold2025].

:::{figure} ../../images/slides/slide-053.jpg
:alt: HZO device stack and possible HZO crystal structures

The HZO device stack and the possible HZO crystal structures [@diebold2025].
:::

We tested the phase classification on dynamical Bloch wave simulations of the four HZO phases plus silicon and TiN, over a range of orientations and thicknesses. The classification accuracy is good, with room for improvement. Future improvements include machine learning classification and dynamical inversion.

:::{figure} ../../images/slides/slide-055.jpg
:alt: phase classification accuracy on simulated patterns versus thickness

Phase classification of simulated diffraction patterns of four HZO phases, Si, and TiN as a function of thickness, compared to ground truth.
:::

:::{figure} ../../images/slides/slide-056.jpg
:alt: dark field image, reliability map, and phase map of the HZO layer

Dark field image, orientation reliability, and phase map of the HZO layer [@diebold2025].
:::
