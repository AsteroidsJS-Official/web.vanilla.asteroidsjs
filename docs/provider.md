```ts
this.instantiate({
  entity: MyEntity,
  components: [
    {
      class: MyComponent01,
      use: {
        property01: 20,
      },
    },
  ],
})
```
