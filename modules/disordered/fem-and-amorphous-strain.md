---
title: FEM and amorphous strain
---

# Fluctuation electron microscopy and amorphous strain

## Fluctuation electron microscopy

The mean diffraction pattern of an amorphous sample measures its short range order (SRO), averaged over the probed volume. Fluctuation electron microscopy (FEM) measures medium range order (MRO) from the variance of the diffraction intensity between probe positions, following the variable coherence microscopy of Treacy and Gibson [@treacy1996] and its STEM implementation by Voyles and Muller [@voyles2002]. A larger probe semiangle produces a smaller probe, and when the probe is size-matched to ordered atomic clusters, ordered regions produce speckled diffraction patterns with strong intensity fluctuations, while disordered regions produce smooth halos. Varying the probe size therefore characterizes the length scale of the MRO [@bogle2010; @ophus2019].

:::{figure} ../../images/slides/slide-064.jpg
:alt: diffraction from ordered and disordered regions for two probe sizes, and variance versus scattering vector

Diffraction from ordered and disordered regions for 0.8 nm and 2.6 nm probes, and the normalized variance as a function of scattering vector for several probe sizes.
:::

## Elliptic distortions

Amorphous rings are ideal for measuring elliptic distortion of the diffraction pattern, whether it comes from the projector lenses of the microscope or from strain in the sample. We fit the ring in polar coordinates, and an elliptic distortion appears as a sinusoidal modulation of the ring radius with azimuthal angle [@savitzky2021]. We correct the instrumental distortion using a reference measurement before analyzing sample strain.

:::{figure} ../../images/slides/slide-065.jpg
:alt: amorphous ring in cartesian and polar coordinates showing elliptic distortion

An elliptically distorted amorphous ring and its polar transform [@savitzky2021].
:::

## Strain mapping of amorphous samples

Gammer et al. mapped strain in a metallic glass during in situ tensile loading by fitting an ellipse to the first amorphous ring at each probe position [@gammer2018]. We fit

$$
A x^2 + B x y + C y^2 = r_0^2,
$$

where $x$ and $y$ are diffraction space coordinates and $r_0$ is the ring radius of the unstrained reference. The ring is a circle when $A = C = 1$ and $B = 0$, and for small deformations the strain components are

$$
\varepsilon_{xx} \approx \tfrac{1}{2}(A - 1), \qquad \varepsilon_{yy} \approx \tfrac{1}{2}(C - 1), \qquad \varepsilon_{xy} \approx \tfrac{1}{2}B.
$$

:::{figure} ../../images/slides/slide-066.jpg
:alt: in situ tensile geometry and elliptical fit to an amorphous ring

In situ tensile experiment and elliptical fit to the amorphous ring [@gammer2018].
:::

:::{figure} ../../images/slides/slide-067.jpg
:alt: strain maps of a metallic glass dog-bone sample before loading, under load, and after fracture

Strain maps of a metallic glass sample unloaded, under load, and after fracture [@gammer2018].
:::
