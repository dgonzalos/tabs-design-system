# Tabs - Design System

Built on top of the base repository [primait/fe-interview-design-system](https://github.com/primait/fe-interview-design-system).

An accessible, reusable Tabs component with a Badge, built for the Design System take-home test. It uses React 19, TypeScript and SCSS written from scratch, with no UI or CSS libraries.

Design: [Figma file](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=0-1&t=4pG7NN6HKxgxroDz-1)


## Getting started

You need Node 24 and pnpm (the version is pinned in `packageManager`).


```bash
pnpm install
pnpm storybook   # component showcase on http://localhost:6006
pnpm test        # unit and accessibility tests
pnpm check       # Biome lint and format
pnpm tsc         # type check
```

Storybook is where the component is showcased. `pnpm dev` still runs the empty app from the base repository.

A GitHub Actions workflow runs `check`, `tsc`, `test` and `build-storybook` on every push and pull request to `master`.

## Usage

```tsx
import { Tabs } from "./components/Tabs";

<Tabs
  aria-label="Inbox"
  variant="underline"
  defaultValue="files"
  onValueChange={(value) => console.log(value)}
  items={[
    { value: "emails", label: "Emails", content: "Your emails" },
    {
      value: "files",
      label: "Files",
      content: "Your files",
      badge: { label: "New", variant: "positive" },
    },
  ]}
/>;
```

### Tabs props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | required | One entry per tab and panel. |
| `variant` | `"pill" \| "underline"` | `"pill"` | Visual variant from the design. |
| `defaultValue` | `string` | first item | Value of the tab selected on first render. |
| `onValueChange` | `(value: string) => void` | | Called when the selected tab changes. |
| `aria-label` | `string` | | Accessible name of the tab list. Always pass one. |

Any other `div` prop (`className`, `id`, `data-*`) goes to the root element.

### TabItem

| Field | Type | Description |
| --- | --- | --- |
| `value` | `string` | Identifies the tab. It is also part of the ARIA ids, so it must be unique and have no spaces. |
| `label` | `string` | Text of the tab. |
| `content` | `ReactNode` | Content of its panel. |
| `badge` | `{ label: string; variant?: "neutral" \| "positive" \| "negative" }` | Optional badge shown after the label. |

`Badge` is also exported on its own, with a `variant` prop and its text as `children`.

## Acceptance criteria

- Switch between variants: `variant="pill"` or `variant="underline"`.
- Add a badge to a tab: `badge: { label }` on the item.
- Choose the badge variant: `badge.variant`, which is `neutral` by default and can be `positive` or `negative`.

## Accessibility

- Follows the WAI-ARIA Tabs pattern: `tablist`, `tab` and `tabpanel`, linked with `aria-controls` and `aria-labelledby`, with `aria-selected` on the selected tab.
- Keyboard: Tab moves to the selected tab and then to its panel. The left and right arrows move focus and select the tab at the same time, wrapping at both ends. Panels appear instantly, so automatic activation is the recommended behaviour.
- Roving tabindex: only the selected tab is in the tab order.
- Panels are focusable, so keyboard users can reach content that has no interactive elements.
- Both variants share a single focus ring token.
- Tests run axe-core on the rendered component. jsdom can't check colour contrast, so that is covered by the Storybook accessibility addon in a real browser.

## Design decisions

- **Data API (`items`) instead of compound components.** Tabs renders the whole ARIA structure itself, so it can't be put together wrong, and keyboard navigation is simple index arithmetic. The trade-off is less flexibility to customise a single tab.
- **Tabs are identified by `value`, not by index.** The state stays meaningful (`"files"` rather than `2`) and doesn't change when items are reordered or filtered.
- **Uncontrolled only.** `defaultValue` and `onValueChange` cover the brief. Controlled mode is in the next steps.
- **All panels stay mounted and hidden with `hidden`.** Switching is instant and each panel keeps its state, like a half-filled form. The cost is mounting every panel up front.
- **Mobile is a media query, not a prop.** Figma models it as a variant, but defines it as a viewport of 768px or less, which is what a media query expresses.
- **Overflowing tabs scroll horizontally.** Wrapping them onto a second line would look like two separate groups, especially with the Underline variant.
- **Two layers of tokens.** Semantic tokens use the names of the Figma colour variables, and primitives hold the raw values. Components only use semantic tokens, so a dark theme would only need to redefine those.
- **SCSS with CSS Modules and `data-variant`.** Scoped styles with no runtime cost, one clear selector per variant, and a stable hook for tests. Biome doesn't support SCSS yet, so those files are formatted in the editor.
- **The app loads the font, not the components.** Inter is loaded with `@fontsource/inter` at the entry points, and components only use `--font-family-sans`.

## Notes on the Figma file

A few things I'd raise with the design team:

- The focus ring of the unselected Pill is a hardcoded `#000000`, while the other states use `Inverse`. I used one focus token for all of them.
- The unselected Pill border has a 1.49:1 contrast ratio against white, below the 3:1 that WCAG asks for component boundaries.
- The unselected Underline in its active state doesn't reserve the 3px bottom space the other states do, so the label moves when pressed. In code every state reserves it.
- The Tab has a hidden `Timer` layer and an `Icon` property that isn't connected to any layer. Both look like planned features.
- Two small typos: the component property is named `Selcted`, and the Body S specimen reads "Body M".

## Testing

Vitest, Testing Library and `user-event`, plus axe-core. Each test covers one behaviour: rendering, initial selection with and without `defaultValue`, ARIA links, clicks, `onValueChange`, keyboard navigation, variants, badges, native props and accessibility.

jsdom doesn't apply media queries, so the mobile styles are checked in the `Mobile` story.

## Changes to the base repository

- `.gitattributes` enforces LF line endings, so Biome also passes on Windows.
- `react-dom` is aligned with `react` (19.3.0). With different versions the app rendered a blank page.
- `.storybook` is included in `tsconfig.json`, so its config is type-checked too.
- Added the GitHub Actions workflow.

I left two things untouched because they are outside the scope of the task: `@storybook/addon-links` is registered but not installed, and the `@typescript-eslint` packages aren't used.

## Known limitations

- On narrow screens, a tab focused with the arrow keys can stay partly out of view, because `focus()` only scrolls elements that are completely hidden.
- If `defaultValue` doesn't match any `value`, no tab is selected.

## Next steps

- Controlled mode (`value` and `onValueChange`).
- Home and End keys, and `scrollIntoView` after focusing a tab.
- Disabled state, icons and the Timer from Figma.
- Vertical orientation and manual activation.
- Lazy-mounted panels for heavy content.
- A compound component API if teams need to customise individual tabs.
- Publish Storybook on GitHub Pages.

