// Confere o conteúdo real de um arquivo já enviado (assinatura binária), não só o nome/extensão que
// o navegador informou (skill `seguranca` §6/§8). Promovido de `cadastro-projeto/rules.ts`: passou a
// servir também a biblioteca de arquivos de exemplo, então mora na camada de capacidade (`services`)
// em vez de dentro de uma única feature (skill `arquitetura` §2: só promover com reuso real).

const ascii = (texto: string) => [...texto].map((letra) => letra.charCodeAt(0))
const comecaCom = (bytes: Uint8Array, assinatura: readonly number[], deslocamento = 0) =>
  assinatura.every((byte, indice) => bytes[deslocamento + indice] === byte)

const ASSINATURAS: Record<string, (bytes: Uint8Array) => boolean> = {
  jpg: (bytes) => comecaCom(bytes, [0xff, 0xd8, 0xff]),
  jpeg: (bytes) => comecaCom(bytes, [0xff, 0xd8, 0xff]),
  png: (bytes) => comecaCom(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  webp: (bytes) => comecaCom(bytes, ascii('RIFF')) && comecaCom(bytes, ascii('WEBP'), 8),
  pdf: (bytes) => comecaCom(bytes, ascii('%PDF')),
  zip: (bytes) =>
    comecaCom(bytes, [0x50, 0x4b]) &&
    [
      [0x03, 0x04],
      [0x05, 0x06],
      [0x07, 0x08],
    ].some(([a, b]) => bytes[2] === a && bytes[3] === b),
  rar: (bytes) => comecaCom(bytes, ascii('Rar!')),
  // Arquivos DWG (AutoCAD R13 em diante) começam com "AC1" + 2 dígitos da versão (ex.: "AC1032").
  dwg: (bytes) => comecaCom(bytes, ascii('AC1')),
}

/** O começo do arquivo é mesmo do formato que a extensão diz? Um PNG renomeado para .zip não passa. */
export const formatoConfere = (extensao: string, inicio: Uint8Array) =>
  ASSINATURAS[extensao]?.(inicio) ?? false
