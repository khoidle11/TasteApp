# Use S3 signed uploads for Review Photos

TasteApp will defer Review Photos until Phase 2, then upload images directly to S3 using signed upload URLs while storing image metadata in PostgreSQL. The API should not proxy full image uploads unless a later requirement justifies it, and photos should pass moderation before public display.
