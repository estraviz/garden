import { TagContent } from "@quartz-community/tag-page"
import { componentRegistry } from "./quartz/components/registry"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { QuartzPluginData } from "./quartz/plugins/vfile"

const stripLeadingEmoji = (title?: string) => title?.replace(/^[^\w\s]+\s*/, "").trim() ?? ""
const createdTime = (file: QuartzPluginData) => file.dates?.created?.getTime() ?? 0

// Notes and posts read chronologically, breaking ties by title.
componentRegistry.setOptionOverrides("@quartz-community/folder-page", {
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => {
    const isChronological = (slug?: string) =>
      slug?.startsWith("notes/") || slug?.startsWith("posts/")
    const byCreated = createdTime(f2) - createdTime(f1)
    if (byCreated === 0 && isChronological(f1.slug) && isChronological(f2.slug)) {
      return stripLeadingEmoji(f1.frontmatter?.title).localeCompare(
        stripLeadingEmoji(f2.frontmatter?.title),
      )
    }
    return byCreated
  },
})

const config = await loadQuartzConfig()

// Tag listings read alphabetically, ignoring the emoji that prefixes most titles.
// The dispatcher calls `body(undefined)`, which drops TagPage's `sort` option, so bind it here.
const tagPage = config.plugins.pageTypes?.find((pageType) => pageType.name === "TagPage")
if (tagPage) {
  tagPage.body = () =>
    TagContent({
      sort: (a: QuartzPluginData, b: QuartzPluginData) =>
        stripLeadingEmoji(a.frontmatter?.title)
          .toLowerCase()
          .localeCompare(stripLeadingEmoji(b.frontmatter?.title).toLowerCase()),
    })
}

export default config
export const layout = await loadQuartzLayout()
