# Айдентика «Пиксель & Байт»

Этот документ фиксирует визуальный язык бренда и правила генерации новых изображений и видео. Главная задача — сохранять узнаваемость кота-разработчика, премиальную пиксельную стилистику и технологичный характер во всех форматах.

## Эталонные ассеты

| Ассет | Файл | Размер | Назначение |
| --- | --- | --- | --- |
| Обложка сообщества | [`pixel-and-byte-vk-cover-1920x768.png`](./pixel-and-byte-vk-cover-1920x768.png) | 1920×768 | Главная обложка VK и широкий бренд-референс |
| Аватар сообщества | [`pixel-and-byte-vk-avatar-1024x1024.png`](./pixel-and-byte-vk-avatar-1024x1024.png) | 1024×1024 | Аватар, иконка и основной референс персонажа |

При генерации новых материалов используйте оба изображения как референсы. Аватар точнее фиксирует внешность кота, обложка — окружение, палитру и общий уровень детализации.

## Основа айдентики

«Пиксель & Байт» — дружелюбное сообщество о разработке VK Mini Apps. Образ должен одновременно передавать техническую компетентность, любопытство и игровую лёгкость.

Ключевые признаки:

- современный, аккуратный pixel art с намеренно квадратными пикселями;
- глубокий тёмно-синий цифровой фон;
- яркое голубое и циановое свечение;
- небольшие коралловые акценты;
- интерфейсные карточки, скобки кода, схемы и частицы используются как фон, а не как главный сюжет;
- чистая композиция, сильный силуэт и хорошая читаемость в маленьком размере;
- ощущение профессионального технологического бренда без корпоративной стерильности.

## Кот-разработчик

Кот — главный и постоянный персонаж бренда. Эти признаки нельзя менять между генерациями:

- голубовато-серая шерсть с тёмно-синими полосами;
- крупная белая область на мордочке и белая вертикальная отметина на лбу;
- большие ярко-голубые глаза с циановым бликом;
- розовая внутренняя часть ушей и маленький розовый нос;
- дружелюбная небольшая улыбка;
- королевско-синее худи с тёмной подкладкой;
- округлые пропорции головы и короткая аккуратная мордочка;
- тёплое, любопытное и уверенное выражение лица.

Кот не должен превращаться в человека, реалистичное животное, аниме-персонажа или пластиковую 3D-фигурку. Допустимы разные позы, эмоции и действия, но лицо, окраска, худи и пропорции остаются узнаваемыми.

## Палитра

| Роль | Цвет | HEX |
| --- | --- | --- |
| Основной фон | Midnight Navy | `#0B1020` |
| Вторичный фон | Deep Indigo | `#18224A` |
| Основной акцент | Electric Blue | `#2688EB` |
| Свечение | Cyan | `#54D7FF` |
| Светлая шерсть и текст | Soft White | `#F7F8F2` |
| Небольшой тёплый акцент | Coral | `#FF7189` |

Коралл используется точечно: внутри ушей, в отдельных пикселях и небольших индикаторах. Он не должен конкурировать с синим.

## Композиция и графика

- Главный объект должен читаться уже при ширине 48–64 px.
- Вокруг кота оставляется свободное пространство; фоновые элементы не пересекают глаза и контур мордочки.
- Для круглых аватаров все важные детали размещаются внутри центральных 78% холста.
- Для широких обложек важные элементы размещаются внутри центральных 70% по ширине и высоте.
- Пиксельная сетка должна быть визуально последовательной: без случайной смеси мелких и крупных пикселей.
- Свечение мягко подчёркивает силуэт, но не размывает пиксельные края.
- Текст используется только при необходимости. Основные написания: `Пиксель & Байт` и `Разработка VK Mini Apps`.
- Для надписей подходит жирный геометрический pixel-inspired sans serif с высокой контрастностью.

## Универсальный мастер-промпт для изображения

Подставьте задачу, формат и действие в квадратные скобки. К каждому запросу прикладывайте эталонный аватар и обложку.

```text
Use case: stylized-concept
Asset type: [social post / website hero / article illustration / app promo / thumbnail]
Primary request: Create [describe the scene and purpose] for the Russian developer community “Пиксель & Байт”.

Reference images:
- Reference 1 is the authoritative character reference for the Pixel & Byte cat developer.
- Reference 2 is the authoritative reference for the brand palette, pixel-art language, lighting, and digital environment.

Character invariants: Preserve the exact recognizable cat identity: blue-gray tabby fur, dark navy stripes, large white muzzle and vertical white forehead blaze, bright blue eyes with cyan highlights, pink inner ears, small pink nose, friendly compact smile, royal-blue developer hoodie with dark lining, rounded head proportions. Keep the character clearly feline and consistent across outputs.

Scene/backdrop: [describe the environment]. Use a deep navy-to-indigo digital world with sparse cyan pixel sparks, subtle circuit traces, code brackets, and abstract mini-app cards only when they support the story.
Action: [describe one clear action].
Style/medium: premium modern pixel art, intentional square pixels, crisp clean silhouette, polished 2D game-art finish, consistent pixel scale, refined electric-blue rim light.
Composition/framing: [aspect ratio and framing]. Keep the cat as the clear focal point. Preserve generous negative space and safe margins for the target placement.
Lighting/mood: clever, warm, inventive, welcoming, professional, with cool electric-blue and cyan light plus very restrained coral accents.
Color palette: #0B1020, #18224A, #2688EB, #54D7FF, #F7F8F2, small accents of #FF7189.
Text: [exact text in quotation marks, or “none”]. Render supplied text verbatim with no extra characters.
Constraints: Match the identity and rendering style of both references. Keep face markings, eye color, hoodie, proportions, pixel scale, and palette stable. Strong readability at thumbnail size.
Avoid: character redesign, changed fur pattern, changed clothing, human anatomy, photorealism, anime-human styling, glossy 3D plastic, painterly brushwork, fuzzy antialiased edges, excessive gradients, busy pseudo-code, unreadable text, exact third-party logos, watermark, clutter.
```

## Мастер-промпт для видео

Для видео в каждый шот повторно добавляйте блок `Character invariants`: видеомодели сильнее склонны менять лицо, полосы и одежду между кадрами.

```text
Create a [duration]-second pixel-art video for “Пиксель & Байт”, based on the supplied authoritative avatar and cover references.

Story: [one simple visual beat with a clear beginning and end].
Character invariants in every frame: the same blue-gray tabby cat developer with dark navy stripes, white muzzle and vertical white forehead blaze, bright blue eyes, pink inner ears and nose, friendly compact smile, royal-blue hoodie, rounded feline head proportions. Never change the face markings, colors, outfit, eye shape, or body proportions.

Visual style: premium modern pixel art with one consistent pixel grid, crisp silhouettes, deep navy and indigo background, electric-blue and cyan glow, tiny coral accents, polished 2D game-art lighting. No smooth vector look and no photorealism.

Motion: restrained readable animation — natural blinking, subtle ear movement, small tail motion, two or three clear typing gestures, gently floating app cards, sparse pixel particles. Use deliberate stepped pixel motion while keeping the final playback fluid. Preserve character identity and pixel geometry frame to frame.

Camera: [locked medium shot / slow controlled push-in / gentle horizontal pan]. No handheld shake, fast zoom, sudden reframing, or perspective warping.
Composition: [16:9 / 9:16 / 1:1]. Keep the cat as the focal point and reserve safe negative space for [captions / logo / UI].
Loop: [seamless loop required / no loop]. If looping, end with the same pose, lighting, and particle placement as the opening frame.

Avoid: flicker, temporal noise, face morphing, changing stripes, changing hoodie, extra limbs, unstable paws, warped laptop, random symbols, unreadable pseudo-text, excessive particles, motion blur, depth-of-field blur, realistic fur, anime-human features, plastic 3D rendering, watermark.
```

## Рекомендуемые движения и сюжеты

- кот печатает код, после чего появляется аккуратная карточка мини-приложения;
- кот нажимает кнопку запуска, и вокруг загорается цифровая схема;
- короткий цикл: моргание, движение ушей, мерцание кода и лёгкое движение хвоста;
- кот собирает интерфейс из нескольких пиксельных карточек;
- кот рассматривает баг, исправляет одну строку, индикатор меняется с кораллового на голубой;
- вертикальный ролик: кот появляется из облака пикселей, приветствует зрителя и показывает карточку приложения.

Лучше один ясный сюжет на ролик, чем несколько быстрых сцен. Для бесшовных петель предпочтительна длительность 4–8 секунд.

## Negative prompt

Этот блок можно добавлять в конец любого запроса:

```text
Avoid character redesign, inconsistent face markings, different fur colors, different eye colors, different clothing, human body or hands, photorealistic fur, anime-human styling, glossy 3D plastic, clay render, vector-flat look, painterly textures, fuzzy edges, mixed pixel scales, excessive gradients, illegible pseudo-code, random text, third-party logos, extra characters, extra limbs, warped paws, cropped ears, clutter, watermark. For video also avoid flicker, temporal noise, morphing, unstable proportions, camera shake, motion blur, and frame-to-frame color shifts.
```

## Чек-лист перед публикацией

- Кот узнаётся по мордочке, белой отметине, полосам, глазам и синему худи.
- Основной фон тёмно-синий; голубой и циановый доминируют над другими акцентами.
- Пиксели имеют последовательный масштаб и чёткие границы.
- Главный силуэт читается в миниатюре.
- В круглой или вертикальной обрезке не теряются уши, глаза и ключевое действие.
- Текст, если он есть, написан без ошибок и не имитирует случайный интерфейс.
- Нет чужих логотипов, водяных знаков и лишних персонажей.
- В видео не меняются лицо, полосы, цвет глаз, худи и пропорции между кадрами.

## Именование файлов

Используйте латиницу, kebab-case и явный формат:

```text
pixel-and-byte-<purpose>-<ratio-or-size>-v<version>.<ext>
```

Примеры:

```text
pixel-and-byte-vk-cover-1920x768-v2.png
pixel-and-byte-blog-mini-app-security-16x9-v1.webp
pixel-and-byte-reel-debugging-9x16-v1.mp4
```
