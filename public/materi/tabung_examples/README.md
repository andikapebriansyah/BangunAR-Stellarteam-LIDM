# Tabung Examples Images

## Expected Image Files

Based on the content in `tabungData.jsx`, please add the following image files to this directory:

### Required Images:
1. **kaleng_minuman.jpg** - Image of a beverage can/soda can
2. **silo_penyimpanan.jpg** - Image of a storage silo (grain silo, etc.)
3. **menara_air.jpg** - Image of a water tower
4. **toples_kue.jpg** - Image of a cookie jar or round food container

### Image Specifications:
- **Format**: `.jpg` preferred (can also use `.png`)
- **Aspect Ratio**: 16:9 or 4:3 recommended
- **Resolution**: Minimum 400x300px, recommended 800x600px
- **File Size**: Keep under 500KB for optimal loading

### Fallback Behavior:
If an image file is not found, the component will automatically show a placeholder with an icon and text instead.

### File Naming Convention:
- Use lowercase letters
- Replace spaces with underscores
- Use `.jpg` extension
- Examples: `kaleng_minuman.jpg`, `silo_penyimpanan.jpg`

### Adding New Examples:
If you want to add new examples to the list, update the `realLifeExamples` array in `/src/components/materi/tabungData.jsx` and add the corresponding image file here using the same naming convention.
