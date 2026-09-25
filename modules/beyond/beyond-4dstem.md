---
title: 5D-STEM
---

# Beyond 4D-STEM: 5D-STEM

A 4D-STEM dataset captures the sample at one moment, under one set of conditions, and in one projection direction. When we repeat the experiment over an additional dimension, such as time, applied mechanical load, temperature, or sample tilt, we record a 5D dataset. This page shows two examples: in situ mechanical testing and ptychographic atomic electron tomography.

## In situ mechanical testing of high entropy alloys

CrCoNi-based high entropy alloys are single phase, equiatomic mixtures of three or more metals, and have the highest fracture toughnesses ever recorded [@liu2022]. Their deformation is characterized by long, thin planar defects [@zhao2023].

:::{figure} ../../images/slides/slide-092.jpg
:alt: fracture toughness of CrCoNi-based alloys and TEM images of planar defects

Fracture toughness of CrCoNi-based alloys compared with other materials (left) and planar defects after shock deformation (right) [@liu2022; @zhao2023].
:::

Yang et al. combined in situ mechanical testing in the microscope with 4D-STEM recorded on a Gatan K3 detector with a Continuum energy filter [@yang2024]. Virtual images from the 4D-STEM data map the stacking faults and twins at each loading step, and bullseye probes map the strain.

:::{figure} ../../images/slides/slide-093.jpg
:alt: in situ 4D-STEM setup, HAADF image, defect map from virtual images, and bullseye strain maps

In situ 4D-STEM setup, a HAADF STEM image, defects identified from virtual images, and bullseye strain maps [@yang2024].
:::

In the CrCoNi medium entropy alloy (MEA), deformation produces reversible stacking faults, but after 1000 loading cycles the stacking faults become irreversible. The authors attribute the change to a lower stacking fault energy and rejuvenation of the local chemical ordering on the slipped planes.

:::{figure} ../../images/slides/slide-094.jpg
:alt: stacking fault density maps in CrCoNi and pure Ni during cyclic loading

Stacking fault density during loading in CrCoNi (top) and pure Ni (bottom) [@yang2024].
:::

:::{figure} ../../images/slides/slide-095.jpg
:alt: schematic of extended defect generation in MEAs after reversible deformation

Generation of extended, high aspect ratio defects in MEAs from "rejuvenated" planes following reversible deformation [@yang2024].
:::

## Ptychographic atomic electron tomography

Pelz et al. combined multislice ptychography with atomic electron tomography to measure the 3D positions of atoms in a ZrTe nanowire encapsulated in a double-walled carbon nanotube [@pelz2023]. HAADF STEM (50 to 120 mrad) images the heavy Zr and Te atoms, while DPC and ptychography also resolve the light carbon atoms of the nanotube.

:::{figure} ../../images/slides/slide-096.jpg
:alt: ZrTe nanowire in a carbon nanotube imaged by HAADF, DPC, and ptychography

ZrTe nanowire encapsulated in a double-walled carbon nanotube, imaged with HAADF, DPC, and ptychography [@pelz2023].
:::

We recorded 4D-STEM datasets over a tilt series and reconstructed the full 3D potential of the nanowire and nanotube from all tilts jointly.

::::{grid} 1 1 2 2
:::{figure} ../../images/slides/slide-097.jpg
:alt: ptychographic reconstructions over the tilt series

Ptychographic reconstructions over the tilt series [@pelz2023].
:::
:::{figure} ../../videos/paet-reconstruction.mp4
:alt: rotating 3D reconstruction of the nanowire and nanotube

3D reconstruction of the ZrTe nanowire inside the carbon nanotube.
:::
::::

:::{figure} ../../images/slides/slide-098.jpg
:alt: atomic model of the ZrTe sandwich structure inside the nanotube

Atomic model of the Zr-Te sandwich structure inside the nanotube, overlaid on a reconstructed slice [@pelz2023].
:::
