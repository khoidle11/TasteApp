# TasteApp Business Expert Notes

This is a living document for business, product, psychology, and sociology considerations. Use it when evaluating TasteApp strategy, scope, monetization, go-to-market, and product decisions.

## Role Lens

The business expert should think like a consumer product strategist with strong psychology and sociology instincts, especially in mobile apps, food discovery, user-generated content, local marketplaces, and trust-based platforms.

Evaluate decisions through four lenses:

- **Business viability**: Does this help TasteApp acquire, retain, monetize, or defend users?
- **User psychology**: Does this match how people actually decide what to eat, review, save, and share?
- **Social behavior**: Does this account for group dining, local identity, status, cultural taste, and trust dynamics?
- **Execution focus**: Does this reduce scope to the smallest proof of the dish-first thesis?

## Core Business Thesis

TasteApp wins if users believe it answers a craving-specific decision better than restaurant-first apps.

The product should not be framed as "Yelp, but dish-first" for too long. The sharper business promise is:

> TasteApp helps people trust what to order, where to get it, and whether it is worth the trip.

The early product should prove that dish-first ranking changes behavior:

- Users search for specific dishes instead of generic restaurants.
- Users trust dish-level evidence more than restaurant-wide ratings.
- Users save or revisit specific RestaurantDishes.
- Users are willing to contribute lightweight food evidence.
- Small groups use Group Dish Match to resolve competing cravings.

## Psychological Premises

Food decisions are rarely purely rational. TasteApp should account for:

- **Craving specificity**: People often start with "I want ramen" or "I want crispy chicken," not "I need a restaurant."
- **Risk avoidance**: Users want to avoid wasting a meal, money, time, or social opportunity.
- **Mood and context**: The "best" choice changes when someone is tired, celebrating, rushed, dieting, or eating with others.
- **Trust calibration**: Users need to know whether a ranking is well-supported, Emerging, recent, or noisy.
- **Effort sensitivity**: Users may enjoy contributing, but only when the action feels tied to a food moment rather than database maintenance.
- **Identity and taste**: Food preferences signal culture, status, nostalgia, values, adventurousness, and belonging.

Do not assume users want to manage structured catalog data. They want to improve the answer to a craving.

## Sociological Premises

Food is social infrastructure. TasteApp should account for:

- **Group negotiation**: Many dining decisions involve mild conflict between cravings, diets, distance tolerance, budgets, and social roles.
- **Local reputation**: Neighborhoods, communities, campuses, and cities form strong beliefs about "the best" version of a dish.
- **Cultural specificity**: Dish taxonomy should respect regional and cultural meaning instead of flattening cuisines into generic categories.
- **Status and performance**: Reviews and badges can motivate contribution, but can also reward performative expertise and volume-chasing.
- **Restaurant power dynamics**: Claimed Restaurant tools must not let businesses suppress criticism or buy ranking influence.
- **Coordinated behavior**: Review bursts, fandom, resentment, influencer attention, and local drama can distort ranking truth.

## Short-Term Product Focus

The MVP should prove three loops before expanding:

1. **Craving Loop**: Search a Canonical Dish, see ranked RestaurantDishes, understand why, save or act.
2. **Evidence Loop**: Add a Dish Review or lightweight "I tried this" signal, then improve ranking confidence.
3. **Group Loop**: Select two or more Canonical Dishes and see balanced Restaurant or Location matches with visible tradeoffs.

Everything in the MVP should support one of these loops. If a feature does not strengthen one of them, defer it.

## Scope Warnings

Be cautious with:

- A permanent top-level Contribute tab before contribution demand is proven.
- Review forms that feel like homework.
- Too many required Food Quality Signals before users feel value.
- Building a complete catalog-management product before proving search and ranking demand.
- Overusing internal terms like RestaurantDish, Canonical Dish, and Menu Item in user-facing copy.
- Treating AI as a magic recommendation layer before the dish-first domain model has enough trusted data.
- Adding premium, badges, claimed restaurant tools, photos, maps, or crawls before the core loops retain users.

## MVP Recommendations

Prefer:

- Contextual contribution prompts from empty or thin-data states.
- Lightweight check-ins or "I tried this" actions before demanding full reviews.
- Simple review defaults, with dish-specific auxiliary prompts only when useful.
- Clear confidence labels such as Emerging, Well Supported, or Recently Reviewed.
- Ranking explanations that sound human, such as "loved for rich broth and strong value."
- Group Dish Match copy that shows tradeoffs plainly, such as "Great pizza, Emerging fried chicken."

Consider testing whether the first review flow can start with:

- Taste
- Value
- Portion
- Optional note
- Optional dish-specific signal, such as crispiness or broth richness

Temperature and ingredient quality may still matter, but they should be validated against completion rates and perceived burden.

## Long-Term Product Direction

TasteApp's long-term moat should be trust plus taste memory.

The product can become stronger over time by learning:

- What a user saves, tries, reviews, repeats, and avoids.
- Which dishes a user travels for versus only eats nearby.
- Which taste qualities matter to a user, such as spice, crispiness, richness, value, or portion.
- Which contributors are useful, calibrated, recent, and specific.
- Which group combinations work for friends, families, dates, coworkers, and local communities.

Long-term premium should improve discovery convenience, not hide ranking truth. Strong candidates:

- AI dish finder.
- Personalized taste profile.
- Power filters.
- Saved food maps.
- Food Crawl planning.
- Group preference matching.
- Trip or neighborhood food planning.

Avoid restaurant-paid placement as an early monetization strategy. It risks corrupting the central trust promise.

## Go-To-Market Considerations

TasteApp likely needs dense local or category-specific launches. A broad national launch may create too many empty states.

Possible wedge strategies:

- Launch around one city or campus.
- Launch around a few high-craving dishes, such as ramen, tacos, fried chicken, burgers, dumplings, dessert, or coffee.
- Partner with local food creators, student groups, neighborhood communities, or dish-specific enthusiasts.
- Use public SEO pages for "best [dish] near [place]" queries, but ensure pages contain enough real evidence to feel trustworthy.
- Seed data manually or semi-manually before asking users to contribute heavily.

The first market should be chosen for density, food diversity, creator activity, and willingness to try new local discovery apps.

## Metrics To Watch

Early validation metrics:

- Dish searches per user.
- Search-to-detail open rate.
- Detail-to-save rate.
- Detail-to-review or detail-to-check-in rate.
- Repeat search within 7 days.
- Saved RestaurantDish revisit rate.
- Group Dish Match usage and completion.
- Empty/thin-data state exits versus contributions.
- Review completion rate.
- Review form abandonment by step.

Trust and quality metrics:

- Percentage of ranked RestaurantDishes marked Emerging.
- Number of reviews per ranked RestaurantDish.
- Duplicate submission rate.
- Report rate by object type.
- Review burst anomalies.
- Ratio of contextual contributions to top-level contribution starts.

Business metrics:

- Activation rate from first dish search.
- Retention by saved item or check-in behavior.
- Organic SEO traffic to dish pages.
- Contribution rate by market or dish category.
- Conversion intent for future premium discovery features.

## Decision Checklist

Before adding a feature, ask:

- Does this help users make a craving-specific decision?
- Does this increase trust in dish-level evidence?
- Does this reduce or increase user effort at the wrong moment?
- Does this support a short-term proof loop or only a long-term platform idea?
- Could this distort rankings through status, popularity, restaurant pressure, or review manipulation?
- Is this understandable in everyday food language?
- Is there a smaller experiment that would answer the same business question?

## Open Business Questions

- Which launch market or dish category gives TasteApp the fastest density of useful evidence?
- Should MVP include a lightweight check-in before full review creation?
- Which Food Quality Signals are essential enough to require without hurting completion?
- Should Saved Items include Canonical Dishes in MVP, or start with RestaurantDishes and Restaurants only?
- How much seed data is needed before users feel the product is alive?
- What is the first premium feature users would actually pay for after trust is established?
- What contribution rewards motivate useful behavior without creating performative reviewing?
