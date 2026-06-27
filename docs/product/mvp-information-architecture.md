# TasteApp MVP Information Architecture

Linear issue: [TST-26](https://linear.app/khoile11/issue/TST-26/define-tasteapp-mvp-information-architecture)
FigJam artifact: [TasteApp MVP Information Architecture](https://www.figma.com/board/da3SzJ39QTKTLdKYDgDlQi?utm_source=codex&utm_content=edit_in_figjam&oai_id=&request_id=7f2ff7ba-521c-4b49-b2d1-19abc84b54df)

This route map keeps TasteApp dish-first: users enter through Canonical Dish search or public SEO pages, compare RestaurantDishes on Dish Ranking pages, inspect RestaurantDish evidence through Dish Reviews, and contribute missing catalog data without making user submissions verified by default.

## Navigation Model

Mobile primary tabs:

- **Search**: Canonical Dish search, list-first Dish Rankings, distance filters, RestaurantDish detail, and Restaurant pages.
- **Saved**: Saved Items owned by the signed-in TasteApp User.
- **Contribute**: Catalog Contribution entry point for missing Restaurants, Locations, Canonical Dishes, Menu Items, and RestaurantDishes.
- **Account**: profile, owned Dish Reviews, settings, and sign-out.

Web primary areas:

- **Public pages**: landing page, Canonical Dish SEO pages, Restaurant SEO pages, and public RestaurantDish ranking/detail views.
- **Signed-in app**: saved items, Dish Review creation, Catalog Contribution flows, account/profile, and reporting confirmation states.
- **Moderation**: basic report queues and User Submission verification states. This is Phase 1.5 unless MVP delivery needs internal review screens earlier.

## Route Scope

| Route                                  | Surface     | Scope     | Purpose                                                                                      |
| -------------------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------------- |
| `/`                                    | Web         | MVP       | Public landing and search entry.                                                             |
| `/dishes`                              | Web, mobile | MVP       | Canonical Dish search and discovery entry.                                                   |
| `/dishes/:canonicalDishSlug`           | Web, mobile | MVP       | Public Canonical Dish page with RestaurantDish rankings.                                     |
| `/dishes/:canonicalDishSlug/rankings`  | Web, mobile | MVP       | List-first Dish Ranking with distance filters and Emerging labels.                           |
| `/restaurant-dishes/:restaurantDishId` | Web, mobile | MVP       | RestaurantDish detail, food-quality summary, Dish Reviews, save, review, and report actions. |
| `/restaurants/:restaurantSlug`         | Web, mobile | MVP       | Restaurant profile with Locations and known RestaurantDishes.                                |
| `/reviews/new?restaurantDishId=`       | Web, mobile | MVP       | Dish Review creation with required Food Quality Signals.                                     |
| `/saved`                               | Web, mobile | MVP       | Signed-in Saved Items.                                                                       |
| `/contribute`                          | Web, mobile | MVP       | Catalog Contribution hub.                                                                    |
| `/contribute/restaurants/new`          | Web, mobile | MVP       | Add Restaurant and first Location.                                                           |
| `/contribute/locations/new`            | Web, mobile | MVP       | Add Location to an existing Restaurant.                                                      |
| `/contribute/canonical-dishes/new`     | Web, mobile | MVP       | Add Canonical Dish.                                                                          |
| `/contribute/menu-items/new`           | Web, mobile | MVP       | Add Menu Item for a Restaurant.                                                              |
| `/contribute/restaurant-dishes/new`    | Web, mobile | MVP       | Link Restaurant, Menu Item, Location, and Canonical Dish into a RestaurantDish.              |
| `/reports/new`                         | Web, mobile | MVP       | Report incorrect, harmful, duplicate, or low-quality content.                                |
| `/account`                             | Web, mobile | MVP       | TasteApp User profile and settings.                                                          |
| `/moderation/reports`                  | Web         | Phase 1.5 | Internal queue for Reports and basic moderation states.                                      |
| `/moderation/submissions`              | Web         | Phase 1.5 | Internal queue for User Submission verification states and merge candidates.                 |
| `/map`                                 | Web, mobile | Phase 2   | Map-heavy browsing deferred beyond list-first MVP.                                           |
| `/food-crawls`                         | Web, mobile | Phase 2   | Premium Food Crawl planning.                                                                 |
| `/claimed-restaurants`                 | Web         | Phase 2   | Claimed Restaurant factual profile tools.                                                    |

## Entry Paths

Signed-out:

- Public search from `/` or `/dishes`.
- SEO entry into `/dishes/:canonicalDishSlug`, `/restaurants/:restaurantSlug`, or `/restaurant-dishes/:restaurantDishId`.
- Sign-in gate when saving, reviewing, contributing catalog data, or viewing private account data.

Signed-in:

- Search tab to Canonical Dish search, Dish Ranking, RestaurantDish detail, and Dish Review creation.
- Saved tab to Saved Items.
- Contribute tab to Catalog Contribution flows.
- Account tab to profile, owned reviews, settings, and sign-out.

Public SEO:

- Canonical Dish pages should index around "best {Canonical Dish} near {Location}" language while preserving list-first distance filtering.
- Restaurant pages should index known RestaurantDishes rather than implying a restaurant-wide score.
- RestaurantDish pages should expose Dish Reviews and food-quality evidence when enough public content exists.

## Key Flows

Dish search to ranking:

1. User searches for a Canonical Dish.
2. The app resolves the best matching Canonical Dish and shows a Dish Ranking.
3. Ranking results compare RestaurantDishes, show distance labels, and mark low-sample entries as Emerging.
4. User opens a RestaurantDish detail page or adjusts distance filters.

RestaurantDish ranking to review:

1. User opens a RestaurantDish from a Dish Ranking or Restaurant page.
2. Signed-out users are prompted to sign in before writing a Dish Review.
3. Signed-in users create a Dish Review with taste, value, portion, temperature, and ingredient quality.
4. Submitted Dish Reviews return users to the RestaurantDish and can affect Dish Rankings after persistence.

Catalog Contribution:

1. User starts from the Contribute tab or from an empty search/result state.
2. User adds the missing Restaurant, Location, Canonical Dish, Menu Item, or RestaurantDish.
3. The created object starts as an unverified User Submission.
4. Submission Nudges may prevent obvious duplicates without exposing internal moderation confidence.

Reporting:

1. User chooses report from a Dish Review, Restaurant, Location, Canonical Dish, Menu Item, or RestaurantDish.
2. User selects a reason: incorrect, harmful, duplicate, or low quality.
3. The Report enters moderation as a signal, not an automatic decision.
4. Phase 1.5 moderation screens triage Reports and User Submissions.

## Open Product Questions

- Should moderation queues be invisible internal routes in MVP, or does the team need a basic web screen before public launch?
- Should `Saved Items` include Canonical Dishes in MVP, or only RestaurantDishes and Restaurants?
- Does the mobile Contribute tab deserve a permanent primary tab, or should it be an action from search empty states until contribution volume proves it needs top-level space?
