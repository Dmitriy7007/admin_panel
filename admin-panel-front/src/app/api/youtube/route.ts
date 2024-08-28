import youtubeService from '@/services/youtube.service'

export async function GET() {
  const result = await youtubeService.parseFirstVideo('dengi_ne_spyat')
  return Response.json(result)
}
