```ts
const screens = {
  '1': {
    id: 'socket-id',
    number: 1,
    width: 500,
    height: 300,
    position: 2
  },
  '2': {},
  '3': {},
}

const screenAmount = 3

const screensBySide = Math.floor(screenAmount / 2)

const screenKeys = Object.keys(screens).sort((s1, s2) => +s1 - +s2)

const leftSide = [...screenKeys].slice(screensBySide + 1)

const rightSide = [...screenKeys].slice(0, screensBySide + 1)

[...leftSide, ...rightSide].forEach((screenNumber, index) => {
  screens[screenNumber].position = index
})
```

```ts
const canvasWidth = Object.values(screens)
  .map((s) => s1.width)
  .reduce((previous, current) => previous + current)
const canvasHeight = screens['1'].height

render: reduce(screens[position].width) + screen.width
```
