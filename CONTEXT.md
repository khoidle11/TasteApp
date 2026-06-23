# TasteApp

TasteApp is a dish-first food review product. Its language separates food concepts, restaurant-specific offerings, and non-food experience factors so recommendations can focus on what a user wants to eat.

## Language

**Canonical Dish**:
A reusable food concept that can be served by many restaurants, such as tonkotsu ramen, birria tacos, or tiramisu.
_Avoid_: Dish, generic dish, dish category

**Menu Item**:
A restaurant-specific version of a Canonical Dish, such as a named ramen bowl on one restaurant's menu.
_Avoid_: Dish, offering

**RestaurantDish**:
The relationship between a Restaurant and a Menu Item that represents one restaurant's specific version of a Canonical Dish. This is the core unit that reviews and rankings compare.
_Avoid_: Restaurant, dish, restaurant rating

**Restaurant**:
A food business that serves Menu Items at one or more Locations.
_Avoid_: Venue, place

**Claimed Restaurant**:
A Restaurant profile managed by an authorized business owner or representative. Claimed Restaurants may correct factual business, menu, or Location information but must not control Dish Rankings or suppress Dish Reviews.
_Avoid_: Business account, owner account

**Location**:
A physical place where a Restaurant serves food.
_Avoid_: Address, branch

**Geocoded Location**:
A Location with latitude and longitude coordinates resolved from its address or user input. Geocoded Locations support distance filters and Convenience Mode.
_Avoid_: Map pin, coordinates

**Chain Candidate**:
A Restaurant with multiple Locations within a 50-mile radius. Chain Candidates should be flagged for review or special handling because Menu Items, prices, availability, and food quality may vary by Location.
_Avoid_: Chain, franchise

**Dish Review**:
A review of a RestaurantDish, focused on food-specific qualities rather than the overall restaurant experience.
_Avoid_: Restaurant review, general review

**Trust Signal**:
Evidence that can increase confidence in a Dish Review or contributor, such as an attached photo, recent visit claim, review history, account age, location check-in, or community reports. Trust Signals are roadmap inputs, not MVP requirements for creating a Dish Review.
_Avoid_: Proof, verification

**Review Photo**:
An image attached to a Dish Review. Review Photos are a Phase 2 Trust Signal stored in object storage with metadata in the application database.
_Avoid_: Upload, image

**Verified Account**:
A user account with enough account-quality checks to reduce spam and coordinated abuse. Verified Accounts are a review-integrity tool, not proof that every Dish Review from the account is true.
_Avoid_: Verified reviewer, trusted user

**TasteApp User**:
The local product profile linked to an external authentication identity. TasteApp User owns reviews, saved items, profile gamification, moderation history, and contributor activity inside TasteApp.
_Avoid_: Clerk user, account

**Bounded Context**:
A coherent domain area with its own language, rules, and ownership boundary. TasteApp should use Bounded Contexts to keep review, discovery, moderation, identity, and monetization concerns from collapsing into one large application model.
_Avoid_: Module, folder

**Review Integrity**:
The product discipline of keeping Dish Reviews useful, food-specific, resistant to spam, and resistant to coordinated pile-ons. Review Integrity uses structured inputs, account quality, moderation, and abuse detection without letting Restaurants control criticism.
_Avoid_: Review moderation, anti-cancel-culture

**Coordinated Review Attack**:
A sudden cluster of low-quality or suspicious Dish Reviews aimed at harming or inflating a RestaurantDish, Restaurant, or Location for reasons unrelated to the food experience.
_Avoid_: Cancel culture, review bomb

**Contributor Badge**:
A profile-level recognition earned through useful or trustworthy activity, such as consistently helpful Dish Reviews, photos, reports, or verified location activity. Contributor Badges are a gamification idea for later, not an MVP ranking dependency.
_Avoid_: Achievement, trophy

**Food Crawl**:
A multi-stop food itinerary built around specific RestaurantDishes, such as a dumpling crawl or chicken sandwich crawl. Food Crawls are a later discovery feature that can combine rankings, distance, open hours, budget, and taste preferences.
_Avoid_: Tour, itinerary

**Core Ranking Truth**:
The basic Dish Ranking, Dish Reviews, and food-quality evidence that explain which RestaurantDishes are best. Core Ranking Truth should remain free so TasteApp can earn trust and grow its community.
_Avoid_: Premium ranking, hidden ranking

**Food Quality Signal**:
A rating or observation about the food itself. MVP Dish Reviews require taste, value, portion, temperature, and ingredient quality.
_Avoid_: Rating, score

**Auxiliary Dish Quality**:
A dish-specific Food Quality Signal that applies only to certain kinds of food, such as crispiness for fried food, chew for noodles, melt for ice cream, or broth richness for soup. Auxiliary Dish Qualities should be prompted only when relevant to the Canonical Dish or Menu Item.
_Avoid_: Optional rating, extra quality

**Quality Taxonomy**:
The curated set of Food Quality Signals and Auxiliary Dish Qualities that TasteApp can prompt for a Canonical Dish or Menu Item. AI and trusted contributors may suggest taxonomy additions, but additions should be approved before becoming product prompts.
_Avoid_: Rating schema, review fields

**Repeat-Visit Signal**:
A Food Quality Signal that only becomes meaningful after a user has reviewed the same Restaurant, Location, RestaurantDish, or related Menu Item more than once. Consistency is the first expected Repeat-Visit Signal, but this area needs continued product brainstorming.
_Avoid_: Consistency rating, loyalty signal

**Experience Factor**:
An optional non-food signal such as service, ambiance, brand popularity, convenience, or general restaurant sentiment. Experience Factors can be turned on or off by users and should not dominate default dish rankings.
_Avoid_: Bias, auxiliary feature, vibe

**Dish Ranking**:
An ordered comparison of RestaurantDishes for a Canonical Dish, based primarily on Food Quality Signals.
_Avoid_: Restaurant ranking, overall ranking

**Emerging Ranking**:
A Dish Ranking entry based on fewer than the current confidence threshold of Dish Reviews. The MVP threshold is five Dish Reviews, but the threshold should be treated as configurable as TasteApp grows.
_Avoid_: Low-confidence ranking, new ranking

**Convenience Mode**:
An optional user-selected mode that prioritizes closer or easier-to-reach RestaurantDishes. Convenience Mode can change the browsing order, but the interface should still show each RestaurantDish's Food Quality rank.
_Avoid_: Distance ranking, nearby mode

**User Submission**:
A Restaurant, Location, Canonical Dish, Menu Item, RestaurantDish, or Dish Review created by a user. User Submissions are accepted quickly but should not be treated as verified product truth by default.
_Avoid_: User data, crowd data

**Verification State**:
The trust state of a User Submission, such as unverified, AI-suggested, verified, rejected, or merged.
_Avoid_: Status, moderation status

**Merge Candidate**:
A possible duplicate or near-duplicate record that may represent the same real-world Restaurant, Location, Canonical Dish, Menu Item, or RestaurantDish.
_Avoid_: Duplicate, match

**AI Verification Assist**:
An AI-supported suggestion that helps identify likely duplicates, canonical naming, misspellings, suspicious submissions, or missing context. AI Verification Assist informs human or system decisions but does not make user-submitted data verified by itself.
_Avoid_: AI verification, auto-verification

**Submission Nudge**:
A lightweight user-facing suggestion shown while a user creates a User Submission, such as "Did you mean tonkotsu ramen?". Submission Nudges help prevent duplicates without exposing internal verification confidence, merge queues, or moderation decisions.
_Avoid_: AI warning, verification prompt
