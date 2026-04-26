import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cloud Run Manager',
    short_name: 'CR Manager',
    description: 'Management portal for Cloud Run services',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
