/* empty css                                  */
import { a4 as createComponent, ae as maybeRenderHead, a0 as addAttribute, am as renderScript, aq as renderTemplate, a3 as createAstro, ah as renderComponent } from '../chunks/astro/server_IWdyT5qr.mjs';
import 'piccolore';
import { l as libraryData, $ as $$BaseLayout } from '../chunks/BaseLayout_C4AV0BF7.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$ShareButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ShareButton;
  const { url, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button class="share-btn text-apple-caption text-apple-blue flex items-center gap-1 hover:opacity-70 transition-opacity active:scale-95"${addAttribute(url, "data-url")}${addAttribute(title, "data-title")} aria-label="Compartilhar"> <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="18" cy="5" r="3"></circle> <circle cx="6" cy="12" r="3"></circle> <circle cx="18" cy="19" r="3"></circle> <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line> <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line> </svg> <span class="share-label">Compartilhar</span> </button> ${renderScript($$result, "/Users/vinicius/code/personal-site/src/components/ShareButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/vinicius/code/personal-site/src/components/ShareButton.astro", void 0);

const $$Astro = createAstro();
const $$StarRating = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StarRating;
  const { itemId } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="star-rating flex flex-col items-end gap-1"${addAttribute(itemId, "data-item-id")}> <div class="stars flex gap-0.5"> ${[1, 2, 3, 4, 5].map((star) => renderTemplate`<button class="star text-apple-hairline hover:text-apple-blue transition-colors text-lg leading-none cursor-pointer"${addAttribute(star, "data-star")}${addAttribute(`Dar ${star} estrela${star > 1 ? "s" : ""}`, "aria-label")}>
★
</button>`)} </div> <p class="rating-summary text-apple-caption text-apple-ink-48">Sem avaliações</p> </div> ${renderScript($$result, "/Users/vinicius/code/personal-site/src/components/StarRating.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/vinicius/code/personal-site/src/components/StarRating.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const { items } = libraryData;
  const themes = [...new Set(items.map((item) => item.theme))].sort();
  const MONTH_NAMES = [
    "Janeiro",
    "Fevereiro",
    "Mar\xE7o",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];
  function monthId(dateStr) {
    const [year, month] = dateStr.split("-").map(Number);
    const name = MONTH_NAMES[month - 1].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    return `${year}-${name}`;
  }
  function monthLabel(dateStr) {
    const [year, month] = dateStr.split("-").map(Number);
    return `${year} - ${MONTH_NAMES[month - 1]}`;
  }
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.addedAt).valueOf() - new Date(a.addedAt).valueOf()
  );
  const groups = [];
  for (const item of sortedItems) {
    const id = monthId(item.addedAt);
    const label = monthLabel(item.addedAt);
    const g = groups.find((g2) => g2.id === id);
    if (g) g.items.push(item);
    else groups.push({ id, label, items: [item] });
  }
  const typeLabel = {
    article: "Artigo",
    video: "V\xEDdeo",
    link: "Link"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Biblioteca", "description": "Recursos que estudo e recomendo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-12"> <h1 class="text-apple-display font-semibold text-apple-ink dark:text-[#f5f5f7]">Biblioteca</h1> <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d] mt-2">
Artigos, vídeos e links que estudo, organizados por tema.
</p> </div> <div class="flex flex-wrap gap-2 mb-10"> <button class="filter-btn px-4 py-[11px] text-apple-caption rounded-full border border-apple-blue bg-apple-blue text-white transition-all" data-theme="all">
Todos
</button> ${themes.map((theme) => renderTemplate`<button class="filter-btn px-4 py-[11px] text-apple-caption rounded-full border border-apple-hairline dark:border-[#3a3a3c] text-apple-ink dark:text-[#f5f5f7] hover:border-apple-blue hover:text-apple-blue transition-all"${addAttribute(theme, "data-theme")}> ${theme} </button>`)} </div> <div class="lg:grid lg:grid-cols-[1fr_220px] lg:gap-16"> <!-- Main content --> <div> ${groups.map((group) => renderTemplate`<section${addAttribute(group.id, "id")} data-month class="mb-14"> <h2 class="text-apple-tagline font-semibold text-apple-ink dark:text-[#f5f5f7] mb-6 pb-3 border-b border-apple-hairline dark:border-[#3a3a3c]"> ${group.label} </h2> <ul class="flex flex-col gap-4"> ${group.items.map((item) => renderTemplate`<li class="library-item rounded-apple-lg border border-apple-hairline dark:border-[#3a3a3c] dark:bg-[#2c2c2e] p-6"${addAttribute(item.theme, "data-theme")}> <div class="flex items-start justify-between gap-6"> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-2 flex-wrap"> <span class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] bg-apple-parchment dark:bg-[#3a3a3c] px-3 py-1 rounded-full border border-apple-divider dark:border-[#3a3a3c]"> ${typeLabel[item.type] ?? item.type} </span> <span class="text-apple-caption text-apple-ink-48 dark:text-[#98989d]"> ${item.theme} </span> </div> <a${addAttribute(item.url, "href")} target="_blank" rel="noopener noreferrer" class="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-apple-ink dark:text-[#f5f5f7] hover:text-apple-blue dark:hover:text-apple-blue-dark transition-colors block"> ${item.title} </a> <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d] mt-1">${item.description}</p> ${item.personalNote && renderTemplate`<p class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] mt-3 italic border-l-2 border-apple-hairline dark:border-[#3a3a3c] pl-3"> ${item.personalNote} </p>`} </div> <div class="flex flex-col items-end gap-3 shrink-0"> ${renderComponent($$result2, "ShareButton", $$ShareButton, { "url": item.url, "title": item.title })} ${renderComponent($$result2, "StarRating", $$StarRating, { "itemId": item.id })} </div> </div> <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] mt-4">
Adicionado em ${new Date(item.addedAt).toLocaleDateString("pt-BR")} </p> </li>`)} </ul> </section>`)} </div> <!-- Sidebar --> ${groups.length > 0 && renderTemplate`<aside class="hidden lg:block"> <div class="sticky top-20"> <p class="text-apple-caption font-semibold text-apple-ink-48 dark:text-[#6e6e73] mb-3 uppercase tracking-wide">
Nesta página
</p> <nav> <ul class="flex flex-col gap-1"> ${groups.map((group) => renderTemplate`<li> <a${addAttribute(`#${group.id}`, "href")}${addAttribute(group.id, "data-month-link")} class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] hover:text-apple-blue dark:hover:text-apple-blue-dark transition-colors block py-0.5"> ${group.label} </a> </li>`)} </ul> </nav> </div> </aside>`} </div> ` })} ${renderScript($$result, "/Users/vinicius/code/personal-site/src/pages/library/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/vinicius/code/personal-site/src/pages/library/index.astro", void 0);

const $$file = "/Users/vinicius/code/personal-site/src/pages/library/index.astro";
const $$url = "/library";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
