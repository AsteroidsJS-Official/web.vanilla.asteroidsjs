```ts
const child = {
  transform: {
    canvasPosition: {
      x: 10,
      y: 10,
    },
    dimentions: {
      width: 50,
      height: 50,
    },
  },
}

const parent = {
  transform: {
    canvasPosition: {
      x: 10,
      y: 10,
    },
    dimentions: {
      width: 30,
      height: 30,
    },
  },
}

const childX = child.transform.localPosition.x
const childY = child.transform.localPosition.y
const childWidth = child.transform.dimensions.width
const childHeight = child.transform.dimensions.height
const parentX = parent.transform.localPosition.x
const parentY = parent.transform.localPosition.y
const parentWidth = parent.transform.dimensions.width
const parentHeight = parent.transform.dimensions.height

const totalDimensions = {
  width: parentWidth,
  height: parentHeight
}

// canvas position
// if (childX <= parentX && childX + childWidth > parentX + parentWidth) {
//   totalDimensions.width = childWidth
// } else if (childX < parentX) {
//   totalDimensions.width = (parentX - childX) + parentWidth
// } else if (childX > parentX && (childX - parentX + childWidth) > parentWidth) {
//   totalDimensions.width = (childX - parentX) + childWidth
// }

// if (childY <= parentY && childY + childHeight > parentY + parentHeight) {
//   totalDimensions.height = childHeight
// } else if (childY < parentY) {
//   totalDimensions.height = (parentY - childY) + parentHeight
// } else if (childY > parentY && (childY - parentY + childHeight) > parentHeight) {
//   totalDimensions.height = (childY - parentY) + childHeight
// }

if (childWidth > parentWidth && (childWidth / 2 - Math.abs(childX) <= 0)) {
  totalDimensions.width = childWidth
} else if (childWidth > parentWidth && childX <= 0) {
  totalDimensions.width = childWidth / 2 - childX + parentWidth / 2
} else if (childX <= 0 && childWidth / 2 - childX + parentWidth / 2) {
  totalDimensions.width = childWidth / 2 - childX + parentWidth / 2
} else if (childX > 0 && childWidth / 2 + childX > parentWidth / 2) {
  totalDimensions.width = childWidth / 2 + childX + parentWidth / 2
}

if (childHeight > parentHeight && (childHeight / 2 - Math.abs(childY) <= 0)) {
  totalDimensions.height = childHeight
} else if (childHeight > parentHeight && childY <= 0) {
  totalDimensions.height = childHeight / 2 - childY + parentHeight / 2
} else if (childY <= 0 && childHeight / 2 - childY + parentHeight / 2) {
  totalDimensions.height = childHeight / 2 - childY + parentHeight / 2
} else if (childY > 0 && childHeight / 2 + childY > parentHeight / 2) {
  totalDimensions.height = childHeight / 2 + childY + parentHeight / 2
}

totalDimensions -> { width: 50, height: 50 }
```
