// Textos fixos da página do projeto: valem para todos os projetos, não vêm do banco.
// TEMPORÁRIO: textos de exemplo. Revisar com o cliente antes de publicar.

import type { ChaveEspecificacao } from './rules'

export type PerguntaFrequente = { pergunta: string; resposta: string | string[] }

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
  suiteMaster: {
    label: 'Suíte master',
    explicacao:
      'A suíte principal da casa: maior que as demais, com banheiro e closet (armário embutido) próprios.',
  },
  banheiros: {
    label: 'Banheiros',
    explicacao: 'Cômodo com vaso, pia e chuveiro, para banho e higiene.',
  },
  lavabo: {
    label: 'Lavabo',
    explicacao: 'Banheiro pequeno, só com vaso e pia (sem chuveiro), para as visitas.',
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

/** Pergunta cuja resposta vem do cadastro do projeto (itens inclusos), não de texto fixo. */
export const perguntaItensInclusos = 'O que eu recebo ao comprar este projeto?'

/** Resposta de reserva, usada só quando o projeto não tem itens inclusos cadastrados. */
export const respostaItensInclusosPadrao =
  'Você recebe plantas baixas, fachadas, cortes, implantação, arquivos técnicos em PDF e DWG e imagens 3D do projeto.'

/** Demais perguntas: fixas. Um item do array vira um parágrafo na resposta. */
export const perguntasFrequentes: PerguntaFrequente[] = [
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
    resposta: [
      'Nós não realizamos modificações diretas nos projetos, pois vendemos os modelos prontos para garantir o menor preço do mercado.',
      'Porém, ao comprar na Planta Fácil 3D, você recebe todos os arquivos 100% editáveis em formato DWG (AutoCAD) e em outros formatos. Basta entregar esses arquivos ao arquiteto ou engenheiro da sua própria região que vai construir sua casa. Ele poderá alterar qualquer parede, janela ou cômodo facilmente e assinar a documentação técnica para sua obra.',
    ],
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
    resposta: [
      'Para construir de forma legalizada, toda prefeitura exige a assinatura de um Responsável Técnico Local (um engenheiro civil ou arquiteto habilitado na sua cidade) para dar entrada no alvará de construção.',
      'Como disponibilizamos o projeto em arquivos editáveis (DWG), você deve entregar esse material ao profissional local contratado para tocar sua obra. Ele fará as adaptações necessárias ao código de obras do seu município e assinará a documentação perante a prefeitura.',
    ],
  },
  {
    pergunta: 'Posso parcelar a compra?',
    resposta:
      'As formas de pagamento e o parcelamento dependem da plataforma de compra e aparecem na hora de finalizar o pedido.',
  },
]
