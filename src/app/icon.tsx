import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

export const size = { width: 256, height: 256 }
export const contentType = 'image/png'

// Ícone da aba do navegador: o logotipo recortado em círculo (o navegador não arredonda sozinho).
export default async function Icon() {
  const arquivo = path.join(process.cwd(), 'public/images/logo/logotipo para abas.jpg')
  const logo = `data:image/jpeg;base64,${(await readFile(arquivo)).toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt=""
          width={size.width}
          height={size.height}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
    ),
    size,
  )
}
