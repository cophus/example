---
title: Strain mapping
---

# Strain mapping of crystalline samples

When a crystal is strained, its lattice spacings change, and the Bragg disks in its diffraction pattern move by the inverse amount. A lattice in compression produces an increased spot spacing and a lattice in tension produces a decreased spot spacing. By measuring the Bragg disk positions at each probe position to a small fraction of a pixel, we can map the full 2D strain tensor over large fields of view.

::::{grid} 1 1 2 2
:::{figure} ../../videos/strain-scan.mp4
:alt: probe scanned along a strained crystal

A probe scanned along a crystal that is in compression at one end and in tension at the other.
:::
:::{figure} ../../images/slides/slide-030.jpg
:alt: diffraction spot spacing for compression and tension

Compression increases the diffraction spot spacing and tension decreases it.
:::
::::

## Disk positions from correlation template matching

We find the Bragg disk positions by correlating each measured diffraction pattern $I_\mathrm{meas}$ with a template $I_\mathrm{temp}$, usually an image of the vacuum probe. We compute the correlation in Fourier space,

$$
I_\mathrm{corr} = \mathcal{F}^{-1}\left\{ \frac{\mathcal{F}\{I_\mathrm{meas}\}\,\mathcal{F}\{I_\mathrm{temp}\}^*}{\left|\mathcal{F}\{I_\mathrm{meas}\}\,\mathcal{F}\{I_\mathrm{temp}\}^*\right|^{1-n}} \right\},
$$

where $\mathcal{F}$ is the 2D Fourier transform and $n$ sets the correlation type: $n = 1$ gives cross correlation, $n = 0$ gives phase correlation, and intermediate values give a hybrid correlation that combines the noise robustness of cross correlation with the sharp peaks of phase correlation [@savitzky2021].

:::{figure} ../../images/slides/slide-031.jpg
:alt: cross, hybrid, and phase correlation of a one-dimensional disk signal

Cross, hybrid, and phase correlation of a 1D template and measured signal, with and without noise.
:::

:::{figure} ../../images/slides/slide-032.jpg
:alt: vacuum probe template and detected disks in four diffraction patterns

The vacuum probe template and the Bragg disks detected in four diffraction patterns from a 50 nm field of view.
:::

## From disk positions to strain

We fit a lattice to the detected disk positions $\mathbf{r}$ at each probe position,

$$
\mathbf{r} = \mathbf{r}_0 + a\,\mathbf{u} + b\,\mathbf{v},
$$

where $\mathbf{r}_0$ is the origin (the position of the unscattered beam), $\mathbf{u}$ and $\mathbf{v}$ are the reciprocal lattice vectors, and $a$ and $b$ are the integer lattice indices of each disk. We then compare the measured lattice vectors to the lattice vectors $\mathbf{u}_0$ and $\mathbf{v}_0$ of an unstrained reference region, by solving for the $2 \times 2$ transformation $T$ with $[\mathbf{u}\ \mathbf{v}] = T\,[\mathbf{u}_0\ \mathbf{v}_0]$. To first order, the real-space infinitesimal strain tensor is

$$
\varepsilon = I - \tfrac{1}{2}\left(T + T^{\mathsf{T}}\right),
$$

where $I$ is the identity matrix, and the antisymmetric part of $T$ gives the local lattice rotation. Note the sign change: we measure the lattice in reciprocal space, so a positive (tensile) strain shrinks the reciprocal lattice vectors.

:::{figure} ../../images/slides/slide-034.jpg
:alt: reference and measured lattice vectors and the strain tensor

Lattice vectors fit to the detected disks, the transformation from the reference lattice to the measured lattice, and the resulting strain tensor.
:::

The widget below applies a strain and rotation to a crystal and shows the real-space lattice and the diffraction pattern. Apply tension along $x$ and watch the spots move closer together along $x$.

:::{anywidget} ../../widgets/strain-lattice.js
:::

:::{figure} ../../images/slides/slide-035.jpg
:alt: strain maps of single crystal pyrochlore and recrystallized fluorite

Strain measured in the single crystal Gd₂Ti₂O₇ pyrochlore and recrystallized fluorite regions [@savitzky2021].
:::

## Correlative measurements of strain and chemistry

Deng et al. combined 4D-STEM strain mapping with X-ray spectroscopic ptychography of the same LiFePO₄ battery cathode particles, using a TEM holder in both instruments [@deng2022]. The X-ray measurements map the local lithium composition and the 4D-STEM measurements map the lattice strain. After aligning and correlating all channels, the authors used inverse learning to recover the constitutive law linking composition and strain.

:::{figure} ../../images/slides/slide-036.jpg
:alt: 4D-STEM strain maps of battery cathode particles

4D-STEM strain mapping of LiFePO₄ battery cathode particles [@deng2022].
:::

:::{figure} ../../images/slides/slide-037.jpg
:alt: X-ray spectroscopic ptychography maps of lithium composition in LiFePO4 particles

X-ray spectroscopic ptychography maps of lithium composition in the same particles [@deng2022].
:::

:::{figure} ../../images/slides/slide-038.jpg
:alt: aligned multichannel image stack and inverse learning of the constitutive law

Alignment and correlation of all channels, followed by inverse learning of the constitutive law [@deng2022].
:::

## Enhancing strain precision with patterned apertures

The precision of a disk position measurement depends on the number of counts and on the length of the edge of the Bragg disk, because the edge carries the position information. Zeltmann et al. showed that we can achieve a similar gain in precision by adding edges to the disks, using a patterned "bullseye" condenser aperture [@zeltmann2020]. The trade-off is that the probe becomes larger in real space.

:::{figure} ../../images/slides/slide-039.jpg
:alt: position precision versus counts for circular and bullseye disks

Position error variance as a function of signal intensity for circular disks of different radii (left) and for disks with added rings (right) [@zeltmann2020].
:::

:::{figure} ../../images/slides/slide-040.jpg
:alt: bullseye apertures fabricated by FIB

Bullseye apertures fabricated with a focused ion beam and installed in the second condenser aperture [@zeltmann2020].
:::

To compare the two probes, we fit the lattice to half of the diffraction spots and measure the error in predicting the positions of the remaining half. In both thin and thick silicon [110], the bullseye probe reduces this cross-validation error substantially compared to a circular probe, from 2.8% to 0.6% in thin silicon and from 4.8% to 1.3% in thick silicon, where dynamical scattering fills the disks with contrast.

:::{figure} ../../images/slides/slide-041.jpg
:alt: cross-validation error for bullseye and circular probes in thin and thick silicon

Cross-validation error for bullseye and circular probes in thin and thick silicon [110] [@zeltmann2020].
:::

We have since fabricated bullseye apertures with lithography and are giving them away for free. If you would like one for your microscope, email me at [cophus@stanford.edu](mailto:cophus@stanford.edu).

:::{figure} ../../images/slides/slide-042.jpg
:alt: TEM image of lithographically fabricated bullseye apertures

TEM image of lithographic bullseye apertures with 2, 5, 10, and 20 μm diameters.
:::
