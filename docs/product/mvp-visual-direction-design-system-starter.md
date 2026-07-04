# TasteApp MVP Visual Direction and Design System Starter

Linear issue: [TST-27](https://linear.app/khoile11/issue/TST-27/create-figma-visual-direction-and-design-system-starter)
Figma file: [TasteApp MVP Visual Direction and Design System Starter](https://www.figma.com/design/Lj9cU8NqwyQr27bG9GZ8E5)

This artifact is the first TasteApp visual direction and design system starter for MVP implementation. It gives frontend tickets concrete names, tokens, states, and mobile/web references while preserving the dish-first product philosophy from `CONTEXT.md` and the MVP IA.

The intended visual reference is a glossy mobile food-commerce style: oversized tactile food objects, soft white product cards, coral discount/action chips, dark rounded dish-detail panels, and a black floating bottom action bar. TasteApp should adapt that level of appetite appeal to dish ranking and trust, not copy the commerce model directly.

## Scope

The Figma starter includes:

- Mobile and web frames for the shared visual direction.
- Local TasteApp variables for color, spacing, and radius.
- Local text styles for display, title, body, label, and caption usage.
- A starter shadow/elevation style for lifted food-ranking cards.
- Core component starters for controls, inputs, search, filters, rankings, ratings, badges, dialogs, and system states.
- Visible treatments for `Emerging Ranking`, `Chain Candidate`, `Unverified`, and `Verification State` labels.

The Figma account is on the Starter plan, so the file is intentionally organized into three pages:

- `00 Cover`
- `01 Foundations`
- `02 Components and Frames`

## Visual Direction

TasteApp should feel dish-first, trust-forward, and appetizingly tactile.

The design direction uses warm food surfaces, coral primary actions, green and gold quality accents, compact confidence labels, glossy food illustrations, high-radius product cards, and dark feature panels for selected dish moments. It should not feel like a generic restaurant-rating clone or an admin catalog tool.

Reference-aligned cues:

- Large glossy food objects should be first-viewport signals.
- Ranking/product cards should use soft white surfaces, high radius, and lifted shadows.
- Dish detail moments may use a dark rounded hero panel with subtle food-pattern line art.
- Coral chips and circular action buttons should carry primary actions and short labels.
- Floating bottom action bars should feel tactile and mobile-native.
- Trust labels should remain visible but compact so they do not make the app feel analytical.

Use everyday product copy in UI:

- Prefer `Best ramen near you` over `Canonical Dish ranking`.
- Prefer `Review this dish` over `Create Dish Review`.
- Prefer `Why people like it` over `Score breakdown`.
- Prefer `Add a missing dish` over `Create RestaurantDish`.

## Starter Tokens

Color variables:

- `color/surface/page`
- `color/surface/card`
- `color/ink/primary`
- `color/ink/muted`
- `color/action/coral`
- `color/action/coralHover`
- `color/quality/gold`
- `color/quality/green`
- `color/status/emerging`
- `color/status/chain`
- `color/status/unverified`
- `color/status/verified`
- `color/status/error`
- `color/border/subtle`

Spacing variables:

- `space/2xs`
- `space/xs`
- `space/sm`
- `space/md`
- `space/lg`
- `space/xl`

Radius variables:

- `radius/sm`
- `radius/md`
- `radius/lg`

Text styles:

- `TasteApp/Display/Dish Hero`
- `TasteApp/Title/Page`
- `TasteApp/Title/Card`
- `TasteApp/Body/Default`
- `TasteApp/Label/Strong`
- `TasteApp/Caption/Muted`

Effect style:

- `TasteApp/Shadow/Card Lift`

## Component Inventory

Starter components:

- `Component / Button / Primary`
- `Component / Button / Secondary`
- `Component / Input / Text Field`
- `Component / Search Bar / Canonical Dish`
- `Component / Filter Chip / Distance`
- `Component / Rating Control / Food Quality Signal`
- `Component / Badges / Trust and Status Labels`
- `Component / Ranking Card / RestaurantDish`
- `Component / Dialog / Report Confirmation`
- `Component / Empty State / Add Missing Dish`
- `Component / Loading State / Ranking Skeleton`
- `Component / Error State / Search Failed`

Reference frames:

- `Mobile Frame / Glossy Dish Grid`
- `Mobile Frame / Dark Dish Detail`

Reference-aligned frame:

- `Reference-aligned TasteApp visual direction`

The earlier web reference frame is secondary to the mobile-first visual direction. Web implementation tickets should translate the same glossy dish-first system into SEO pages without making the site feel like an analytics dashboard.

## Implementation Notes

Treat these Figma components as MVP naming and visual references, not a final production library. The frontend component tickets should translate them into typed React Native and web primitives with explicit props, accessibility labels, loading/error states, and bounded user-facing copy.

The `Ranking Card / RestaurantDish` component should continue to emphasize dish-level evidence. Do not introduce a restaurant-wide score into this component.

The `Search Bar / Canonical Dish` component should remain a craving-first entry point. It can resolve to Canonical Dish search internally, but user-facing copy should stay natural.

The status labels are required product trust signals:

- `Emerging Ranking`: use for low-sample dish rankings.
- `Chain Candidate`: use when a Restaurant has multiple nearby Locations and dish quality may vary by Location.
- `Unverified`: use for user-submitted data that has not been verified.
- `Verification State`: use for approved, checked, or trusted data states.
