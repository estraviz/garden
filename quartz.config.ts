import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

// Light mode alternatives. Keep two options around so you can A/B quickly.
const lightModePaper = {
  // Warm, lower-glare "paper" background
  light: "#f4f1ea",
  lightgray: "rgba(15, 23, 42, 0.10)",
  gray: "#64748b",
  darkgray: "#334155",
  dark: "#0f172a",
  secondary: "#2bbc8a",
  tertiary: "#b45309",
  highlight: "rgba(43, 188, 138, 0.10)",
  textHighlight: "#ffe58f80",
}

const lightModeClean = {
  // Cooler, more neutral background
  light: "#f5f7fb",
  lightgray: "rgba(2, 6, 23, 0.10)",
  gray: "#64748b",
  darkgray: "#334155",
  dark: "#0f172a",
  secondary: "#2bbc8a",
  tertiary: "#b91c1c",
  highlight: "rgba(43, 188, 138, 0.10)",
  textHighlight: "#ffe58f80",
}

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "TheDataIsFlat.com",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "www.thedataisflat.com",
    ignorePatterns: ["**/private/**", "**/templates/**", "**/.obsidian/**"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Victor Mono", // "Schibsted Grotesk",
        body: "IBM Plex Mono", // "Source Sans Pro", // "MS Reference Sans Serif",
        code: "JetBrains Mono", // "IBM Plex Mono",
      },
      colors: {
        // Toggle between `lightModePaper` and `lightModeClean`.
        lightMode: lightModeClean,
        darkMode: {
          light: "#14202b", // "#161618",
          lightgray: "#25333e", // "#393639",
          gray: "#646464",
          darkgray: "#999", // "#d4d4d4",
          dark: "#2bbc8a", // "#ebebec",
          secondary: "#eee", // "#7b97aa",
          tertiary: "#fd6465", // "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false, parseTags: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        sort: (f1, f2) => {
          const isChronologicalFolder = (slug?: string) =>
            slug?.startsWith("notes/") || slug?.startsWith("posts/")

          if (isChronologicalFolder(f1.slug) && isChronologicalFolder(f2.slug)) {
            const time1 = f1.dates?.created?.getTime() ?? 0
            const time2 = f2.dates?.created?.getTime() ?? 0
            if (time1 !== time2) {
              return time2 - time1
            }

            const title1 = f1.frontmatter?.title?.replace(/^[^\w\s]+\s*/, "") ?? ""
            const title2 = f2.frontmatter?.title?.replace(/^[^\w\s]+\s*/, "") ?? ""
            return title1.localeCompare(title2)
          }

          return (f2.dates?.created?.getTime() ?? 0) - (f1.dates?.created?.getTime() ?? 0)
        },
      }),
      Plugin.TagPage({
        sort: (a, b) => {
          const titleA =
            a.frontmatter?.title
              ?.replace(/^[^\w\s]+/, "")
              .trim()
              .toLowerCase() ?? ""
          const titleB =
            b.frontmatter?.title
              ?.replace(/^[^\w\s]+/, "")
              .trim()
              .toLowerCase() ?? ""
          return titleA.localeCompare(titleB)
        },
      }),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
