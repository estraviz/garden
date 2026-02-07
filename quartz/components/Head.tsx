import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { JSResourceToScriptElement } from "../util/resources"
import { googleFontHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const title = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
    const description =
      fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description
    const { css, js } = externalResources

    const pageSlug = fileData.slug ?? "index"
    const is404 = pageSlug === "404"
    const isHome = pageSlug === "index"

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = is404 ? path : pathToRoot(pageSlug as FullSlug)
    const iconPath = joinSegments(baseDir, "static/favicon.ico")
    const pagePath = isHome ? "/" : `/${pageSlug}`
    const canonicalPath = joinSegments(path, pagePath)
    const canonicalUrl = new URL(canonicalPath, url.origin).toString()
    const ogImagePath = new URL(joinSegments(path, "static/og-image.png"), url.origin).toString()
    const ogType = isHome || is404 ? "website" : "article"
    const ogLocale = cfg.locale.replace("-", "_")
    const robotsPolicy = is404 ? "noindex, nofollow" : "index, follow, max-image-preview:large"

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {!is404 && <link rel="canonical" href={canonicalUrl} />}
        <meta name="robots" content={robotsPolicy} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImagePath} />
        <meta property="og:width" content="1200" />
        <meta property="og:height" content="675" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImagePath} />
        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        {css.map((href) => (
          <link key={href} href={href} rel="stylesheet" type="text/css" spa-preserve />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        <link rel="me" href="https://fosstodon.org/@estraviz" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
