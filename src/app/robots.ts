import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    '/api/',
    '/report/',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: 'https://www.postsyncapp.com/sitemap.xml',
  }
}
