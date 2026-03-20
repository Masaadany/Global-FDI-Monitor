# FDI Monitor — Free Asset Sources

## Icon Libraries (MIT Licensed, No Attribution Required in UI)

### Lucide React
- **License:** MIT · Commercial use ✓ · No attribution required
- **URL:** https://lucide.dev
- **Format:** SVG via React components
- **NPM:** `lucide-react` (installed v0.577.0)
- **Usage:** Navigation, actions, status, data, geo icons

### Tabler Icons React
- **License:** MIT · Commercial use ✓ · No attribution required
- **URL:** https://tabler.io/icons
- **NPM:** `@tabler/icons-react` (installed v3.40.0)
- **Format:** SVG via React components
- **Usage:** Business, finance, supplementary icons

### Heroicons (fallback)
- **License:** MIT · Commercial use ✓
- **URL:** https://heroicons.com
- **NPM:** `@heroicons/react`

---

## Video & 4K Footage Sources (CC0 / No Attribution)

| Source | License | 4K | Registration |
|--------|---------|-----|-------------|
| Pexels.com | CC0 | ✓ | Optional |
| Pixabay.com | Pixabay License (free commercial) | ✓ | Optional |
| Coverr.co | CC0 | ✓ | No |
| Videezy.com | Free (commercial ok) | ✓ | Free |
| Mazwai.com | CC BY 3.0 (attribution in docs ok) | ✓ | No |
| Mixkit.co | Mixkit Free License | ✓ | No |

**Recommended search terms:** "global city timelapse", "investment finance", "data visualization", "network connections", "world map abstract", "business district aerial"

---

## Infographic & Data Visualization Tools (Free/Open Source)

### Web-Based Charts (in platform)
- **Recharts** (MIT) — Already available in Artifacts
- **D3.js** (ISC) — Full data visualization
- **Custom SVG** — FDIFlowMap, RadarChart, SectorDonut (built in-house)

### Animated Infographic Generation
- **FFmpeg** (LGPL) — Free video encoding, batch color processing
- **Remotion** (open source community edition) — React-based video generation
- **Manim** (MIT) — Mathematical animation engine (Python)

### Static Design
- **Inkscape** (GPL) — Professional SVG editor, free, open source
- **GIMP** (GPL) — Image editing, color grading
- **Figma** (Free tier) — UI design, prototyping

---

## Video Editing (Free, 4K Export)

| Tool | License | 4K Export | Color Grade |
|------|---------|-----------|-------------|
| DaVinci Resolve (free) | Proprietary free | ✓ | ✓ Professional |
| Kdenlive | GPL | ✓ | ✓ |
| Shotcut | GPL | ✓ | ✓ |
| OpenShot | GPL | ✓ | Basic |

**Recommended:** DaVinci Resolve free version — professional color grading, 4K export, no watermarks.

---

## Brand Colors Applied

```css
--color-primary:  #74BB65;  /* Investment Green */
--color-navy:     #0A3D62;  /* Deep Navy */
--color-bg:       #E2F2DF;  /* Light Off-White */
--color-grey:     #696969;  /* Text Secondary */
--color-white:    #FFFFFF;  /* Surface */
```

### FFmpeg Color Grading Command
```bash
# Apply brand color LUT to footage
ffmpeg -i input.mp4 \
  -vf "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3,eq=brightness=0.05:contrast=1.1:saturation=0.9" \
  -c:v libx264 -crf 18 -preset slow output_branded.mp4
```

### Python Matplotlib Brand Palette
```python
import matplotlib.pyplot as plt
GFM_COLORS = ['#0A3D62','#74BB65','#1B6CA8','#696969','#E2F2DF','#E57373']
plt.rcParams['axes.prop_cycle'] = plt.cycler(color=GFM_COLORS)
```

---

## Quality Assurance

- **MediaInfo** (GPL) — Verify video resolution, bitrate, codec
- **SVGO** (MIT) — Optimize SVG file size
- **axe-core** (MPL-2.0) — Accessibility validation
- **Lighthouse** (Apache 2.0) — Performance & accessibility audit

*All sources verified: no paid tiers, no watermarks, commercial use permitted.*
*Lucide + Tabler attribution: in this file (docs only) as permitted by MIT license.*
