---
title: Pair distribution function
---

# Diffraction from disordered samples

Ideally, the diffracted signal from a thin sample is the squared magnitude of the 2D Fourier transform of the projected potential, convolved with the probe in diffraction space. For an amorphous sample, the positions and shapes of the diffuse halos in each diffraction pattern act as a fingerprint for the local structure factor, which is set by the mean atomic arrangement. Interpretation is complicated by multiple and dynamical scattering (thickness effects), inelastic background, and other contributions beyond the elastic diffraction we want to measure.

::::{grid} 1 1 2 2
:::{figure} ../../videos/amorphous-scan.mp4
:alt: probe scanned across an amorphous sample

A probe scanned over an amorphous sample.
:::
:::{figure} ../../images/slides/slide-058.jpg
:alt: amorphous diffraction and summary of interpretation challenges

Amorphous diffraction halos encode the local structure factor.
:::
::::

## The electron pair distribution function

The pair distribution function (PDF) $g(r)$ is the probability of finding an atom inside a radial shell at distance $r$ from an atom, normalized to the mean density. To test the measurement, we simulated diffraction from amorphous tantalum with abTEM multislice simulations [@madsen2021], using atomic coordinates from Jun Ding and Mark Asta [@ding2015], so that the ground truth PDF is known.

:::{figure} ../../images/slides/slide-059.jpg
:alt: amorphous tantalum model and its ground truth PDF

Amorphous tantalum model and its ground truth pair distribution function.
:::

We first compute the radial mean of each diffraction pattern. The elastic scattering falls off smoothly with scattering angle, while a realistic pattern also contains inelastic background at low angles. We then normalize the radial mean by the atomic scattering factors to obtain the reduced structure factor.

:::{figure} ../../images/slides/slide-061.jpg
:alt: log radial mean and reduced structure factor with and without inelastic background

Log radial mean and reduced structure factor for elastic scattering only (left) and with a synthetic inelastic background (right).
:::

From the reduced structure factor $F(k)$, we compute the real-space PDF with a sine transform and an estimate of the density,

$$
G(r) \propto \int_0^{k_\mathrm{max}} F(k)\,\sin(2\pi k r)\,\mathrm{d}k,
$$

where $k$ is the scattering vector and $k_\mathrm{max}$ is the largest measured scattering vector, and we scale $G(r)$ using the estimated density. The peak positions are recovered with or without the inelastic background, but the PDF magnitude is only quantitatively correct for elastic scattering, so we recommend energy filtering for quantitative PDF measurements.

:::{figure} ../../images/slides/slide-062.jpg
:alt: PDF computed from elastic-only and background-containing patterns compared with ground truth

PDFs computed from elastic scattering only and from patterns with synthetic inelastic background, compared with the ground truth.
:::

## Radial distribution function of amorphous silicon

In experiments, we convert the mean diffraction pattern to polar coordinates and compute the radial distribution function (RDF), which shows the nearest neighbor (NN) and next nearest neighbor (NNN) shells of amorphous silicon. Accurate RDF measurements require both a small convergence semiangle and intensity measurements out to high scattering angles [@savitzky2021].

:::{figure} ../../images/slides/slide-063.jpg
:alt: mean diffraction pattern of amorphous silicon in cartesian and polar coordinates

Mean diffraction pattern of amorphous silicon and its polar transform [@savitzky2021].
:::
