# Use balanced full matches for Group Dish Match

TasteApp will make Group Dish Match favor Restaurants or Locations with reliable evidence for every selected Canonical Dish before showing Partial Matches. The MVP algorithm should start simple: full matches first, prefer the result whose weakest selected dish is strongest, then use average rank and confidence as tie-breakers, while keeping formula exploration as a product/spec blocker before implementation rather than burying the choice inside code.
