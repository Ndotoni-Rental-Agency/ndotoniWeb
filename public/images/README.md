# Hero Image Setup

## Required Image

Place your hero image as `hero.webp` in this directory.

### Recommended Specifications:
- **Format**: WebP (for best performance)
- **Dimensions**: 1920x1080 or larger (16:9 aspect ratio)
- **File Size**: Under 200KB (optimized)
- **Subject**: Cozy bedroom or living space that represents "home"

### How to Get/Create the Image:

1. **Download from Unsplash** (current image):
   ```bash
   curl -o hero.webp "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=85&w=1920&auto=format&fit=crop"
   ```

2. **Or use your own image** and convert to WebP:
   ```bash
   # Using ImageMagick
   convert your-image.jpg -quality 85 -resize 1920x1080^ hero.webp
   
   # Or using cwebp
   cwebp -q 85 your-image.jpg -o hero.webp
   ```

3. **Or use an online converter**:
   - Go to https://squoosh.app/
   - Upload your image
   - Select WebP format
   - Adjust quality to 85
   - Download as `hero.webp`

### Performance Benefits:
- ✅ No external network requests
- ✅ Next.js automatic optimization
- ✅ Better caching control
- ✅ Faster LCP (Largest Contentful Paint)
- ✅ Improved Core Web Vitals

Once you add the `hero.webp` file here, the hero section will automatically use it!
