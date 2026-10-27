# Lingo

פלטפורמה ללימוד אנגלית לפי חוברת האפיון: מסלול אישי, ספרייה, מורה AI, משחקים ומעקב התקדמות.

## הרצה מקומית

```bash
npm install
npm run dev
```

פתחו [http://localhost:3000](http://localhost:3000).

### חשבונות הדגמה

סיסמה לכל החשבונות: `demo123`

| תפקיד | דוא״ל |
| --- | --- |
| לומדת | learner@lingo.app |
| מנהלת תוכן | content@lingo.app |
| מנהלת מערכת | admin@lingo.app |

ההדגמה שומרת מצב ב-`.data/demo-store.json`. הרשאות נבדקות בשרת. מפתחות AI לא נחשפים ללקוח.

## חיבור בהמשך

- סכימת Supabase עם RLS: `supabase/migrations/0001_init.sql`
- משתני סביבה: `.env.example`
- מורה AI: אם מוגדר `OPENAI_API_KEY` נעשה שימוש במודל; אחרת פועל גיבוי מקומי
