# Legal Risk Register

Status: Draft working register, requires owner decisions and attorney review.

| Risk                                                          | Why It Matters                                                                              | Current Posture                                                                            | Owner Decision Needed                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| User-uploaded food photos may infringe copyright              | Users can upload photos they did not take or do not have permission to submit.              | Require user rights promise, content license, DMCA process, and moderation/takedown state. | Choose DMCA contact and register designated agent before media launch.     |
| Reviews can be fake, paid, or manipulated                     | Fake or incentivized reviews can create legal, trust, and ranking risk.                     | Draft Review Integrity Policy and require account-based Dish Reviews.                      | Decide disclosure UX for incentives/material connections.                  |
| Restaurant owners may pressure for removal or ranking control | TasteApp's trust promise depends on independent rankings.                                   | ADR says Claimed Restaurants cannot control rankings.                                      | Decide owner-response and factual-correction workflow later.               |
| Location data can become sensitive                            | Distance filtering and future precise location features may trigger privacy obligations.    | MVP is list-first and should distinguish search location from precise device location.     | Decide whether MVP asks for device location or only typed/search location. |
| Public SEO pages expose user content broadly                  | Reviews/photos shown publicly increase copyright, privacy, defamation, and moderation risk. | Public pages should show approved public content only.                                     | Decide publication thresholds and moderation state requirements.           |
| Policy acceptance must be provable                            | Terms/Privacy changes need version tracking for enforceability and support.                 | Add future `LegalAcceptance` and `LegalPolicyVersion` models.                              | Decide when acceptance tracking is implemented.                            |
| App stores may require additional terms/privacy disclosures   | Mobile distribution adds platform policy requirements.                                      | Keep legal docs versioned; final app store copy pending.                                   | Review Apple/Google requirements before mobile launch.                     |

## Open Questions

- What legal entity will operate TasteApp?
- What public legal, privacy, support, and DMCA email addresses should be used?
- Should Review Photos be blocked until DMCA agent registration and media moderation are ready?
- What content is public by default versus signed-in only?
- What is the first launch geography?
