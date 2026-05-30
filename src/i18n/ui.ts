export const ui = {
  pt: {
    htmlLang: 'pt-BR',
    nav: {
      brand: 'Vinicius Tirabassi',
      about: 'Sobre',
      blog: 'Blog',
      tracks: 'Trilhas',
      library: 'Biblioteca',
      search: 'Buscar',
    },
    search: {
      placeholder: 'Buscar artigos e recursos...',
      empty: 'Nenhum resultado encontrado.',
      labelBlog: 'Blog',
      labelTrack: 'Trilha',
      labelLibrary: 'Biblioteca',
    },
    home: {
      recentPosts: 'Artigos recentes',
      viewAll: 'Ver todos →',
      noPosts: 'Nenhum artigo publicado ainda.',
    },
    blog: {
      title: 'Blog',
      description: 'Artigos sobre engenharia de software e liderança técnica.',
      sidebarTitle: 'Nesta página',
    },
    tracks: {
      title: 'Trilhas',
      description: 'Cronogramas de estudo estruturados.',
      resources: 'recursos',
      hours: 'horas',
      progress: 'Progresso',
      backToTracks: '← Trilhas',
    },
    library: {
      title: 'Biblioteca',
      description: 'Artigos, vídeos e links que estudo, organizados por tema.',
      addedAt: 'Adicionado em',
      allThemes: 'Todos',
      sidebarTitle: 'Nesta página',
    },
    post: {
      backToHome: '← Voltar para o blog',
    },
    dateLocale: 'pt-BR' as const,
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  },
  en: {
    htmlLang: 'en-US',
    nav: {
      brand: 'Vinicius Tirabassi',
      about: 'About',
      blog: 'Blog',
      tracks: 'Tracks',
      library: 'Library',
      search: 'Search',
    },
    search: {
      placeholder: 'Search articles and resources...',
      empty: 'No results found.',
      labelBlog: 'Blog',
      labelTrack: 'Track',
      labelLibrary: 'Library',
    },
    home: {
      recentPosts: 'Recent articles',
      viewAll: 'See all →',
      noPosts: 'No articles published yet.',
    },
    blog: {
      title: 'Blog',
      description: 'Articles about software engineering and technical leadership.',
      sidebarTitle: 'On this page',
    },
    tracks: {
      title: 'Tracks',
      description: 'Structured study schedules.',
      resources: 'resources',
      hours: 'hours',
      progress: 'Progress',
      backToTracks: '← Tracks',
    },
    library: {
      title: 'Library',
      description: 'Articles, videos and links I study, organized by topic.',
      addedAt: 'Added on',
      allThemes: 'All',
      sidebarTitle: 'On this page',
    },
    post: {
      backToHome: '← Back to blog',
    },
    dateLocale: 'en-US' as const,
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'],
  },
} as const;

export type Lang = keyof typeof ui;
