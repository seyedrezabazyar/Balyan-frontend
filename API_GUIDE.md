# راهنمای استفاده از API کتاب‌ها (Books API)

## مقدمه
این راهنما به برنامه‌نویس فرانت‌اند کمک می‌کند تا با API کتاب‌ها کار کرده و لیست کتاب‌ها را به درستی نمایش دهد.

**نکته بسیار مهم:** API در حال حاضر به درستی کار می‌کند و پاسخ موفقیت‌آمیز (200 OK) برمی‌گرداند. اما همانطور که در خروجی curl دیده شد، هیچ کتابی را برنمی‌گرداند (`"data": []`). این به این دلیل است که در دیتابیس، هیچ کتابی با شرایط `status = 'published'` و `is_master = true` وجود ندارد. مشکل در فرانت‌اند یا بک‌اند نیست، بلکه در نبود اطلاعات مناسب در دیتابیس است. برای نمایش داده‌ها، ابتدا باید محتوای مناسب در دیتابیس ثبت شود.

---

## ۱. دریافت لیست کتاب‌ها (List Books)
این اندپوینت برای دریافت لیست تمام کتاب‌های اصلی (master books) که قابل نمایش هستند، استفاده می‌شود.

- **URL:** `/api/v1/books`
- **Method:** `GET`

### پارامترهای کوئری (Query Parameters):

| پارامتر | توضیحات | مثال |
|---|---|---|
| `page` | (اختیاری) شماره صفحه برای صفحه‌بندی. | `?page=2` |
| `per_page` | (اختیاری) تعداد آیتم در هر صفحه. پیش‌فرض: 24. | `?per_page=10` |
| `sort` | (اختیاری) نحوه مرتب‌سازی نتایج. مقادیر مجاز: `newest` (پیش‌فرض), `oldest`, `popular`, `price_low`, `price_high`. | `?sort=popular` |
| `category` | (اختیاری) فیلتر بر اساس شناسه (ID) دسته‌بندی. | `?category=5` |
| `language` | (اختیاری) فیلتر بر اساس زبان. مقادیر مجاز: `fa`, `en`, `ar`. | `?language=fa` |

### مثال درخواست:
```
GET /api/v1/books?per_page=10&sort=newest
```

### پاسخ موفق (در صورتی که کتابی وجود داشته باشد):
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "عنوان کتاب نمونه",
            "slug": "sample-book-title",
            "excerpt": "خلاصه‌ای از کتاب...",
            "price": "150.00",
            "sale_price": "120.00",
            "authors": [
                { "name": "نام نویسنده" }
            ],
            "image": { "url": "http://.../image.jpg" }
        }
    ],
    "meta": {
        "total": 1,
        "per_page": 10,
        "current_page": 1,
        "last_page": 1
    }
}
```

### پاسخ موفق (زمانی که کتابی یافت نشود - وضعیت فعلی):
```json
{
    "success": true,
    "data": [],
    "meta": {
        "total": 0,
        "per_page": 10,
        "current_page": 1,
        "last_page": 1
    }
}
```

---

## ۲. دریافت جزئیات یک کتاب (Get Book Details)
این اندپوینت برای دریافت اطلاعات کامل یک کتاب خاص بر اساس `slug` آن است.

- **URL:** `/api/v1/books/{slug}`
- **Method:** `GET`

### پارامتر مسیر (Path Parameter):
- `{slug}` (اجباری): `slug` یونیک کتاب.

### مثال درخواست:
```
GET /api/v1/books/sample-book-title
```

### پاسخ موفق:
```json
{
    "success": true,
    "data": {
        "book": {
            "id": 1,
            "title": "عنوان کتاب نمونه",
            "slug": "sample-book-title"
        },
        "user_purchase_status": null,
        "related": []
    }
}
```

---

## ۳. جستجوی کتاب‌ها (Search Books)
این اندپوینت برای جستجو در میان کتاب‌ها استفاده می‌شود.

- **URL:** `/api/v1/books/search`
- **Method:** `GET`

### پارامترهای کوئری (Query Parameters):
- `q` (اجباری): عبارت مورد جستجو. حداقل ۲ کاراکتر.
- `page`, `per_page` (اختیاری): برای صفحه‌بندی.

### مثال درخواست:
```
GET /api/v1/books/search?q=laravel
```

### پاسخ موفق:
```json
{
    "success": true,
    "data": {
        "books": [],
        "query": "laravel",
        "total": 0
    }
}
```
