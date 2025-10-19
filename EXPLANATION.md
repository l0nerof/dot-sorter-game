# 📖 Пояснення для підопічного: Як працює Duck Sorter Game

## 🎯 Загальна ідея

Гра базується на концепції **автономних агентів** — кожна точка самостійно приймає рішення про свій рух, реагуючи на оточення. Немає центрального контролера, який би казав точкам куди рухатися. Вся поведінка виникає з простих локальних правил.

## 🧮 Векторна математика (Vector2D)

### Що таке вектор?

Вектор — це напрямок і величина. Наприклад:

- Позиція на екрані: `(x: 100, y: 200)`
- Швидкість: `(x: 2, y: -1)` — рухається на 2 пікселі вправо і 1 піксель вгору

### Основні операції

```typescript
// Додавання векторів (переміщення)
position.add(velocity); // нова позиція = стара позиція + швидкість

// Віднімання векторів (напрямок до цілі)
desired = target.sub(position); // напрямок від позиції до цілі

// Нормалізація (одиничний вектор довжини 1)
desired.normalize(); // зберігає тільки напрямок

// Множення на число (збільшення швидкості)
desired.mult(maxSpeed); // напрямок * максимальна швидкість
```

## 🎮 Фізика руху

Кожна точка має три вектори:

1. **Position** — де знаходиться
2. **Velocity** — як швидко і в якому напрямку рухається
3. **Acceleration** — як змінюється швидкість (сили)

### Цикл оновлення:

```typescript
update() {
  velocity.add(acceleration)      // швидкість змінюється від сил
  velocity.limit(maxSpeed)        // не дозволяємо рухатися надто швидко
  position.add(velocity)          // позиція змінюється від швидкості
  acceleration.mult(0)            // скидаємо сили (обнуляємо прискорення)
}
```

## 🧭 Steering Behaviors (Поведінки керування)

### 1. Flee (Втеча від курсора)

```typescript
flee(target) {
  // Крок 1: Визначити напрямок ВІД цілі
  desired = position - target  // протилежно до seek

  // Крок 2: Чим ближче ціль, тим сильніша сила
  distance = desired.mag()
  strength = (fleeRadius - distance) / fleeRadius

  // Крок 3: Бажана швидкість в цьому напрямку
  desired.normalize()
  desired.mult(maxSpeed * strength)

  // Крок 4: Розрахувати керуючу силу
  steering = desired - velocity

  return steering
}
```

**Простими словами**: "Якщо курсор близько, тікай у протилежному напрямку!"

### 2. Cohesion (Згуртованість — тягнення до своїх)

```typescript
cohesion(ducks) {
  // Крок 1: Знайти всіх сусідів СВОГО кольору
  let center = Vector.zero()
  let count = 0

  for (duck of ducks) {
    if (duck.color === this.color && duck.dist < cohesionRadius) {
      center.add(duck.position)  // додати позицію сусіда
      count++
    }
  }

  // Крок 2: Обчислити центр групи
  center.div(count)  // середня позиція

  // Крок 3: Рухатися до центру
  return seek(center)
}
```

**Простими словами**: "Знайди середню позицію твоїх кольорових сусідів і рухайся до неї"

### 3. Separation (Відокремлення — не зливатися)

```typescript
separation(ducks) {
  let steer = Vector.zero()

  for (duck of ducks) {
    distance = this.position.dist(duck.position)

    if (distance < separationRadius) {
      // Сила відштовхування пропорційна до близькості
      diff = this.position - duck.position
      diff.normalize()
      diff.div(distance)  // чим ближче, тим сильніше
      steer.add(diff)
    }
  }

  return steer
}
```

**Простими словами**: "Якщо хтось занадто близько, відсунься від нього"

### 4. Align (Вирівнювання — рух у одному напрямку)

```typescript
align(ducks) {
  let avgVelocity = Vector.zero()
  let count = 0

  for (duck of ducks) {
    if (duck.color === this.color && duck.dist < alignRadius) {
      avgVelocity.add(duck.velocity)  // додати швидкість сусіда
      count++
    }
  }

  // Середня швидкість групи
  avgVelocity.div(count)

  // Намагатися рухатися так само
  return avgVelocity - this.velocity
}
```

**Простими словами**: "Подивись як рухаються твої сусіди і рухайся так само"

## 🎲 Комбінування сил

У кожному кадрі гри точка:

1. Розраховує ВСІ сили (flee, cohesion, separation, align)
2. Застосовує ваги до кожної сили
3. Додає їх разом до `acceleration`
4. Оновлює позицію

```typescript
gameLoop() {
  for (duck of ducks) {
    // Розрахувати всі сили
    let flee = duck.flee(mouse) * FLEE_WEIGHT
    let cohesion = duck.cohesion(ducks) * COHESION_WEIGHT
    let separation = duck.separation(ducks) * SEPARATION_WEIGHT
    let align = duck.align(ducks) * ALIGN_WEIGHT

    // Застосувати до точки
    duck.applyForce(flee)
    duck.applyForce(cohesion)
    duck.applyForce(separation)
    duck.applyForce(align)

    // Оновити позицію
    duck.update()
  }
}
```

## ✅ Перевірка перемоги

```typescript
checkWin() {
  // Згрупувати точки за кольорами
  groups = groupByColor(ducks)

  // Для кожного кольору
  for (group of groups) {
    // Знайти центр групи
    center = calculateCenter(group)

    // Перевірити чи всі точки близько
    for (duck of group) {
      if (duck.dist(center) > GROUP_RADIUS) {
        return false  // хоча б одна далеко
      }
    }
  }

  return true  // всі групи зібрані!
}
```

## 🎨 Canvas рендеринг

```typescript
draw() {
  // 1. Очистити canvas
  ctx.fillRect(0, 0, width, height)

  // 2. Намалювати кожну точку
  for (duck of ducks) {
    ctx.fillStyle = duck.color
    ctx.beginPath()
    ctx.arc(duck.x, duck.y, duck.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
```

## 💡 Поради для налаштування

### Якщо точки занадто швидко розлітаються:

- Збільш `COHESION_WEIGHT` (сильніше тягнення до своїх)
- Зменш `FLEE_WEIGHT` (слабша втеча від курсора)

### Якщо точки зливаються в одну:

- Збільш `SEPARATION_WEIGHT` (сильніше відштовхування)
- Збільш `SEPARATION_RADIUS` (більша дистанція відштовхування)

### Якщо важко зібрати групи:

- Зменш `GROUP_RADIUS` (менший радіус для перемоги)
- Збільш `COHESION_RADIUS` (точки бачать своїх здалеку)

## 🚀 Що можна покращити?

1. **Візуалізація курсора** — показати радіус впливу навколо миші
2. **Звуки** — додати звукові ефекти
3. **Particles** — ефект sparkle коли група зібрана
4. **Складніші рівні** — більше кольорів, перешкоди на карті
5. **Leaderboard** — зберігати кращі результати в localStorage
6. **Customization** — дозволити гравцю змінювати ваги behaviors

## 📚 Ресурси для поглибленого вивчення

- [The Nature of Code - Chapter 5](https://natureofcode.com/autonomous-agents/)
- [Craig Reynolds - Steering Behaviors](https://www.red3d.com/cwr/steer/)
- [Flocking Algorithm](<https://en.wikipedia.org/wiki/Flocking_(behavior)>)

---

Успіхів з проєктом! 🎉
