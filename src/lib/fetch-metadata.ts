export interface UrlMetadata {
  title: string;
  description: string;
}

export async function fetchMetadata(url: string): Promise<UrlMetadata> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PersonalSiteBot/1.0)' },
  });
  const html = await response.text();

  const ogTitle =
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1] ??
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/)?.[1];

  const ogDesc =
    html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/)?.[1] ??
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/)?.[1];

  const metaDesc =
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/)?.[1] ??
    html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/)?.[1];

  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim();

  return {
    title: ogTitle ?? titleTag ?? url,
    description: ogDesc ?? metaDesc ?? '',
  };
}
