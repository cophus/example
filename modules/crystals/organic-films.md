---
title: Organic films
---

# Structure mapping of organic films

Organic semiconductors and block copolymers have many knobs that tune their properties: chemistry, molecular weight, regioregularity, additives, and processing. Conventional TEM and atomic force microscopy (AFM) characterize the phase separation and some of the morphology of these films, but not the crystallinity, orientation, local ordering, and packing structure that control their electronic and mechanical properties. 4D-STEM at low dose can map these quantities directly.

## Morphology of organic films

In the conjugated polymer P3HT (poly(3-hexylthiophene-2,5-diyl)), the in-plane field effect transistor mobility changes by more than an order of magnitude with regioregularity and processing, which change the orientation of the crystalline domains [H. Sirringhaus et al., Nature 401, 685 (1999)]. Self-assembled block copolymers form spheres, cylinders, lamellae, and more complex phases depending on the packing parameter [C. Li et al., Chemical Society Reviews 49, 4681 (2020)].

:::{figure} ../../images/slides/slide-020.jpg
:alt: P3HT domain orientation and mobility, and block copolymer morphologies

Domain orientation and field effect mobility in P3HT (left) and block copolymer morphologies as a function of packing parameter (right).
:::

TEM images and phase diagrams measure how the phase separation changes with composition and molecular weight [W. Shi et al., J. Polymer Science Part B 54, 169 (2016)], and electron tomography resolves the 3D morphology [Jinnai, ..., Ikuhara et al., Accounts of Chemical Research 50, 1293 (2017)]. AFM shows that low molecular weight P3HT forms separated rod-like crystallites while high molecular weight chains connect crystallites [R. J. Kline et al., Macromolecules 38, 3312 (2005)]. Our goal is to transform these sketches into measured structure maps.

:::{figure} ../../videos/block-copolymer-tomography.mp4
:alt: tomographic reconstruction of a block copolymer morphology
:width: 60%

3D morphology of a polymeric self-assembly from transmission electron microtomography. Jinnai, ..., Ikuhara et al., Accounts of Chemical Research 50, 1293 (2017).
:::

:::{figure} ../../images/slides/slide-022.jpg
:alt: TEM images, phase diagram, and AFM images of polymer films with sketches of chain packing

Conventional TEM and AFM characterize phase separation and some morphology, while crystallinity, orientation, and local ordering remain as sketches.
:::

## Orientation mapping of organic molecular crystals

Panova, Ophus et al. mapped the orientation of the π-stacking in organic semiconductor films [O. Panova*, C. Ophus* et al., Nature Materials 18, 860 (2019)]. We detect the Bragg peaks in each diffraction pattern with template matching: we build an image template from a vacuum reference probe or a synthetic disk, find the peaks by image correlation, record them, and move to the next pattern. The detected peak directions give the local orientation of the molecular stacking.

:::{figure} ../../images/slides/slide-023.jpg
:alt: Bragg peak detection in diffraction patterns of an organic film

Bragg peak detection by template matching in each diffraction pattern.
:::

The two films below differ only in the processing additive. Without the additive, the film has a single orientation through its thickness and large, continuously turning domains. With the DIO additive, the film has multiple orientations through its thickness and small single-orientation domains.

::::{grid} 1 1 2 2
:::{figure} ../../videos/organic-orientation-no-additive.mp4
:alt: orientation flow lines of an organic film without additive

No additive: large, continuously turning domains.
:::
:::{figure} ../../videos/organic-orientation-dio.mp4
:alt: orientation flow lines of an organic film with DIO additive

DIO additive: small single-orientation domains.
:::
::::

:::{figure} ../../images/slides/slide-025.jpg
:alt: orientation maps of the two organic films

Orientation maps of the two films, colored by the in-plane orientation of the π-stacking. O. Panova*, C. Ophus* et al., Nature Materials 18, 860 (2019).
:::

## Block copolymer: polystyrene–polyethylene oxide

A polystyrene–polyethylene oxide block copolymer (PS-b-PEO) contains an amorphous PS phase and a crystalline PEO phase [M. Chen et al., Macromolecules 57, 5629 (2024)]. Stained dark field TEM shows the morphology but not the crystallinity. In 4D-STEM, each diffraction pattern contains both Bragg peaks from crystalline PEO and an amorphous halo from PS, so virtual dark field images separate the two phases.

:::{figure} ../../images/slides/slide-026.jpg
:alt: structure of PS-b-PEO and dark field TEM morphology

Chemical structure and lamellar morphology of PS-b-PEO. M. Chen et al., Macromolecules 57, 5629 (2024).
:::

:::{figure} ../../images/slides/slide-027.jpg
:alt: single and maximum diffraction patterns, virtual bright field, and dark field images of amorphous PS and crystalline PEO

A single diffraction pattern, the maximum diffraction pattern, and virtual bright field and dark field images of amorphous PS and crystalline PEO.
:::

We calculate the crystalline PEO map from a principal component analysis of the amorphous halo virtual images, and the orientation of each PEO crystallite from its Bragg peaks. The resulting maps give the PEO grain size distribution directly.

:::{figure} ../../images/slides/slide-028.jpg
:alt: PEO orientation map and grain size distribution

PEO orientation map and grain size distribution. M. Chen et al., Macromolecules 57, 5629 (2024).
:::
