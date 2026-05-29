import { c as AstroError, Z as UnknownContentCollectionError, a4 as createComponent, S as RenderUndefinedEntryError, av as unescapeHTML, aq as renderTemplate, ar as renderUniqueStylesheet, an as renderScriptElement, a5 as createHeadAndContent, ah as renderComponent, a9 as defineScriptVars, ao as renderSlot, aj as renderHead, a0 as addAttribute, a3 as createAstro } from './astro/server_IWdyT5qr.mjs';
import 'piccolore';
import 'clsx';
import { escape } from 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { z } from 'zod';
import { r as removeBase, b as isRemotePath, p as prependForwardSlash } from './path_B7qWD0WV.mjs';
import { V as VALID_INPUT_FORMATS } from './consts_Cm-hF_R3.mjs';
import * as devalue from 'devalue';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BC9rRrgn.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
z.object({
  tags: z.array(z.string()).optional(),
  lastModified: z.date().optional()
});
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection,
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./content-assets_DleWbedO.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (entry.legacyId) {
          entry = emulateLegacyEntry(entry);
        }
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function emulateLegacyEntry({ legacyId, ...entry }) {
  const legacyEntry = {
    ...entry,
    id: legacyId,
    slug: entry.id
  };
  return {
    ...legacyEntry,
    // Define separately so the render function isn't included in the object passed to `renderEntry()`
    render: () => renderEntry(legacyEntry)
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import('./content-assets_DleWbedO.mjs');
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import('./_astro_assets_qOLteFzV.mjs').then(n => n._);
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      // This attribute is used by the toolbar audit
      ...Object.assign(__vite_import_meta_env__, { _: process.env._ }).DEV ? { "data-image-component": "true" } : {}
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if ("render" in entry && !("legacyId" in entry)) {
    return entry.render();
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import('./content-modules_Dz-S_Wwv.mjs');
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e) {
      console.error(e);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: isRemotePath(link) ? link : prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const liveCollections = {};

const contentDir = '/src/content/';

const contentEntryGlob = "";
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = "";
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = "";
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
	liveCollections,
});

const items = [{"id":"what-is-the-superpowers-plugin-for-claude-code-the-agentic-skills-framework-explained","title":"What Is the Superpowers Plugin for Claude Code? The Agentic Skills Framework Explained","url":"https://www.mindstudio.ai/blog/what-is-superpowers-plugin-claude-code","type":"link","theme":"IA Skills","description":"Superpowers is a free open-source plugin that installs 14 structured skills into Claude Code. Learn how it reduces tokens and improves output quality.","addedAt":"2026-05-28"},{"id":"structured-prompt-driven-development-spdd","title":"Structured-Prompt-Driven Development (SPDD)","url":"https://martinfowler.com/articles/structured-prompt-driven/","type":"link","theme":"SDD","description":"","addedAt":"2026-05-28"}];
const libraryData = {
  items,
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "Meu site pessoal" } = Astro2.props;
  const library = libraryData;
  const posts = await getCollection("blog");
  const searchItems = [
    ...posts.map((p) => ({
      type: "blog",
      title: p.data.title,
      description: p.data.description ?? "",
      url: `/blog/${p.slug}`,
      external: false
    })),
    ...library.items.map((i) => ({
      type: "library",
      title: i.title,
      description: i.description ?? "",
      url: i.url,
      external: true
    }))
  ];
  return renderTemplate(_a || (_a = __template(['<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', "><title>", `</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Prevent flash of wrong theme --><script>
      (function () {
        var t = localStorage.getItem('theme') || 'system';
        var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (dark) document.documentElement.classList.add('dark');
      })();
    <\/script>`, '</head> <body class="min-h-screen bg-white dark:bg-[#1c1c1e] text-apple-ink dark:text-[#f5f5f7] transition-colors duration-200" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;"> <!-- Nav --> <nav class="bg-black h-11 flex items-center px-6 sticky top-0 z-50"> <div class="max-w-[980px] mx-auto w-full flex items-center justify-between gap-4"> <a href="/" class="text-apple-nav text-white font-normal hover:opacity-70 transition-opacity shrink-0">\nVinicius Tirabassi\n</a> <div class="flex items-center gap-4"> <a href="/sobre" class="text-apple-nav text-white/80 hover:text-white transition-colors">Sobre</a> <a href="/blog" class="text-apple-nav text-white/80 hover:text-white transition-colors">Blog</a> <a href="/library" class="text-apple-nav text-white/80 hover:text-white transition-colors">Biblioteca</a> <!-- Search box --> <button id="search-open" aria-label="Buscar" class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 h-7 transition-colors text-apple-nav"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path> </svg> <span class="hidden sm:inline">Buscar</span> </button> <!-- Theme dropdown --> <div class="relative" id="theme-wrapper"> <button id="theme-toggle" aria-label="Alternar tema" class="text-white/80 hover:text-white transition-colors p-1 -m-1"> <svg id="icon-system" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line> </svg> <svg id="icon-light" class="hidden" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path> </svg> <svg id="icon-dark" class="hidden" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path> </svg> </button> <div id="theme-dropdown" class="hidden absolute right-0 top-[calc(100%+8px)] bg-white dark:bg-[#2c2c2e] border border-apple-hairline dark:border-[#3a3a3c] rounded-apple-md shadow-lg py-1 w-36 z-50"> <button data-theme="system" class="theme-option flex items-center gap-2 w-full px-3 py-2 text-apple-caption text-apple-ink dark:text-[#f5f5f7] hover:bg-apple-parchment dark:hover:bg-[#3a3a3c] transition-colors"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line> </svg>\nSistema\n</button> <button data-theme="light" class="theme-option flex items-center gap-2 w-full px-3 py-2 text-apple-caption text-apple-ink dark:text-[#f5f5f7] hover:bg-apple-parchment dark:hover:bg-[#3a3a3c] transition-colors"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path> </svg>\nClaro\n</button> <button data-theme="dark" class="theme-option flex items-center gap-2 w-full px-3 py-2 text-apple-caption text-apple-ink dark:text-[#f5f5f7] hover:bg-apple-parchment dark:hover:bg-[#3a3a3c] transition-colors"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path> </svg>\nEscuro\n</button> </div> </div> </div> </div> </nav> <!-- Search panel --> <div id="search-backdrop" class="hidden fixed inset-0 z-40 bg-black/40" aria-hidden="true"></div> <div id="search-panel" class="hidden fixed top-11 left-0 right-0 z-50 bg-white dark:bg-[#1c1c1e] border-b border-apple-hairline dark:border-[#3a3a3c] shadow-lg"> <div class="max-w-[980px] mx-auto px-6 py-4"> <div class="relative"> <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-apple-ink-48 dark:text-[#6e6e73] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path> </svg> <input id="search-input" type="search" placeholder="Buscar artigos e recursos..." autocomplete="off" class="w-full bg-apple-parchment dark:bg-[#2c2c2e] text-apple-ink dark:text-[#f5f5f7] placeholder-apple-ink-48 dark:placeholder-[#6e6e73] rounded-apple-md px-4 py-2 pl-10 text-apple-body border border-apple-hairline dark:border-[#3a3a3c] outline-none focus:border-apple-blue dark:focus:border-apple-blue-dark"> </div> <ul id="search-results" class="mt-3 flex flex-col gap-1 max-h-72 overflow-y-auto empty:hidden"></ul> </div> </div> <main class="max-w-[980px] mx-auto px-6 py-20"> ', ' </main> <footer class="bg-apple-parchment dark:bg-[#111113] px-6 py-16 mt-20 border-t border-apple-hairline dark:border-[#3a3a3c]"> <div class="max-w-[980px] mx-auto text-center text-apple-fine text-apple-ink-80 dark:text-[#6e6e73]">\n\xA9 ', " Vinicius Tirabassi\n</div> </footer> <script>(function(){", `
      // --- Theme ---
      const icons = {
        system: document.getElementById('icon-system'),
        light:  document.getElementById('icon-light'),
        dark:   document.getElementById('icon-dark'),
      };
      const themeDropdown = document.getElementById('theme-dropdown');
      const themeWrapper  = document.getElementById('theme-wrapper');

      function applyTheme(t) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = t === 'dark' || (t === 'system' && prefersDark);
        document.documentElement.classList.toggle('dark', isDark);
        Object.entries(icons).forEach(([key, el]) => {
          if (el) el.classList.toggle('hidden', key !== t);
        });
        // highlight active option
        document.querySelectorAll('.theme-option').forEach(btn => {
          btn.classList.toggle('font-semibold', btn.dataset.theme === t);
        });
      }

      function getTheme() { return localStorage.getItem('theme') || 'system'; }

      applyTheme(getTheme());

      document.getElementById('theme-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('hidden');
      });

      document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.dataset.theme;
          localStorage.setItem('theme', t);
          applyTheme(t);
          themeDropdown.classList.add('hidden');
        });
      });

      document.addEventListener('click', (e) => {
        if (!themeWrapper.contains(e.target)) themeDropdown.classList.add('hidden');
      });

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getTheme() === 'system') applyTheme('system');
      });

      // --- Search ---
      const searchOpen    = document.getElementById('search-open');
      const searchPanel   = document.getElementById('search-panel');
      const searchBackdrop = document.getElementById('search-backdrop');
      const searchInput   = document.getElementById('search-input');
      const searchResults = document.getElementById('search-results');

      function openSearch() {
        searchPanel.classList.remove('hidden');
        searchBackdrop.classList.remove('hidden');
        searchInput.focus();
      }

      function closeSearch() {
        searchPanel.classList.add('hidden');
        searchBackdrop.classList.add('hidden');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }

      searchOpen.addEventListener('click', openSearch);
      searchBackdrop.addEventListener('click', closeSearch);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      });

      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';
        if (!q) return;

        const hits = searchItems.filter(item =>
          item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        ).slice(0, 8);

        if (!hits.length) {
          searchResults.innerHTML = '<li class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] px-2 py-3">Nenhum resultado encontrado.</li>';
          return;
        }

        hits.forEach(item => {
          const li = document.createElement('li');
          const label = item.type === 'blog' ? 'Blog' : 'Biblioteca';
          const labelColor = item.type === 'blog'
            ? 'bg-apple-blue/10 text-apple-blue'
            : 'bg-[#3a3a3c]/10 text-apple-ink-48 dark:text-[#98989d]';

          li.innerHTML = \`
            <a href="\${item.url}"
               \${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
               class="flex items-start gap-3 px-3 py-2 rounded-apple-md hover:bg-apple-parchment dark:hover:bg-[#2c2c2e] transition-colors group">
              <span class="mt-[2px] shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full \${labelColor}">\${label}</span>
              <div class="min-w-0">
                <p class="text-apple-body font-medium text-apple-ink dark:text-[#f5f5f7] group-hover:text-apple-blue dark:group-hover:text-apple-blue-dark transition-colors truncate">\${item.title}</p>
                <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] truncate">\${item.description}</p>
              </div>
            </a>
          \`;
          li.querySelector('a').addEventListener('click', closeSearch);
          searchResults.appendChild(li);
        });
      });
    })();<\/script> </body> </html>`], ['<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', "><title>", `</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Prevent flash of wrong theme --><script>
      (function () {
        var t = localStorage.getItem('theme') || 'system';
        var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (dark) document.documentElement.classList.add('dark');
      })();
    <\/script>`, '</head> <body class="min-h-screen bg-white dark:bg-[#1c1c1e] text-apple-ink dark:text-[#f5f5f7] transition-colors duration-200" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;"> <!-- Nav --> <nav class="bg-black h-11 flex items-center px-6 sticky top-0 z-50"> <div class="max-w-[980px] mx-auto w-full flex items-center justify-between gap-4"> <a href="/" class="text-apple-nav text-white font-normal hover:opacity-70 transition-opacity shrink-0">\nVinicius Tirabassi\n</a> <div class="flex items-center gap-4"> <a href="/sobre" class="text-apple-nav text-white/80 hover:text-white transition-colors">Sobre</a> <a href="/blog" class="text-apple-nav text-white/80 hover:text-white transition-colors">Blog</a> <a href="/library" class="text-apple-nav text-white/80 hover:text-white transition-colors">Biblioteca</a> <!-- Search box --> <button id="search-open" aria-label="Buscar" class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 h-7 transition-colors text-apple-nav"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path> </svg> <span class="hidden sm:inline">Buscar</span> </button> <!-- Theme dropdown --> <div class="relative" id="theme-wrapper"> <button id="theme-toggle" aria-label="Alternar tema" class="text-white/80 hover:text-white transition-colors p-1 -m-1"> <svg id="icon-system" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line> </svg> <svg id="icon-light" class="hidden" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path> </svg> <svg id="icon-dark" class="hidden" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path> </svg> </button> <div id="theme-dropdown" class="hidden absolute right-0 top-[calc(100%+8px)] bg-white dark:bg-[#2c2c2e] border border-apple-hairline dark:border-[#3a3a3c] rounded-apple-md shadow-lg py-1 w-36 z-50"> <button data-theme="system" class="theme-option flex items-center gap-2 w-full px-3 py-2 text-apple-caption text-apple-ink dark:text-[#f5f5f7] hover:bg-apple-parchment dark:hover:bg-[#3a3a3c] transition-colors"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line> </svg>\nSistema\n</button> <button data-theme="light" class="theme-option flex items-center gap-2 w-full px-3 py-2 text-apple-caption text-apple-ink dark:text-[#f5f5f7] hover:bg-apple-parchment dark:hover:bg-[#3a3a3c] transition-colors"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path> </svg>\nClaro\n</button> <button data-theme="dark" class="theme-option flex items-center gap-2 w-full px-3 py-2 text-apple-caption text-apple-ink dark:text-[#f5f5f7] hover:bg-apple-parchment dark:hover:bg-[#3a3a3c] transition-colors"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path> </svg>\nEscuro\n</button> </div> </div> </div> </div> </nav> <!-- Search panel --> <div id="search-backdrop" class="hidden fixed inset-0 z-40 bg-black/40" aria-hidden="true"></div> <div id="search-panel" class="hidden fixed top-11 left-0 right-0 z-50 bg-white dark:bg-[#1c1c1e] border-b border-apple-hairline dark:border-[#3a3a3c] shadow-lg"> <div class="max-w-[980px] mx-auto px-6 py-4"> <div class="relative"> <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-apple-ink-48 dark:text-[#6e6e73] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path> </svg> <input id="search-input" type="search" placeholder="Buscar artigos e recursos..." autocomplete="off" class="w-full bg-apple-parchment dark:bg-[#2c2c2e] text-apple-ink dark:text-[#f5f5f7] placeholder-apple-ink-48 dark:placeholder-[#6e6e73] rounded-apple-md px-4 py-2 pl-10 text-apple-body border border-apple-hairline dark:border-[#3a3a3c] outline-none focus:border-apple-blue dark:focus:border-apple-blue-dark"> </div> <ul id="search-results" class="mt-3 flex flex-col gap-1 max-h-72 overflow-y-auto empty:hidden"></ul> </div> </div> <main class="max-w-[980px] mx-auto px-6 py-20"> ', ' </main> <footer class="bg-apple-parchment dark:bg-[#111113] px-6 py-16 mt-20 border-t border-apple-hairline dark:border-[#3a3a3c]"> <div class="max-w-[980px] mx-auto text-center text-apple-fine text-apple-ink-80 dark:text-[#6e6e73]">\n\xA9 ', " Vinicius Tirabassi\n</div> </footer> <script>(function(){", `
      // --- Theme ---
      const icons = {
        system: document.getElementById('icon-system'),
        light:  document.getElementById('icon-light'),
        dark:   document.getElementById('icon-dark'),
      };
      const themeDropdown = document.getElementById('theme-dropdown');
      const themeWrapper  = document.getElementById('theme-wrapper');

      function applyTheme(t) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = t === 'dark' || (t === 'system' && prefersDark);
        document.documentElement.classList.toggle('dark', isDark);
        Object.entries(icons).forEach(([key, el]) => {
          if (el) el.classList.toggle('hidden', key !== t);
        });
        // highlight active option
        document.querySelectorAll('.theme-option').forEach(btn => {
          btn.classList.toggle('font-semibold', btn.dataset.theme === t);
        });
      }

      function getTheme() { return localStorage.getItem('theme') || 'system'; }

      applyTheme(getTheme());

      document.getElementById('theme-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('hidden');
      });

      document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.dataset.theme;
          localStorage.setItem('theme', t);
          applyTheme(t);
          themeDropdown.classList.add('hidden');
        });
      });

      document.addEventListener('click', (e) => {
        if (!themeWrapper.contains(e.target)) themeDropdown.classList.add('hidden');
      });

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getTheme() === 'system') applyTheme('system');
      });

      // --- Search ---
      const searchOpen    = document.getElementById('search-open');
      const searchPanel   = document.getElementById('search-panel');
      const searchBackdrop = document.getElementById('search-backdrop');
      const searchInput   = document.getElementById('search-input');
      const searchResults = document.getElementById('search-results');

      function openSearch() {
        searchPanel.classList.remove('hidden');
        searchBackdrop.classList.remove('hidden');
        searchInput.focus();
      }

      function closeSearch() {
        searchPanel.classList.add('hidden');
        searchBackdrop.classList.add('hidden');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }

      searchOpen.addEventListener('click', openSearch);
      searchBackdrop.addEventListener('click', closeSearch);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      });

      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';
        if (!q) return;

        const hits = searchItems.filter(item =>
          item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        ).slice(0, 8);

        if (!hits.length) {
          searchResults.innerHTML = '<li class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] px-2 py-3">Nenhum resultado encontrado.</li>';
          return;
        }

        hits.forEach(item => {
          const li = document.createElement('li');
          const label = item.type === 'blog' ? 'Blog' : 'Biblioteca';
          const labelColor = item.type === 'blog'
            ? 'bg-apple-blue/10 text-apple-blue'
            : 'bg-[#3a3a3c]/10 text-apple-ink-48 dark:text-[#98989d]';

          li.innerHTML = \\\`
            <a href="\\\${item.url}"
               \\\${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
               class="flex items-start gap-3 px-3 py-2 rounded-apple-md hover:bg-apple-parchment dark:hover:bg-[#2c2c2e] transition-colors group">
              <span class="mt-[2px] shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full \\\${labelColor}">\\\${label}</span>
              <div class="min-w-0">
                <p class="text-apple-body font-medium text-apple-ink dark:text-[#f5f5f7] group-hover:text-apple-blue dark:group-hover:text-apple-blue-dark transition-colors truncate">\\\${item.title}</p>
                <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] truncate">\\\${item.description}</p>
              </div>
            </a>
          \\\`;
          li.querySelector('a').addEventListener('click', closeSearch);
          searchResults.appendChild(li);
        });
      });
    })();<\/script> </body> </html>`])), addAttribute(description, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]), (/* @__PURE__ */ new Date()).getFullYear(), defineScriptVars({ searchItems }));
}, "/Users/vinicius/code/personal-site/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, getCollection as g, libraryData as l };
