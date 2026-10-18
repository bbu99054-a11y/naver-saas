import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    '/dashboard/',
    '/api/',
    '/auth/',
    '/report/',
    '/login',
    '/pricing',
    '/onboarding',
    '/consult',
    '/seo-check',
    '/thumbscan',
    '/blog-draft*',
    '/ebook/',
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
