"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding RusTili AI database...');
    const locationsData = [
        { name: 'Airport (Aeroport)', description: 'Rossiyaga kelish va pasport nazorati suhbati', order: 1, level: client_1.Level.A0, unlocked: true },
        { name: 'Taxi (Taksi)', description: 'Aeroportdan shahar markaziga borish va manzilni aytish', order: 2, level: client_1.Level.A0, unlocked: true },
        { name: 'Hotel (Mehmonxona)', description: 'Mehmonxonaga joylashish va xona bron qilish', order: 3, level: client_1.Level.A1, unlocked: false },
        { name: 'Restaurant (Restoran)', description: 'Oziq-ovqat buyurtma qilish va hisobni so\'rash', order: 4, level: client_1.Level.A1, unlocked: false },
        { name: 'University (Universitet)', description: 'O\'qishga topshirish va talabalik hayoti', order: 5, level: client_1.Level.A2, unlocked: false },
        { name: 'Work (Ish)', description: 'Ish suhbati va kasbiy muloqot', order: 6, level: client_1.Level.B1, unlocked: false },
        { name: 'Travel (Sayohat)', description: 'Rossiya bo\'ylab sarguzashtlar va madaniy sayohat', order: 7, level: client_1.Level.B2, unlocked: false },
    ];
    for (const loc of locationsData) {
        await prisma.storyLocation.upsert({
            where: { id: `loc-${loc.order}` },
            update: loc,
            create: { id: `loc-${loc.order}`, ...loc },
        });
    }
    const lessonsData = [
        {
            id: 'lesson-a0-1',
            title: '1-dars: Salomlashish va Tanishuv (Приветствие)',
            description: 'Rus tilida salomlashish, ismni so\'rash va tanishishni o\'rganamiz.',
            level: client_1.Level.A0,
            order: 1,
            topics: ['Привет', 'Здравствуйте', 'Меня зовут', 'Как тебя зовут?'],
            dialogs: [
                { speaker: 'Анна', russian: 'Привет! Меня зовут Анна.', uzbek: 'Salom! Mening ismim Anna.' },
                { speaker: 'Вы', russian: 'Здравствуйте! Меня зовут...', uzbek: 'Assalomu alaykum! Mening ismim...' },
                { speaker: 'Анна', russian: 'Очень приятно познакомиться!', uzbek: 'Tanishganimdan juda xursandman!' },
            ],
        },
        {
            id: 'lesson-a0-2',
            title: '2-dars: Alifbo va Talaffuz (Алфавит)',
            description: 'Rus alifbosi, unli va undosh harflarning to\'g\'ri talaffuzi.',
            level: client_1.Level.A0,
            order: 2,
            topics: ['Алфавит', 'Буквы', 'Звуки'],
            dialogs: [
                { speaker: 'Диктор', russian: 'А — Арбуз, Б — Банан, В — Вода.', uzbek: 'A — Tarvuz, B — Banan, V — Suv.' },
                { speaker: 'Учитель', russian: 'Повторяй за мной каждое слово!', uzbek: 'Har bir so\'zni ortimdan qaytar!' },
            ],
        },
        {
            id: 'lesson-a0-3',
            title: '3-dars: Sonlar va Narxlar (Числа 1-20)',
            description: '1 dan 20 gacha sonlar va do\'konda narx so\'rash.',
            level: client_1.Level.A0,
            order: 3,
            topics: ['Один', 'Два', 'Три', 'Сколько стоит?'],
            dialogs: [
                { speaker: 'Продавец', russian: 'Здравствуйте! Чем я могу помочь?', uzbek: 'Salom! Sizga qanday yordam bera olaman?' },
                { speaker: 'Покупатель', russian: 'Сколько стоит эта вода?', uzbek: 'Bu suv qancha turadi?' },
                { speaker: 'Продавец', russian: 'Пятьдесят рублей.', uzbek: 'Ellik rubl.' },
            ],
        },
        {
            id: 'lesson-a0-4',
            title: '4-dars: Oila a\'zolari (Семья)',
            description: 'Oila a\'zolarining ruscha nomlanishi va sodda gaplar.',
            level: client_1.Level.A0,
            order: 4,
            topics: ['Мама', 'Папа', 'Брат', 'Сестра'],
            dialogs: [
                { speaker: 'Друг', russian: 'Это твоя семья?', uzbek: 'Bu seni oilangmi?' },
                { speaker: 'Вы', russian: 'Да, это моя мама и мой папа.', uzbek: 'Ha, bu mening oyim va mening dadam.' },
            ],
        },
        {
            id: 'lesson-a0-5',
            title: '5-dars: Aeroportda pasport nazorati (Аэропорт)',
            description: 'Rossiyaga kelganda chegaradagi sodda suhbat.',
            level: client_1.Level.A0,
            order: 5,
            topics: ['Паспорт', 'Виза', 'Цель визита', 'Учеба'],
            dialogs: [
                { speaker: 'Офицер', russian: 'Ваш паспорт, пожалуйста.', uzbek: 'Pasportingizni bering, iltimos.' },
                { speaker: 'Вы', russian: 'Вот мой паспорт. Я приехал учиться.', uzbek: 'Mana mening pasportim. Men o\'qishga keldim.' },
                { speaker: 'Офицер', russian: 'Добро пожаловать в Россию!', uzbek: 'Rossiyaga xush kelibsiz!' },
            ],
        },
        {
            id: 'lesson-a1-1',
            title: '6-dars: Taksi chaqirish va yo\'l (Такси)',
            description: 'Taksiga manzilni tushuntirish va to\'lov qilish.',
            level: client_1.Level.A1,
            order: 6,
            topics: ['Адрес', 'Куда едем?', 'Направо', 'Налево'],
            dialogs: [
                { speaker: 'Водитель', russian: 'Куда вам нужно ехать?', uzbek: 'Qayerga borishingiz kerak?' },
                { speaker: 'Вы', russian: 'В центр города, пожалуйста. На улицу Тверская.', uzbek: 'Shahar markaziga, iltimos. Tverskaya ko\'chasiga.' },
            ],
        },
        {
            id: 'lesson-a1-2',
            title: '7-dars: Restoranda ovqat buyurtma qilish (Ресторан)',
            description: 'Menyu so\'rash, taom tanlash va hisob-kitob.',
            level: client_1.Level.A1,
            order: 7,
            topics: ['Меню', 'Чай', 'Суп', 'Счет'],
            dialogs: [
                { speaker: 'Официант', russian: 'Что будете заказать?', uzbek: 'Nima buyurtma qilasiz?' },
                { speaker: 'Вы', russian: 'Принесите, пожалуйста, борщ и чёрный чай.', uzbek: 'Iltimos, borsh va qora choy keltiring.' },
            ],
        },
    ];
    for (const l of lessonsData) {
        await prisma.lesson.upsert({
            where: { id: l.id },
            update: l,
            create: l,
        });
    }
    const vocabData = [
        { russian: 'Привет', uzbek: 'Salom', pronunciation: 'Privet', category: 'Salomlashish' },
        { russian: 'Здравствуйте', uzbek: 'Assalomu alaykum / Salom', pronunciation: 'Zdravstvuyte', category: 'Salomlashish' },
        { russian: 'Спасибо', uzbek: 'Rahmat', pronunciation: 'Spasibo', category: 'Muomala' },
        { russian: 'Пожалуйста', uzbek: 'Iltimos / Arzimaydi', pronunciation: 'Pojaluysta', category: 'Muomala' },
        { russian: 'Как дела?', uzbek: 'Ishlar qanday?', pronunciation: 'Kak dela?', category: 'Suhbat' },
        { russian: 'Хорошо', uzbek: 'Yaxshi', pronunciation: 'Khorosho', category: 'Suhbat' },
        { russian: 'Вода', uzbek: 'Suv', pronunciation: 'Voda', category: 'Oziq-ovqat' },
        { russian: 'Хлеб', uzbek: 'Non', pronunciation: 'Khleb', category: 'Oziq-ovqat' },
        { russian: 'Семья', uzbek: 'Oila', pronunciation: 'Semya', category: 'Oila' },
        { russian: 'Друг', uzbek: 'Do\'st', pronunciation: 'Drug', category: 'Insonlar' },
    ];
    for (const v of vocabData) {
        const existing = await prisma.vocabulary.findFirst({ where: { russian: v.russian } });
        if (!existing) {
            await prisma.vocabulary.create({ data: v });
        }
    }
    console.log('Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map