import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

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
        lightMode: {
          light: "#fafafa", // "#faf8f8",
          lightgray: "rgba(0, 59, 69, 0.15)", // "#e5e5e5",
          gray: "#597ca5", // "#b8b8b8",
          darkgray: "#05306B", // "#4e4e4e",
          dark: "#1d1f21", // "#2b2b2b",
          secondary: "#2bbc8a", // "#284b63",
          tertiary: "#ab2a3e", // "#84a59d",
          highlight: "rgba(0, 59, 69, 0.15)", // "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
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
