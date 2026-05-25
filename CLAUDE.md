# [NOME DO CLIENTE] — Site institucional MAVEI

> Template base padrão MAVEI. Cliente novo nasce dele. Preencha antes de começar a customizar.
> Última atualização do template: 2026-05-19 (self-host fonts, lazy GA4, brand.json schema)

## Quem é o cliente

- **Nome:** [Nome do Cliente]
- **Segmento:** [ex: arquitetura e engenharia em Americana-SP]
- **Fundador / responsável:** [Nome]
- **Site:** [url]
- **WhatsApp:** [número]

## O que o negócio faz

[2-3 frases diretas: o que oferece, para quem, qual o resultado entregue.]

## Público-alvo

[Quem é o cliente ideal: faixa etária, dor principal, o que pesquisa antes de contratar.]

## Diferenciais reais

- [Diferencial 1]
- [Diferencial 2]
- [Diferencial 3]

## Tom de voz

[ex: "Direto e acolhedor. Fala como profissional que respeita o tempo do cliente. Sem jargão técnico. Sem exagero."]

---

## Stack e regras técnicas (NÃO mudar sem motivo)

**HTML estático puro, sem framework, sem build step.** Tudo serve direto do Netlify.

### Performance (padrão 95+ PageSpeed mobile)

- **Fontes self-hosted em `/fonts/*.woff2`** (NÃO usar Google Fonts CDN — gera round-trip extra de ~150-300ms)
- `font-display: optional` pra Cormorant (títulos serif) — sem swap visível
- `font-display: swap` pra Inter (corpo sans)
- CSS com `preload` + `stylesheet` no `<head>` (paralelo ao parse HTML)
- `main.js` com `defer` no fim do `<body>` (não bloqueia parse)
- GA4 **lazy** — só carrega no primeiro evento (scroll/click/touch/keydown) ou após 5s
- `styles.css` **DEVE ser blocking** (NÃO usar `preload+onload` — causa CLS no hero)
- `main.js` **NÃO minificar com terser** — quebrou TBT no Moto G

### Imagens

- Hero principal: PNG/JPG em alta + AVIF/WebP versão pequena via `<picture>`
- `loading="eager"` só no hero acima da dobra; resto `loading="lazy"`
- `width` e `height` sempre presentes (evita CLS)
- Otimizar via [Squoosh.app](https://squoosh.app) antes de subir

### SEO

- Schema.org `Organization` + `LocalBusiness` + `WebSite` + `BreadcrumbList` no `<head>` (já tem placeholders)
- `sitemap.xml` na raiz
- `robots.txt` na raiz
- Open Graph + Twitter Card
- Canonical URL em toda página
- `geo.region` + `geo.placename` (SEO local)

### Conteúdo

- Linguagem: **português do Brasil**
- **Não usar emojis** no código ou nos textos
- CTA principal sempre aponta para WhatsApp (`https://wa.me/[NUMERO]?text=[MENSAGEM_ENCODED]`)
- Não mencionar concorrentes
- HTML semântico (`<header>`, `<main>`, `<article>`, `<section>`, `<footer>`)
- Acessibilidade: `alt` em imagens, `aria-label` em links de ícone, contraste mínimo 4.5:1

---

## Paleta de cores e tipografia

A fonte de verdade é o **`brand.json`** na raiz. CSS lê via variáveis. Para mudar cores/fontes:

1. Edite `brand.json`
2. Edite os tokens em `:root` do `styles.css` (sincronize)
3. Se trocar família tipográfica, **adicione os WOFF2 correspondentes em `/fonts/`** e atualize `/fonts/fonts.css`

### Tipografia padrão do template

- **Títulos:** Cormorant Garamond (serif clássica refinada)
- **Corpo:** Inter Tight (sans neutra moderna)
- **UI/mono:** JetBrains Mono (tags, badges, números)

Outras fontes disponíveis na biblioteca MAVEI (consultar admin):
Playfair Display, Lora, DM Serif, Crimson Pro, Fraunces, DM Sans,
Bebas Neue, Oswald, Anton, Archivo Black, Caveat.

---

## Estrutura do projeto

```
[cliente]/
├── index.html              # Landing page principal
├── sobre.html              # Página Sobre
├── servicos.html           # Página Serviços/Projetos
├── contato.html            # Página Contato (com formulário)
├── 404.html                # (opcional) Página de erro
├── styles.css              # CSS global
├── main.js                 # Comportamentos básicos
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── brand.json              # ★ Fonte de verdade da identidade (cores, fontes, contato)
├── CLAUDE.md               # Este arquivo
├── fonts/                  # ★ Fontes self-hosted (WOFF2 latin + latin-ext)
│   ├── fonts.css
│   └── *.woff2
├── assets/
│   └── images/             # Fotos do cliente
│       ├── favicon.svg
│       ├── og-image.jpg    # 1200x630
│       └── logo.png        # 500x71 ou similar
└── blog/
    └── index.html          # Listagem do blog (gerado pela plataforma MAVEI — não editar manualmente)
```

## O que NÃO alterar sem consultar

- `brand.json` — fonte de verdade para as automações da MAVEI (blog, IG, stories)
- `blog/` — gerenciado pela plataforma MAVEI, não editar manualmente
- `/fonts/` — manter pelo menos Inter + Cormorant pra retrocompat com blog gerado

---

## Checklist de customização (cliente novo)

Quando criar repo do cliente via Edge Function `create-client-repo`, este template é copiado. Depois:

- [ ] Preencher `brand.json` com dados reais
- [ ] Atualizar `CLAUDE.md` (este arquivo) com briefing real
- [ ] Substituir placeholders `[NOME_CLIENTE]`, `[DOMINIO]`, `[CIDADE]`, etc nos 4 HTMLs
- [ ] Substituir placeholders no Schema.org (`@id`, telefone, endereço)
- [ ] Substituir `[GA4_ID]` se cliente tem GA4 (ou deixar vazio que script não dispara)
- [ ] Trocar `favicon.svg`, `logo.png`, `og-image.jpg` em `/assets/images/`
- [ ] Adicionar fotos reais do cliente em `/assets/images/`
- [ ] Se cliente tiver fonte diferente da padrão: adicionar WOFF2 em `/fonts/` + atualizar `/fonts/fonts.css` + `:root` do `styles.css`
- [ ] Customizar copy do hero, serviços, sobre conforme briefing
- [ ] Testar performance no PageSpeed Insights (mobile **e** desktop)
- [ ] Validar Schema.org no [Schema Markup Validator](https://validator.schema.org/)
- [ ] Conectar Netlify ao repo + DNS apontando pro domínio
