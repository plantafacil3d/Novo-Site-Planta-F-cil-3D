// Classes da faixa de cartões da página do projeto (hoje, os comentários dos depoimentos).
// Ficam num arquivo próprio, sem nenhuma importação, para os componentes de navegador usarem sem
// puxar o índice da feature.

/**
 * No celular, uma faixa que desliza de lado com encaixe (um pedaço do próximo cartão fica à mostra, para
 * avisar que dá para arrastar); a partir de `md`, grade. As colunas de cada fileira vêm de quem usa.
 * O `-mx-3 -mb-3` com `px-3 pb-3` (e `scroll-px-3`) não muda a posição dos cartões: só dá espaço para a
 * sombra deles, que a rolagem cortaria na borda da faixa.
 */
export const FAIXA_NO_CELULAR_GRADE_NO_COMPUTADOR =
  'flex snap-x snap-mandatory scroll-px-3 [scrollbar-width:none] gap-4 overflow-x-auto -mx-3 -mb-3 px-3 pb-3 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible [&::-webkit-scrollbar]:hidden'

export const ITEM_DA_FAIXA = 'w-[85%] shrink-0 snap-start md:w-auto'
