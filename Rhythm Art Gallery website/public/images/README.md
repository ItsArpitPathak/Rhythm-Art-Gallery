# Images

All photos here are **placeholders** from Unsplash (free licence, https://unsplash.com/license). Replace them with the shop's own photos.

## How to replace
Overwrite a file with a new JPG **using the same file name**. No code change needed. Portrait (3:4) works best for products.

```
products/<category>/<product-slug>-1.jpg      categories: saris, suits, jewellery, handbags, purses
community/<name>-1.jpg
story/<name>-1.jpg
```

To add or rename a product, edit `src/data/catalog.ts` (until the database arrives in stage 4). A test (`npm test`) fails if a listed product has no image file.

## Placeholder sources (Unsplash photo ids)
| File | Unsplash id |
|---|---|
| saris/sage-silk-kanjivaram-saree | njVir8eVq1M |
| saris/copper-banarasi-saree | Rm9DL9DmGi4 |
| saris/rose-zari-saree | Xqa_NWl4xEY |
| saris/violet-kanchipuram-saree | wcgCFUi_Zws |
| saris/plum-zari-border-saree | xTrp1WOq2Do |
| saris/parrot-green-wedding-saree | y9HsMX3-mUY |
| suits/rani-pink-sharara-suit | 0yE-yINoEs8 |
| suits/mist-green-chikankari-sharara | 5qtCXA8oNLU |
| suits/scarlet-embroidered-kurta-set | c07j-zSHezM |
| suits/royal-blue-silk-suit | wFN_Jh0DLR4 |
| suits/garden-green-printed-suit | nDmMJM_DOUs |
| suits/marigold-yoke-kurta-dress | e_Ha_TxDlG0 |
| jewellery/ruby-drop-earrings | KA_Inf531b8 |
| jewellery/kundan-bridal-necklace-set | KxHcyNOIO_M |
| jewellery/gold-maang-tikka-choker-set | VPwSJhu5uhs |
| jewellery/temple-gold-haar | T-PUQaJ8YEw |
| jewellery/bridal-gold-choker-set | zW7hVlt6Oa0 |
| handbags/chestnut-woven-tote | tcVH_BwHtrc |
| handbags/marigold-wicker-top-handle-bag | ZT16YkAYueo |
| handbags/scarlet-structured-handbag | oCXVxwTFwqE |
| handbags/ivory-classic-handbag | iUvQRvdIhsY |
| handbags/tan-crossbody-saddle-bag | xzrJCS4grC4 |
| handbags/slate-satchel | J4DnKxz_3sA |
| purses/silver-quilted-clutch | gpipTmDphMQ |
| purses/rosewood-croc-clutch | zzPxImvRO_0 |
| purses/pink-studded-clutch | gw70gEsJjlk |
| story/embroidery-hoop | 9hiP-L6fI0A |
| story/red-embroidered-fabric | gl-KSnRyhE0 |
| story/embroidered-lehenga | j2EbfidUkLY |
| community/artisan-portrait | xo66i3WfS0A |
| community/craft-market | YZmisinA56A |
| community/basket-stalls | OPuz1xe-kaI |

View any photo at `https://unsplash.com/photos/<id>`. Product names are invented; the photos only approximate them.
