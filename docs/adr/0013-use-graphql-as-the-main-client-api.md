# Use GraphQL as the main client API

TasteApp will use GraphQL as the main API for mobile and web clients from early development, with REST reserved for operational endpoints such as health checks, webhooks, auth callbacks, and file upload signing. The product is graph-shaped: Canonical Dishes, RestaurantDishes, Locations, Dish Reviews, rankings, user state, trust signals, and future AI recommendations need flexible nested reads, but GraphQL resolvers must remain thin adapters over bounded-context application services.
