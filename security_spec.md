# Short Study Security Specification (Firestore Rules TDD)

## 1. Data Invariants

1. **Default Deny**: Every unmatched path is denied (`read, write: if false`).
2. **Admin Verification**: Administrative actions require `request.auth != null`, `request.auth.token.email_verified == true`, and either membership in `/admins/{request.auth.uid}` or the bootstrapped owner email (`gauravfartiyal751@gmail.com`) with verified email claim.
3. **Publication Gate**: Public visitors (`get` and `list`) on `coding_notes` and `affiliate_products` can ONLY read documents where `resource.data.isPublished == true`. Unpublished drafts are strictly readable only by admins.
4. **Media Library Isolation**: `media_files` and `admins` are readable and writable only by admins.
5. **Public Website Settings**: `website_settings/global` is publicly readable (`get` only) for site metadata, and writable only by verified admins.
6. **Strict Schema & Size Bounds**: Every create and update passes `isValid[Entity](incoming())` checking required keys, `hasOnly(...)` allowed keys (blocking shadow fields), string lengths, bounded arrays, immutable `createdAt`/`authorUid`, and `request.time` timestamp integrity.
7. **ID Hardening**: Document IDs on single-document operations must satisfy `^[a-zA-Z0-9_-]+$` and length `<= 128`.

## 2. Dirty Dozen Attack Payloads

1. Unauthenticated `create` on `/coding_notes/note1` -> PERMISSION_DENIED.
2. Signed-in non-admin user attempting `create` on `/coding_notes/note1` -> PERMISSION_DENIED.
3. Unverified email claiming bootstrapped admin email (`email_verified: false`) -> PERMISSION_DENIED.
4. Non-admin `create` on `/admins/{uid}` attempting self-promotion -> PERMISSION_DENIED.
5. Public `get` on unpublished `/coding_notes/draft1` (`isPublished: false`) -> PERMISSION_DENIED.
6. Public `list` on `/coding_notes` without `where('isPublished', '==', true)` -> PERMISSION_DENIED.
7. Admin `create` on `/coding_notes/note1` with extra ghost field `isVerified: true` -> PERMISSION_DENIED.
8. Admin `create` on `/coding_notes/bad..id` with path-traversal ID -> PERMISSION_DENIED.
9. Admin `update` on `/coding_notes/note1` mutating `createdAt` or `authorUid` -> PERMISSION_DENIED.
10. Admin `create` on `/affiliate_products/prod1` with `javascript:alert(1)` in `affiliateUrl` -> PERMISSION_DENIED.
11. Admin `create` on `/affiliate_products/prod1` with > 12 `features` items -> PERMISSION_DENIED.
12. Public `list` or `get` on `/media_files/file1` -> PERMISSION_DENIED.
