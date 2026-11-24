# دليل ربط الموقع بلوحة تحكم Firebase

لوحة التحكم موجودة على الرابط: `#/admin` (مثال: `https://your-site.web.app/#/admin`)

## 1) إنشاء مشروع Firebase

1. افتح [console.firebase.google.com](https://console.firebase.google.com) وسجّل دخولك.
2. اضغط **Add project** → سمِّه (مثلاً `my-portfolio`) → يمكنك تعطيل Google Analytics.
3. من صفحة المشروع فعّل الخدمات التالية:
   - **Authentication** → Sign-in method → فعّل **Email/Password**
   - **Firestore Database** → Create database → ابدأ بوضع **Production mode** (القواعد مرفقة في `firestore.rules`)
   - **Storage** → Get started (نفس منطقة Firestore)

## 2) إنشاء حساب الأدمن

1. من **Authentication → Users → Add user** أنشئ إيميل وكلمة مرور — هذا حسابك للدخول للوحة.

## 3) ربط التطبيق بالإعدادات

1. في إعدادات المشروع → **Your apps → Web (`</>`)** → سجّل التطبيق.
2. انسخ قيم `firebaseConfig` إلى ملف `.env` في جذر المشروع:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. أعد تشغيل `npm run dev` أو أعد بناء المشروع.

## 4) رفع قواعد الأمان (مهم!)

```bash
npm install -g firebase-tools
firebase login
firebase init   # اختر Firestore + Storage + Hosting إذا أردت استضافة الموقع
firebase deploy --only firestore:rules,storage
```

أو الصق محتوى `firestore.rules` و `storage.rules` يدوياً من:
- Firestore Database → Rules
- Storage → Rules

**ملاحظة:** بدون هذه القواعد لن تستطيع الحفظ من اللوحة (الكتابة تتطلب تسجيل دخول).

## 5) أول تشغيل للوحة

1. ادخل على `#/admin` وسجّل دخولك.
2. من تبويب **نظرة عامة** اضغط **"استيراد المحتوى الحالي إلى Firebase"**
   — هذا ينسخ المشاريع والمهارات والبطاقات والإعدادات الحالية إلى Firestore
   لتبدأ التعديل عليها من اللوحة.

## ما تتحكم فيه اللوحة

| القسم | التحكم |
|---|---|
| المشاريع | إضافة / تعديل / حذف / إعادة ترتيب + صورة لكل مشروع |
| بطاقات المهارات | إضافة / تعديل / حذف / إعادة ترتيب + المهارات والأيقونات |
| بطاقات "من أنا" | نفس التحكم |
| إعدادات الموقع | الاسم، الصورة، الإيميل، واتساب، GitHub، نصوص Hero و About والفوتر |
| رسائل الزوار | عرض رسائل نموذج التواصل وحذفها |

## استضافة الموقع على Firebase Hosting (اختياري)

```bash
npm run build
firebase deploy --only hosting
```

ملف `firebase.json` موجود مسبقاً ويضبط إعادة التوجيه لصفحة واحدة.
