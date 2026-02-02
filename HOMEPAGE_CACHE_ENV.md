# Homepage Cache Environment Variable

## Setup

Add this to your `.env.local` file:

```bash
# Homepage Cache (CloudFront)
NEXT_PUBLIC_HOMEPAGE_CACHE_URL=https://d2bstvyam1bm1f.cloudfront.net/homepage/dev/properties.json
```

## Environment-Specific URLs

### Development
```bash
NEXT_PUBLIC_HOMEPAGE_CACHE_URL=https://d2bstvyam1bm1f.cloudfront.net/homepage/dev/properties.json
```

### Production
```bash
NEXT_PUBLIC_HOMEPAGE_CACHE_URL=https://d2bstvyam1bm1f.cloudfront.net/homepage/prod/properties.json
```

## Default Behavior

If `NEXT_PUBLIC_HOMEPAGE_CACHE_URL` is not set, it defaults to:
```
https://d2bstvyam1bm1f.cloudfront.net/homepage/dev/properties.json
```

## Verifying the URL

Test the URL in your browser or with curl:

```bash
curl https://d2bstvyam1bm1f.cloudfront.net/homepage/dev/properties.json
```

You should see JSON with this structure:
```json
{
  "lowestPrice": [...],
  "highestPrice": [...],
  "featured": [...],
  "recent": [...],
  "generatedAt": "2024-02-01T10:30:00.000Z",
  "stage": "dev"
}
```

## Troubleshooting

### 404 Not Found
- Cache file hasn't been generated yet
- Run the Step Function to generate it
- Check the S3 bucket for the file

### CORS Error
- CloudFront distribution needs CORS headers
- Check CloudFront behavior settings

### Slow Response
- Check CloudFront cache hit rate
- Verify `x-cache` header is "Hit from cloudfront"
- Cache might be cold (first request)

## Monitoring

Check browser console for logs:
```javascript
[HomepageCache] Fetching from CloudFront: https://...
[HomepageCache] CloudFront fetch succeeded: { duration: 45, cached: "Hit from cloudfront", ... }
```
