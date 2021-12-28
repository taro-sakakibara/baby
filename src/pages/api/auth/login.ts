import type { NextApiRequest, NextApiResponse } from 'next'
import { useLocation } from 'react-router-dom'

const generateRandomString = (length: number): string => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const login = (req: NextApiRequest, res: NextApiResponse) => {
  const scope: string = 'streaming user-read-email user-read-private'

  let spotify_redirect_uri: string = ''
  const CheckLocation = () => {
    const location = useLocation().pathname
    if (location == 'http://localhost:3000') {
      spotify_redirect_uri = 'http://localhost:3000/api/auth/callback'
    } else {
      spotify_redirect_uri = 'https://baby-two.vercel.app/api/auth/callback'
    }
  }
  CheckLocation()

  const state: string = generateRandomString(16)

  let spotify_client_id: string = ''
  if (process.env.SPOTIFY_CLIENT_ID) {
    spotify_client_id = process.env.SPOTIFY_CLIENT_ID
  } else {
    console.error(
      'Undefined Error: An environmental variable, "SPOTIFY_CLIENT_ID", has something wrong.',
    )
  }

  const auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  })

  res.redirect(
    'https://accounts.spotify.com/authorize/?' +
      auth_query_parameters.toString(),
  )
}

export default login
