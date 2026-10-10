# Vision — Rhythm Art Gallery

## One line
An interactive online home for a local boutique: sarees, suits, jewellery, handbags and purses, shown like gallery artwork and sold with a real checkout.

## Why
The shop's value is craft: embroidery, fabric, hand finishing. A flat catalogue hides that. The site should let a visitor *feel* the work, then buy it without friction.

## Who
- **Shoppers**: local and online customers browsing on phones, mostly Indian, paying by UPI/cards.
- **Shop owner**: non-technical, swaps product photos and updates stock without touching code.

## Experience
- **Look**: floral Indian embroidery, indigenous accents, vibrant but calm. Palette, fonts and background come from `~/.claude/global.md` inputs (Realtime Colors, Haikei SVG). Nothing else added.
- **Feel**: interactive landing page; motion only where it helps (reveal, hover, zoom), never decoration. Built with Motion Primitives.
- **Speed**: phone first, images optimised, no heavy scripts.

## Pages
1. **Home**: hero, shop by category, new arrivals strip, community teaser, shop story.
2. **Shop**: Jewellery · Clothing (Saris, Suits) · Handbags & Purses. Product detail with gallery.
3. **New Arrivals**: its own page, filtered by saris, suits, jewellery, purses, handbags.
4. **Community**: events the shop was selected for, where we have been, how we engage the community. Timeline plus photos.
5. **Cart, Checkout, My Orders**: Razorpay payment (test mode first).
6. **Login / Register / Account**: email + password, sign out.

## Principles
- Concept first: placeholder images from the internet, living in `public/images/`, replaced by the owner's photos with no code change.
- Small, boring, correct. One Next.js app, one Postgres, no extra services until needed.
- Money and auth are done carefully: server-side prices, verified payment signatures, ownership checks.
- Secrets never in git. DB changes only via migrations.

## Not in v1
GST invoices and credit notes, courier API, email notifications, reviews, wishlist, coupons, multi-language, mobile app. Revisit after the shop confirms GST status and order volume.

## Success
Owner can browse, change photos, and take a test payment end to end. Real launch needs: live Razorpay keys, real photos, real community content.

## Stack (locked; change only by asking)
Next.js + TypeScript + Tailwind · Prisma + PostgreSQL · Auth.js · Razorpay · Vercel + Neon + Cloudinary. Reasons in `docs/decisions.md`.
