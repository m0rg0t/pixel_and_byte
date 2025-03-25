---
title: 'VK Mini Apps - Проверка подписи на Node.js'
description: 'Реализация проверки подписи в VK Mini Apps с использованием Node.js и Astro.'
pubDate: 2023-07-01
image: '/blog/first-post.jpg'
tags: ['miniapps', 'vk mini apps', 'learning in public']
---

# VK Mini Apps - Проверка подписи на Node.js

## Введение

Итак, я думаю если вы реализовывали backend для своего мини-приложения (а если не реализовывали, то сейчас узнаете) то вы в курсе, что нам как-то надо подтвердить «подлинность» данных, которые пришли с фронтовой части приложения.

А как мы знаем, фронту верить нельзя - мало ли что там пользователь творит, а может вообще какой-нибудь энтузиаст балуется.

Поэтому, для случая VK Mini Apps и vkBridge был предусмотрен механизм подписи запроса и её проверки на серверной стороне.

Сразу добавлю дисклеймер чтобы напомнить - даже с проверкой подписи человек все равно может в ваше мини-приложение заинжектить код в браузере или просто подменять данные на момент создания подписи.

## Проверка подписи и чего мне не хватило

Итак, у нас есть документация про проверку подписи - Мини-приложения | Разработка | Проверка подлинности данных

Как мы видим, все понятно и доступно написано, как мы параметры на фронте получаем через метод VKWebAppCreateHash

И даже есть пример кода на сервере, конечно же написанном на PHP.

Хм, но вот мне захотелось написать бэк на nodeJS, поэтому надо бы реализовать все эти дела на ней.

Погнали реализовывать
Итак, не буду томить и мучать, но взял я и написал метод проверки подписи

```javascript
import crypto from 'node:crypto'; 

export interface SignatureParams { [key: string]: string | number | boolean; } 

export interface GenerateSignatureOptions { 
  secretKey: string; 
  app_id: string | number; //Сразу извинюсь для чувствительных за сумбур с типами, изначально тут был чистый js, поэтому всю эту историю еще подчистим)
  params: SignatureParams; 
  user_id: string | number; //
  ts: string | number; //
} 

export interface CheckRequestSignatureOptions extends GenerateSignatureOptions { 
signature: string; 
} 

export const sortParams = (params: SignatureParams): string => {
  return Buffer.from(
    Object.entries(params)
      .sort(([key1], [key2]) => key1.localeCompare(key2))
      .map(([key, value]) => `${key}_${encodeURIComponent(String(value))}`)
      .join(";")
  ).toString('base64')
  .replace(/=/g, "");
};

export const generateSignature = ({
  secretKey,
  app_id,
  params,
  user_id,
  ts,
}: GenerateSignatureOptions): string => {
  const newParams = { ...params };
  const request_id = sortParams(newParams);
  const innerParams = `app_id=${app_id}&request_id=${request_id}&ts=${ts}&user_id=${user_id}`;

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(innerParams);
  const signature = hmac.digest('base64');

  return signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const checkRequestSignature = ({
  signature,
  secretKey,
  app_id,
  params,
  user_id,
  ts,
}: CheckRequestSignatureOptions): boolean => {
  const generatedSignature = generateSignature({
    secretKey,
    app_id,
    params,
    user_id,
    ts,
  });

  return signature === generatedSignature;
};

export default checkRequestSignature; 
```

То есть все как просили - получили параметры, собрали в строку, посчитали подпись и если все совпало, мы молодцы и нам не подсунули не пойми что.

Ну и конечно для фронта все также как в примере, с парой мелочей для того, чтобы данные для отправки сортировать

```javascript
import bridge from "@vkontakte/vk-bridge";

type TParamsForHashing = Record<string, string>;

const sortParams = (params: TParamsForHashing) => {
    return btoa(
      Object.entries(params)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .map(([key, value]) => `${key}_${encodeURIComponent(value)}`)
        .join(";")
    ).replaceAll("=", "");
  };
  
  /**
   * Get hash from VK Bridge for secure API calls
   * @param {Object} params - Parameters to include in the hash
   * @returns {Promise<{sign: string, ts: number}>} Signature and timestamp
   */
  export const getHashForParamsFromVK = async (params: TParamsForHashing) => {
    const paramsString = sortParams(params);
    const outSignature = {
      sign: "",
      ts: 0,
    };
    
    try {
      const data = await bridge.send("VKWebAppCreateHash", {
        payload: paramsString,
      });
      outSignature.sign = data.sign;
      outSignature.ts = data.ts;
    } catch (error) {
      console.error("Error getting hash:", error);
      throw error;
    }
    
    return outSignature;
  };
```

Сразу извинюсь за то что не подсветки кода - почему-то редактор статей ВК весьма своеобразно работал с кодовыми вставками, время отрепортить в VK Testers :)
Итак, задачу мы решили, но…

## Переиспользование

Но потом нам надо написать еще один-два-N бэков, и ладно пару раз можно код покопировать в новый проект, но на N раз уже появляется мысль, а не положить ли его в библиотеку и просто импортировать её.

Сказано, сделано, и начинаем собирать мини-библиотеку для мини-приложений.

И конечно же код её публично доступен на Github, на случай обнаружения глупости или желания добавить своего - m0rg0t/vk-helpers

И на npm - vk-helpers - npm

## Использование переиспользуемого

Ну и как использовать? Все просто, берем да ставим пакет

```bash
npm install vk-helpers
```

При сборке он собирается и в ESM и в CommonJS для староверов, так что используйте на свой вкус.

К примеру на сервере мы просто испортируем нашу функцию проверки подписи

```javascript
import { checkRequestSignature } from 'vk-helpers';
```

И дальше уже в нужном нам месте, к примеру middleware какой проверяем подписи

```javascript
const { vk_id, sign, ts, someImportantStuff } = request.body || {};
if (vk_id && sign && ts) {
  const isSignatureCorrect = checkRequestSignature({
    signature: sign,
    secretKey: SECRET_KEY,
    app_id: APP_ID,
    params: {
      someImportantStuff: String(someImportantStuff),
    },
    user_id: String(vk_id),
    ts: ts,
  });
  
  if (!isSignatureCorrect) {
    return reply.code(400).send({ error: 'Signature is not correct' });
  }
}
```

После чего радуемся что не пришлось писать код проверки подписи опять.

Но конечно фронт же тоже должен нам все данные сформировать и отправить, так что и его не обделили и добавили функцию и для него:

```javascript
const someImportantStuffData = 'Золото закопано под дубом, отмеченным крестом на карте' ;
const params = { someImportantStuff: someImportantStuffData };
  
// Get hash for security
const hash = await getHashForParamsFromVK(params);

// Prepare data for sending
const data = {
  vk_id: vkId,
  someImportantStuff: someImportantStuffData,
  sign: hash.sign,
  ts: hash.ts
};

// Send data to server
const response = await fetch(`${API_URL}/api/stats`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

То есть и тут мы не паримся с сортировкой параметров и подготовкой строки, что приятно

## Выводы

Даже если какая-то штука пригодится только тебе как полезная маленькая библиотека - то почему бы её и не сделать, ибо может оказаться что она будет и ещё кому-то полезна.

Ну или она станет очередной десятой библиотекой решающей такую же задачу как и все остальные, но почему бы и нет? :)

Ну и конечно оставляйте свои PR к библиотеке если захотите что-то улучшить или найдя косячные косяки - погнали делать Open Source во все поля
