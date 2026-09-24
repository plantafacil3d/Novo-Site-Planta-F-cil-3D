// Textos fixos da página do projeto: valem para todos os projetos, não vêm do banco.
// TEMPORÁRIO: textos de exemplo. Revisar com o cliente antes de publicar.

import type { ChaveEspecificacao } from './rules'

export type PerguntaFrequente = { pergunta: string; resposta: string }

export type EspecificacaoTexto = { label: string; explicacao: string }

/**
 * Nome e explicação curta de cada especificação técnica, para quem não conhece o termo (o site
 * vende para vários países/idiomas — "suíte", por exemplo, não é óbvio fora do Brasil). Fonte
 * única do texto: `EspecificacoesTecnicas` usa `label` (com o valor do projeto ao lado) e
 * `GlossarioEspecificacoes` usa os dois, sempre para as chaves de `listarChavesDeEspecificacao`.
 */
export const textosDeEspecificacao: Record<ChaveEspecificacao, EspecificacaoTexto> = {
  larguraTerreno: {
    label: 'Largura do terreno',
    explicacao: 'Medida do terreno de um lado ao outro, olhando de frente para o lote.',
  },
  profundidadeTerreno: {
    label: 'Profundidade do terreno',
    explicacao: 'Medida do terreno da frente até o fundo.',
  },
  areaConstruida: {
    label: 'Área construída',
    explicacao: 'Soma de todos os espaços cobertos da casa, em metros quadrados.',
  },
  quartos: {
    label: 'Quartos',
    explicacao: 'Cômodo para dormir, sem banheiro próprio.',
  },
  suites: {
    label: 'Suítes',
    explicacao: 'Quarto que tem banheiro e closet (armário embutido) só para quem dorme nele.',
  },
  banheiros: {
    label: 'Banheiros',
    explicacao: 'Banheiro de uso comum, fora dos quartos.',
  },
  vagas: {
    label: 'Vagas de garagem',
    explicacao: 'Quantos carros cabem na garagem ou na área coberta para veículos.',
  },
  pavimentos: {
    label: 'Pavimentos',
    explicacao: 'Quantos andares a casa tem (térrea conta como 1 pavimento).',
  },
  piscina: {
    label: 'Piscina',
    explicacao: 'O projeto já inclui uma piscina na área externa.',
  },
  areaGourmet: {
    label: 'Área gourmet',
    explicacao: 'Espaço externo com churrasqueira, preparado para receber convidados.',
  },
}

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    pergunta: 'O que recebo ao comprar este projeto?',
    resposta:
      'Você recebe plantas baixas, fachadas, cortes, implantação, arquivos técnicos em PDF e DWG e imagens 3D do projeto.',
  },
  {
    pergunta: 'Como recebo os arquivos?',
    resposta:
      'Assim que o pagamento é confirmado, o acesso aos arquivos é liberado na plataforma de compra e enviado para o seu e-mail.',
  },
  {
    pergunta: 'Quais formatos estão disponíveis?',
    resposta: 'Os arquivos técnicos vêm em PDF e DWG, e as imagens em JPG e PNG.',
  },
  {
    pergunta: 'Posso adaptar o projeto?',
    resposta:
      'Sim. O projeto pode ser adaptado ao seu terreno e à legislação local por um profissional habilitado. Se preferir, fale com a nossa equipe.',
  },
  {
    pergunta: 'Posso usar em outro terreno?',
    resposta:
      'Sim, desde que as medidas do terreno sejam compatíveis. Para terrenos diferentes, pode ser preciso adaptar o projeto.',
  },
  {
    pergunta: 'O projeto inclui projetos complementares?',
    resposta:
      'Não. Os projetos estrutural, elétrico, hidráulico e de interiores são vendidos separadamente, na página de projetos complementares.',
  },
  {
    pergunta: 'Existe suporte após a compra?',
    resposta:
      'Sim. Nossa equipe tira as suas dúvidas sobre o projeto e sobre os arquivos depois da compra.',
  },
  {
    pergunta: 'Como funciona a entrega?',
    resposta:
      'A entrega é 100% digital. Nada é enviado pelo correio: você baixa os arquivos assim que o pagamento é confirmado.',
  },
  {
    pergunta: 'O projeto é registrado?',
    resposta:
      'A compra é do projeto arquitetônico. Para aprovar na prefeitura e construir, um profissional habilitado precisa assumir a responsabilidade técnica (ART ou RRT).',
  },
  {
    pergunta: 'Posso parcelar a compra?',
    resposta:
      'As formas de pagamento e o parcelamento dependem da plataforma de compra e aparecem na hora de finalizar o pedido.',
  },
]
