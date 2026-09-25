---
title: Ptychography
---

# Ptychography

Ptychography recovers the complex transmission function of the sample, and the probe, from a set of diffraction patterns recorded at overlapping probe positions. Unlike DPC, which reduces each pattern to its center of mass, ptychography uses the full intensity distribution of every pattern, which gives higher resolution and better dose efficiency.

## Iterative ptychography with gradient descent

We can record ptychographic data with a focused probe, where the diffraction disks overlap, or with a defocused probe, where each pattern is a shadow image of the illuminated region. The movies below show the probe on a WS₂ sample and the resulting diffraction patterns at four defocus values, from 20 nm to 100 nm [G. Varnavides*, S. Ribet*, et al., [arXiv:2309.05250](https://arxiv.org/abs/2309.05250)].

::::{grid} 2 2 4 4
:::{figure} ../../videos/ptycho-defocus-a.mp4
:alt: defocused probe on WS2 and its diffraction pattern
:::
:::{figure} ../../videos/ptycho-defocus-b.mp4
:alt: defocused probe on WS2 and its diffraction pattern
:::
:::{figure} ../../videos/ptycho-defocus-c.mp4
:alt: defocused probe on WS2 and its diffraction pattern
:::
:::{figure} ../../videos/ptycho-defocus-d.mp4
:alt: defocused probe on WS2 and its diffraction pattern
:::
::::

We model the scattering in the forward direction. The input probe $\Psi_0(\mathbf{k})$ in diffraction space is propagated by the defocus $\Delta f$, transformed to real space, multiplied by the object transmission function $t(\mathbf{r})$, and transformed back to diffraction space,

$$
\Psi(\mathbf{k}) = \mathcal{F}_{\mathbf{r}\rightarrow\mathbf{k}}\left\{ \mathcal{F}_{\mathbf{k}\rightarrow\mathbf{r}}\left\{ \Psi_0(\mathbf{k}) \exp\left(i\pi\lambda\Delta f\,|\mathbf{k}|^2\right) \right\} t(\mathbf{r}) \right\},
$$

where $\mathbf{r}$ is the real-space coordinate, $\mathbf{k}$ is the diffraction space coordinate, and $\lambda$ is the electron wavelength. We reconstruct the object and probe with gradient descent, by alternating forward projections through this model and back-projections of the difference between the predicted and measured diffraction intensities.

:::{figure} ../../images/slides/slide-082.jpg
:alt: focused and defocused probe ptychography geometries and the forward model

Focused probe and defocused probe ptychography, and the forward scattering model. G. Varnavides*, S. Ribet*, et al., arXiv:2309.05250.
:::

The movies below show the reconstruction of the probe, the object phase, and the agreement between the model and the experimental diffraction as the iterations proceed, for a dataset from Yi Jiang et al. [Nature 559, 343 (2018)].

::::{grid} 1 1 3 3
:::{figure} ../../videos/ptycho-gd-probe.mp4
:alt: probe reconstruction over gradient descent iterations

Probe.
:::
:::{figure} ../../videos/ptycho-gd-object.mp4
:alt: object phase reconstruction over gradient descent iterations

Object phase.
:::
:::{figure} ../../videos/ptycho-gd-diffraction.mp4
:alt: predicted diffraction pattern over gradient descent iterations

Predicted diffraction.
:::
::::

## Method comparison

The figure below compares STEM phase contrast methods on the same experimental dataset of Au nanoparticles on a carbon support, recorded with a highly defocused electron probe [S. Ribet, G. Varnavides, M. Scott, C. Ophus et al., arXiv:2309.05250].

:::{figure} ../../images/slides/slide-084.jpg
:alt: comparison of phase contrast reconstructions of Au nanoparticles on carbon

STEM phase contrast method comparison on Au nanoparticles on carbon support.
:::

## Deep learning for STEM inverse problems

Virtually any inverse problem can be solved with the automatic differentiation (AD) tools developed for machine learning. Following Van den Broek and Koch [W. Van den Broek & C. Koch, PRL 109, 245502 (2012)], we can use AD to learn the object and probe arrays directly. We get better results with a generative approach, for example a deep generative prior (DGP) [Ulyanov et al., IEEE/CVF Conference on Computer Vision and Pattern Recognition (2018)], where AD learns the weights of a neural network that generates the object and probe.

:::{figure} ../../images/slides/slide-085.jpg
:alt: direct AD reconstruction compared with a deep generative prior reconstruction

Direct AD reconstruction of the object and probe (top) and reconstruction with a deep generative prior (bottom).
:::

McCray et al. applied this approach to multislice ptychography [A. R. C. McCray, G. Varnavides, S. Ribet & C. Ophus, [arXiv:2511.07795](https://arxiv.org/abs/2511.07795)].

:::{figure} ../../images/slides/slide-086.jpg
:alt: DGP multislice ptychography workflow

DGP multislice ptychography workflow. A. R. C. McCray et al., arXiv:2511.07795.
:::

:::{figure} ../../images/slides/slide-087.jpg
:alt: DGP reconstruction of gold nanoparticles over time

DGP reconstruction of gold nanoparticles as a function of time, with line profiles of the phase. A. R. C. McCray et al., arXiv:2511.07795.
:::

The same method reconstructs a metal-organic framework (MOSS-6) from data recorded at 100 e⁻/Å², using 5 slices and 2 probe modes, with data from Li et al. [Nat. Comm. 16 (2025)].

::::{grid} 1 1 2 2
:::{figure} ../../videos/dgp-mof.mp4
:alt: DGP reconstruction of a metal-organic framework over iterations

DGP reconstruction of MOSS-6 over the iterations.
:::
:::{figure} ../../images/slides/slide-088.jpg
:alt: MOSS-6 reconstruction, single probe position diffraction, and atomic structure

A single diffraction pattern at 20 mrad and the MOSS-6 atomic structure. A. R. C. McCray et al., arXiv:2511.07795.
:::
::::

For twisted bilayer WSe₂ data from Nguyen et al. [Science 383 (2024)], we used a deep image prior (DIP) reconstruction with 12 slices of 1 Å, 6 probe modes, a softplus final activation layer to enforce positivity, and a small total variation loss to prevent artifacts.

The generative reconstructions also converge much faster. A conventional pixelated reconstruction required 1000 iterations and 44 minutes, while DGP reconstructions required 7 to 100 iterations and 6 to 47 minutes, depending on the number of layers.

:::{figure} ../../images/slides/slide-090.jpg
:alt: comparison of pixelated and DGP reconstructions over iterations and time

Pixelated and DGP reconstructions with 2, 3, and 4 layers, comparing the number of iterations and time to convergence. A. R. C. McCray et al., arXiv:2511.07795.
:::
