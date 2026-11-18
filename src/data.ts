// Everything that comes from Aharon lives here, so changes happen in one place.
// Marked "assumed" = written by us, needs his OK.

export const contact = {
  name: 'אהרן כהן',
  tagline: 'שמאות מקרקעין וייעוץ נדל"ן',
  phoneDisplay: '052-8236186',
  phoneHref: 'tel:+972528236186',
  // assumed: WhatsApp on the same number
  whatsappHref:
    'https://wa.me/972528236186?text=' +
    encodeURIComponent('היי אהרן, הגעתי מהאתר ואשמח לשמוע על שומה לנכס'),
  email: 'a0528236186@gmail.com',
  address: 'בית הבחירה 24, אפרת',
  hours: '08:00-19:00',
  since: 2015,
}

export const nav = [
  { label: 'אודות', href: '#about' },
  { label: 'שירותים', href: '#services' },
  { label: 'איך זה עובד', href: '#process' },
  { label: 'המלצות', href: '#reviews' },
  { label: 'צור קשר', href: '#contact' },
]

export type ServiceIcon = 'consult' | 'appraisal' | 'opinion'

export const services: {
  icon: ServiceIcon
  title: string
  intro: string
  items: { name: string; hint?: string }[]
}[] = [
  {
    icon: 'appraisal',
    title: 'עריכת שומות מקרקעין',
    intro: 'הערכת שווי מדויקת לנכס, לבנק, לחברה או לפני שחותמים על עסקה.',
    items: [
      { name: 'שומה לבנק למשכנתא ולבטוחה לאשראי', hint: 'לפי תקן 19' },
      { name: 'שווי שוק לפני רכישה', hint: 'לדעת מה המחיר הנכון לפני שחותמים' },
      { name: 'אומדן דמי שכירות ראויים' },
      { name: 'הערכות שווי לחברות פרטיות וציבוריות' },
    ],
  },
  {
    icon: 'consult',
    title: 'ייעוץ נדל"ן',
    intro: 'בדיקה כלכלית לפני שקונים, מוכרים או יוצאים לפרויקט.',
    items: [
      { name: 'בדיקת כדאיות לרכישה או למימוש נכסים' },
      { name: 'דוחות אפס לפרויקטים', hint: 'האם הפרויקט רווחי, במספרים' },
      { name: 'תקן 21 לפרויקטים של פינוי בינוי', hint: 'בדיקת הכדאיות לפי התקן' },
    ],
  },
  {
    icon: 'opinion',
    title: 'חוות דעת למטרות שונות',
    intro: 'חוות דעת מקצועית שעומדת מול רשויות, בתי משפט וגורמי מס.',
    items: [
      { name: 'מיסוי מקרקעין', hint: 'לעניין מס שבח' },
      { name: 'הוצאה לפועל וכינוס נכסים' },
      { name: 'פירוק שיתוף במקרקעין' },
      { name: 'שומות והשגות על דרישות רמ"י', hint: 'לתשלום דמי היתר' },
    ],
  },
]

// assumed: the four steps, built from what clients wrote about him
export const steps = [
  {
    title: 'שיחה קצרה',
    text: 'מספרים לי על הנכס ועל המטרה. אני אומר מה צריך, כמה זה עולה ומתי זה יהיה מוכן.',
  },
  {
    title: 'ביקור בנכס',
    text: 'מגיע לנכס, בודק אותו מקרוב ומתעד את כל מה שישפיע על השווי.',
  },
  {
    title: 'בדיקות וסקר שוק',
    text: 'אוסף מסמכים מהעירייה, מעורך הדין ומהמתווך, ומשווה לעסקאות אמיתיות בסביבה. מעדכן אתכם לאורך הדרך.',
  },
  {
    title: 'חוות הדעת אצלכם',
    text: 'דוח מסודר לפי התקינה השמאית, עם שווי ריאלי ונימוק ברור לכל מספר.',
  },
]

// Real quotes from the current site. Shown with the service only, no names.
export const reviews = [
  {
    quote:
      'מהיר, דאג לעדכן על כל הצלחה או כישלון של השגת מסמכים והיה מאוד אמין. פנה לעו"ד, למתווך ולעירייה לטובת מציאת מסמכים ואימותם, ועשה סקר שוק מעמיק כדי לתת השוואת מחירים אמיתית בשכונה שלנו.',
    service: 'הערכת שווי לפני רכישה',
  },
  {
    quote: 'זריז מאוד, הוגן, שזה לא מובן מאליו אצל שמאי מקרקעין. כיף לעבוד איתו והוא אחד הטובים!',
    service: 'הערכת שווי נכס',
  },
  {
    quote: 'נהדר, מעמיק, אכפתי מאוד, נתן שווי ריאלי. המוסר עבודה שלו גבוה מאוד.',
    service: 'הערכת שווי לדירת מגורים',
  },
  {
    quote: 'זריז ומקצועי, אני ממש ממליץ עליו!',
    service: 'לקוח של המשרד',
  },
  {
    quote: 'שמאי טוב ממש, זמין ויעיל.',
    service: 'לקוחה של המשרד',
  },
]
