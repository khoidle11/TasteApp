# TasteApp Legal Policy Scaffolds

These files are product and engineering scaffolds for TasteApp's legal surfaces. They are not legal advice and are not launch-ready legal terms. Before public launch, qualified counsel should review and replace or approve the final public policies.

## Source Of Truth

The durable source files for legal policy drafts live in `docs/legal/`. Product surfaces such as web legal pages, onboarding acceptance screens, upload flows, report flows, and account settings should render from approved policy versions or link back to approved published copies.

## Policy Files

- `terms-of-service.md`: user account, content license, platform rules, and product disclaimers.
- `privacy-policy.md`: personal data, location data, uploaded content metadata, analytics, and deletion/export notes.
- `content-policy.md`: allowed and prohibited user-generated content.
- `dmca-policy.md`: copyright takedown, counter-notice, designated agent, and repeat-infringer scaffold.
- `review-integrity-policy.md`: dish-first review rules, anti-manipulation rules, restaurant-owner limits, and moderation posture.
- `legal-risk-register.md`: open legal/product risks that need owner decisions or counsel review.

## Launch Blockers

- Choose the legal entity that operates TasteApp.
- Choose public legal contact emails, including a DMCA notice address.
- Register a DMCA designated agent with the U.S. Copyright Office before relying on DMCA safe harbor for user-uploaded content.
- Add product acceptance tracking for Terms of Service and Privacy Policy versions.
- Have counsel review the public Terms of Service, Privacy Policy, DMCA Policy, Content Policy, and Review Integrity Policy.

## Product Data Implications

Future implementation should store policy acceptance and content moderation state explicitly:

- `LegalPolicyVersion`: policy name, version, effective date, published URL, approval state.
- `LegalAcceptance`: TasteApp User, accepted policy versions, accepted timestamp, source surface.
- `UserGeneratedContent`: content owner, source type, license version, moderation state, takedown state.
- `CopyrightNotice`: notice data, target content, received timestamp, action timestamp, counter-notice state.

Keep private legal workflow details out of normal user-facing copy. Users should see clear rules, contact methods, and status outcomes without seeing internal legal analysis.
