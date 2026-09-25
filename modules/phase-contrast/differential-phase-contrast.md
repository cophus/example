---
title: Differential phase contrast
---

# Phase contrast and differential phase contrast

Thin samples made of light elements scatter electrons weakly, and mainly shift the phase of the electron wave. In conventional high-resolution TEM (HRTEM), we convert this phase shift into image contrast with defocus and aberrations. For example, phase contrast HRTEM of polycrystalline graphene suspended over a TEM grid resolves the atomic structure of the grain boundaries [@ophus2016].

:::{figure} ../../images/slides/slide-069.jpg
:alt: grain boundary in polycrystalline graphene imaged by HRTEM

Grain boundaries in polycrystalline graphene imaged with phase contrast HRTEM, and the distribution of misorientation angles [@ophus2016].
:::

In STEM, phase contrast measurements are sensitive to the sample Coulomb potential, electric fields, and magnetic fields, all of which deflect the transmitted beam [@shibata2012; @shibata2015; @krajnak2016].

:::{figure} ../../images/slides/slide-070.jpg
:alt: deflection of the STEM probe by the sample potential, electric fields, and magnetic fields

Phase contrast in STEM from the sample potential, electric fields, and magnetic fields.
:::

## Differential phase contrast

When the probe passes through a region where the potential has a gradient, the whole probe disk shifts in diffraction space. If we measure this shift, we estimate the derivative of the potential, which is the in-plane field. We can estimate the shift from a differential measurement of the top and bottom or left and right sides of the probe with a segmented detector, or from the center of mass (CoM) of the probe on a pixelated detector. With a grid of these measurements, we numerically reconstruct the 2D sample potential, which is differential phase contrast (DPC) imaging. Dekkers and de Lang introduced DPC with a split detector [@dekkers1974], and Waddell and Chapman showed that the center of mass of the diffraction pattern gives a linear measurement of the phase gradient [@waddell1979].

:::{figure} ../../videos/dpc-disk-shift.mp4
:alt: probe amplitude crossing a potential step and the resulting shift of the probe disk
:width: 70%

The probe (red) crossing a step in the sample potential (blue), and the resulting shift of the probe disk in diffraction space.
:::

## Center-of-mass DPC

For each probe position, we compute the center of mass of the diffraction intensity,

$$
\langle \mathbf{q} \rangle = \frac{\sum_{\mathbf{q}} \mathbf{q}\,|\Psi(\mathbf{q})|^2}{\sum_{\mathbf{q}} |\Psi(\mathbf{q})|^2},
$$

where $\Psi(\mathbf{q})$ is the exit wave in diffraction space and $\mathbf{q}$ is the diffraction space coordinate. We then integrate the CoM vector field to recover the phase $\phi$, which is most easily done in Fourier space,

$$
\phi \propto \mathcal{F}^{-1}\left\{ \frac{-i\,\left(k_x\,\mathcal{F}\{\langle q_x \rangle\} + k_y\,\mathcal{F}\{\langle q_y \rangle\}\right)}{k_x^2 + k_y^2} \right\},
$$

where $k_x$ and $k_y$ are the Fourier coordinates of the real-space scan. The movies below show CoM DPC simulations of a 1D crystal with a potential step, for three convergence semiangles and infinite dose. With a 2 mrad probe, the high spatial frequencies are not recovered. With a 6 mrad probe, they are damped. With a 32 mrad probe, they are recovered.

::::{grid} 1 1 3 3
:::{figure} ../../videos/com-dpc-2mrad.mp4
:alt: CoM DPC with a 2 mrad probe

2 mrad probe: high spatial frequencies are not recovered.
:::
:::{figure} ../../videos/com-dpc-6mrad.mp4
:alt: CoM DPC with a 6 mrad probe

6 mrad probe: high spatial frequencies are damped.
:::
:::{figure} ../../videos/com-dpc-32mrad.mp4
:alt: CoM DPC with a 32 mrad probe

32 mrad probe: high spatial frequencies are recovered.
:::
::::

At a finite dose of 500 electrons per probe position, the trend reverses for the low spatial frequencies. The 32 mrad probe produces significant low spatial frequency errors, the 6 mrad probe reduces them, and the 2 mrad probe produces almost none. The convergence angle therefore sets a trade-off between resolution and low-frequency noise.

::::{grid} 1 1 3 3
:::{figure} ../../images/slides/slide-076.jpg
:alt: CoM DPC with a 32 mrad probe at 500 electrons per probe

32 mrad, 500 e⁻ per probe: significant low spatial frequency errors.
:::
:::{figure} ../../images/slides/slide-077.jpg
:alt: CoM DPC with a 6 mrad probe at 500 electrons per probe

6 mrad, 500 e⁻ per probe: reduced low spatial frequency errors.
:::
:::{figure} ../../images/slides/slide-078.jpg
:alt: CoM DPC with a 2 mrad probe at 500 electrons per probe

2 mrad, 500 e⁻ per probe: almost no low spatial frequency errors.
:::
::::

## Contrast transfer functions of CoM DPC

We can describe this trade-off with the contrast transfer function (CTF) of CoM DPC, which transfers spatial frequencies out to twice the convergence semiangle. Note that the harmonics in the reconstruction show that the phase shift acts as $\exp[i\sigma\phi_0\cos(2\pi\mathbf{r}\cdot\mathbf{q}_0)]$ and not as its weak phase approximation $1 + i\sigma\phi_0\cos(2\pi\mathbf{r}\cdot\mathbf{q}_0)$, where $\sigma$ is the interaction constant, $\phi_0$ is the potential amplitude, and $\mathbf{q}_0$ is its spatial frequency.

:::{figure} ../../images/slides/slide-079.jpg
:alt: CoM DPC contrast transfer functions and noise for 2, 6, and 32 mrad probes

Reconstructed phase and the Fourier transform amplitude of the reconstruction, CoM CTF, and noise for 2, 6, and 32 mrad probes.
:::

## Example: 1D defects in 2D materials

Fang et al. used DPC to map the charge density at 1D defects in MoS₂ and WS₂ [@fang2019].

:::{figure} ../../images/slides/slide-080.jpg
:alt: DPC charge density maps of line defects in WS2

DPC measurements of the charge density at line defects in WS₂ [@fang2019].
:::
