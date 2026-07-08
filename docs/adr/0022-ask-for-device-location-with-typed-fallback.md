# Ask for device location with typed fallback

TasteApp will ask for device location permission in MVP when distance labels or distance filters need a Search Location, while offering typed search location fallback when permission is declined or unavailable. This is a deliberate privacy and product tradeoff: device location makes nearby dish discovery useful with less friction, but typed fallback keeps list-first browsing available without forcing precise location sharing or making map-heavy UI part of the MVP.

The product principle is: ask GPS for convenience, provide typed fallback for consent, keep device coordinates session-only, and keep distance subordinate to food-quality rank. TasteApp should borrow the useful part of maps without becoming a map app.
