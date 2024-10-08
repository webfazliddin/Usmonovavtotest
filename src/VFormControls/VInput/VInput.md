```js
  <VInput v-bind="props" #default="{ id, errorMessages, onInput }" v-model:model-value="model">
  <your-component ></your-component>
  </VInput>
```

Props orqali o'zilani komponentga set qib qoyvurasilar, bu komponentning o'zini ichida tayyor calidatsiya qilishi bor.

onInput ni input komponentga yoki v-modelda @update:modelValue ga beramiza, ya'ni submit knoka bosilganda onInput ishlidi va ko'rsatilgan validatsiyaga to'gri kelsa sbros qiladi. (extiyoriy)

## Props and attr

| ID                | Type             | Default   | Description                                                  |
| ----------------- | ---------------- | --------- | ------------------------------------------------------------ |
| `v-model`         | any              | null      | O'zgaruvchan polya                                           |
| `rules`           | any[]            | null      | validatsiya (vuetify validatsiyada rules)                    |
| `validateOn`      | string           | undefined | validatsiya qanaqa xolatda ishlashi                          |
| `errorMessages`   | ValidationResult | undefined | validatsiya o'tmaganda errorlarning chiqishi, dom id va text |
| `isValid`         | booelan          | undefined | validatsiya                                                  |
| `reset`           | function         |           | default modelValue ni sbross qiladi va validatsiyani ham     |
| `resetValidation` | function         |           | validatsiyani sbros qiladi                                   |
| `validate`        | function         |           | ruchnoy validatsiyani ishga tushiradi                        |

## Kereli narsalar

VForm komponentiga obyortka bo'gan bo'lishi kerak, va validatsiya ishlashi uchun required polya berilishi shart
