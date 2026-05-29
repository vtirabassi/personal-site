import 'piccolore';
import { a7 as decodeKey } from './chunks/astro/server_IWdyT5qr.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Bq11DmmM.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/vinicius/code/personal-site/","cacheDir":"file:///Users/vinicius/code/personal-site/node_modules/.astro/","outDir":"file:///Users/vinicius/code/personal-site/dist/","srcDir":"file:///Users/vinicius/code/personal-site/src/","publicDir":"file:///Users/vinicius/code/personal-site/public/","buildClientDir":"file:///Users/vinicius/code/personal-site/dist/client/","buildServerDir":"file:///Users/vinicius/code/personal-site/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BoorSqYC.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BoorSqYC.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ratings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ratings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ratings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ratings.ts","pathname":"/api/ratings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/telegram-webhook","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/telegram-webhook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"telegram-webhook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/telegram-webhook.ts","pathname":"/api/telegram-webhook","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BoorSqYC.css"}],"routeData":{"route":"/library","isIndex":true,"type":"page","pattern":"^\\/library\\/?$","segments":[[{"content":"library","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/library/index.astro","pathname":"/library","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BoorSqYC.css"}],"routeData":{"route":"/sobre","isIndex":true,"type":"page","pattern":"^\\/sobre\\/?$","segments":[[{"content":"sobre","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sobre/index.astro","pathname":"/sobre","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/vinicius/code/personal-site/src/layouts/BaseLayout.astro",{"propagation":"in-tree","containsHead":false}],["/Users/vinicius/code/personal-site/src/pages/blog/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/vinicius/code/personal-site/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/vinicius/code/personal-site/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/vinicius/code/personal-site/src/pages/library/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/library/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/vinicius/code/personal-site/src/pages/sobre/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/sobre/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/ratings@_@ts":"pages/api/ratings.astro.mjs","\u0000@astro-page:src/pages/api/telegram-webhook@_@ts":"pages/api/telegram-webhook.astro.mjs","\u0000@astro-page:src/pages/blog/[slug]@_@astro":"pages/blog/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/library/index@_@astro":"pages/library.astro.mjs","\u0000@astro-page:src/pages/sobre/index@_@astro":"pages/sobre.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_C7A4M16U.mjs","/Users/vinicius/code/personal-site/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CAg5K1Od.mjs","/Users/vinicius/code/personal-site/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/Users/vinicius/code/personal-site/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BC9rRrgn.mjs","/Users/vinicius/code/personal-site/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BrMvRTfX.js","/Users/vinicius/code/personal-site/src/pages/library/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CaFHDesR.js","/Users/vinicius/code/personal-site/src/components/ShareButton.astro?astro&type=script&index=0&lang.ts":"_astro/ShareButton.astro_astro_type_script_index_0_lang.E6QqbcbW.js","/Users/vinicius/code/personal-site/src/components/StarRating.astro?astro&type=script&index=0&lang.ts":"_astro/StarRating.astro_astro_type_script_index_0_lang.CrAf2yGH.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/vinicius/code/personal-site/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts","const o=Array.from(document.querySelectorAll(\"section[data-month]\")),n=Array.from(document.querySelectorAll(\"[data-month-link]\"));function a(){if(!o.length||!n.length)return;let s=o[0].id;for(const t of o)t.getBoundingClientRect().top<=120&&(s=t.id);n.forEach(t=>{const e=t.dataset.monthLink===s;t.classList.toggle(\"text-apple-blue\",e),t.classList.toggle(\"dark:text-apple-blue-dark\",e),t.classList.toggle(\"font-semibold\",e),t.classList.toggle(\"text-apple-ink-48\",!e),t.classList.toggle(\"dark:text-[#6e6e73]\",!e)})}window.addEventListener(\"scroll\",a,{passive:!0});a();"],["/Users/vinicius/code/personal-site/src/pages/library/index.astro?astro&type=script&index=0&lang.ts","const a=document.querySelectorAll(\".filter-btn\"),i=document.querySelectorAll(\".library-item\");function n(){document.querySelectorAll(\"section[data-month]\").forEach(t=>{const l=Array.from(t.querySelectorAll(\".library-item\")).some(s=>s.style.display!==\"none\");t.style.display=l?\"\":\"none\";const e=document.querySelector(`[data-month-link=\"${t.id}\"]`)?.closest(\"li\");e&&(e.style.display=l?\"\":\"none\")}),o()}a.forEach(t=>{t.addEventListener(\"click\",()=>{a.forEach(e=>{e.classList.remove(\"bg-apple-blue\",\"text-white\",\"border-apple-blue\"),e.classList.add(\"border-apple-hairline\",\"text-apple-ink\")}),t.classList.add(\"bg-apple-blue\",\"text-white\",\"border-apple-blue\"),t.classList.remove(\"border-apple-hairline\",\"text-apple-ink\");const l=t.dataset.theme;i.forEach(e=>{e.style.display=l===\"all\"||e.dataset.theme===l?\"\":\"none\"}),n()})});const c=Array.from(document.querySelectorAll(\"section[data-month]\")),r=Array.from(document.querySelectorAll(\"[data-month-link]\"));function o(){if(!r.length)return;const t=c.filter(e=>e.style.display!==\"none\");if(!t.length)return;let l=t[0].id;for(const e of t)e.getBoundingClientRect().top<=120&&(l=e.id);r.forEach(e=>{const s=e.dataset.monthLink===l;e.classList.toggle(\"text-apple-blue\",s),e.classList.toggle(\"dark:text-apple-blue-dark\",s),e.classList.toggle(\"font-semibold\",s),e.classList.toggle(\"text-apple-ink-48\",!s),e.classList.toggle(\"dark:text-[#6e6e73]\",!s)})}window.addEventListener(\"scroll\",o,{passive:!0});o();"],["/Users/vinicius/code/personal-site/src/components/ShareButton.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".share-btn\").forEach(t=>{t.addEventListener(\"click\",async()=>{const e=t.dataset.url,r=t.dataset.title,a=t.querySelector(\".share-label\");if(navigator.share)try{await navigator.share({title:r,url:e})}catch{}else await navigator.clipboard.writeText(e),a.textContent=\"Copiado!\",setTimeout(()=>{a.textContent=\"Compartilhar\"},2e3)})});"],["/Users/vinicius/code/personal-site/src/components/StarRating.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".star-rating\").forEach(r=>{const c=r.dataset.itemId,o=r.querySelectorAll(\".star\"),d=r.querySelector(\".rating-summary\"),s=`voted:${c}`;function l(t,e){const a=Math.round(t);o.forEach((n,i)=>{n.style.color=i<a?\"#0066cc\":\"#e0e0e0\"}),d.textContent=e>0?`${t.toFixed(1)} (${e} ${e===1?\"voto\":\"votos\"})`:\"Sem avaliações\"}async function u(){try{const t=await fetch(`/api/ratings?id=${c}`),{average:e,count:a}=await t.json();l(e,a)}catch{}}localStorage.getItem(s)&&o.forEach(t=>{t.disabled=!0,t.style.cursor=\"default\"}),o.forEach(t=>{t.addEventListener(\"click\",async()=>{if(localStorage.getItem(s))return;const e=Number(t.dataset.star);localStorage.setItem(s,String(e)),o.forEach(a=>{a.disabled=!0,a.style.cursor=\"default\"});try{const a=await fetch(\"/api/ratings\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({id:c,vote:e})}),{average:n,count:i}=await a.json();l(n,i)}catch{}})}),u()});"]],"assets":["/_astro/_slug_.BoorSqYC.css","/favicon.ico","/favicon.svg","/blog/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"nwtkXzcfnL/EwrfG1yTOVl1CfvKN+dr0vGo9NoFz1IY="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
