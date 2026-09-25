---
title: Experiment design
---

# Experiment design

In 4D-STEM, we independently set the probe size, through the convergence semiangle, and the step size between adjacent probe positions. Both choices depend on the feature size of the sample and on how much electron dose it can tolerate. This page covers the main experimental parameters: convergence angle, step size, focus and exposure, cryo and drift, and electron beam damage.

## Probe convergence angle

The convergence semiangle $\alpha$ sets both the size of the probe in real space and the size of the disks in diffraction space. A diffraction-limited probe has a radius to its first minimum of $0.61\lambda/\alpha$, where $\lambda$ is the electron wavelength (1.97 pm at 300 kV), while each Bragg disk in the diffraction pattern has an angular radius equal to $\alpha$.

- A small semiangle (0.2 mrad) produces a probe tens of nanometers wide and sharp diffraction spots, which we use for crystal phase and orientation mapping, lattice parameter measurements, and amorphous short range order (SRO).
- An intermediate semiangle (2 mrad) produces a probe a few nanometers wide with separated disks, which we use for crystal strain mapping, polarization and superlattice ordering, and amorphous medium range order (MRO).
- A large semiangle (20 mrad) produces an atomic-scale probe and overlapping disks, which we use for atomic resolution imaging, differential phase contrast (DPC), ptychography, and radiation-hard materials.

:::{figure} ../../images/slides/slide-014.jpg
:alt: probe and diffraction pattern for 20, 2 and 0.2 mrad semiangles

The probe in diffraction space and real space, and the crystalline and amorphous scattering, for 20, 2, and 0.2 mrad convergence semiangles, with the applications suited to each.
:::

The widget below shows the same trade-off. Change the convergence semiangle and compare the probe size in real space to the disk size and overlap in the diffraction pattern.

:::{anywidget} ../../widgets/convergence-angle.js
:::

## Step size

The step size should be chosen together with the probe size. When the step is larger than the probe, we undersample the sample, which is appropriate when the features are larger than the step or when we need to spread the dose. When the step is smaller than the probe, adjacent probe positions overlap, which ptychography requires. Typical probe and step sizes are:

- beam sensitive samples: 5 to 500 nm;
- strain, orientation, FEM, and radial distribution function (RDF) measurements: 1 to 500 nm;
- DPC, ptychography, and atomic resolution imaging: 0.1 to 5 nm.

:::{figure} ../../images/slides/slide-015.jpg
:alt: undersampling and oversampling of the probe positions

Undersampling (top) and oversampling (bottom) of the probe positions relative to the probe size.
:::

## Focus and exposure

TEM and STEM experiments on extremely beam sensitive samples both require "blind" exposure, meaning we cannot focus or align on the region we measure [@bustillo2021]. TEM with plane wave illumination is more difficult to focus blindly, requires thinner samples, and exposes a larger sample region than the detector records, which limits the usable field of view. STEM with a small convergence angle has a large depth of field and small diffraction spots, and a defocused STEM probe still produces useful diffraction signals.

:::{figure} ../../images/slides/slide-016.jpg
:alt: comparison of TEM and STEM illumination for beam sensitive samples

TEM versus STEM for beam sensitive samples [@bustillo2021].
:::

## Cryo and drift

Cooling the sample improves the signal-to-noise of individual reflections in beam sensitive materials such as acid-polyethylene, but thermal motion and sample drift are inevitable with cryo holders. We can set the fast scan direction of the STEM probe perpendicular to the holder axis. The drift then becomes a simple expansion or contraction of the image along the holder axis, which is straightforward to correct.

:::{figure} ../../images/slides/slide-017.jpg
:alt: cryo diffraction of acid-polyethylene and scan direction relative to the holder axis

Cryo cooling improves the signal-to-noise of acid-polyethylene diffraction, and aligning the fast scan direction perpendicular to the holder axis simplifies the drift distortion [@bustillo2021].
:::

## Electron beam damage

Beam damage destroys the long-range order of sensitive materials within seconds. In acid-polyethylene, the diffraction from a defined area decays over 4 seconds [@yan2018], and in an electrolyte recorded with a 50 × 50 scan and 10 nm steps, the damaged probe positions are visible directly in the sample afterwards [@xie2023]. We must either keep the total local exposure well below the critical dose, or take steps large enough that each probe position lands on undamaged material.

:::{figure} ../../images/slides/slide-018.jpg
:alt: diffraction decay in a time series and visible probe damage in an electrolyte

Loss of long-range order in a diffraction time series of acid-polyethylene (left) and probe positions visible after a 4D-STEM scan of an electrolyte (right) [@yan2018; @xie2023].
:::
