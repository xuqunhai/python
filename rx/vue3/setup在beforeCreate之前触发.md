# setup 在 beforeCreate 之前触发

- 执行顺序
  1.  setup 函数：最先执行，用于初始化组件的响应式数据、计算属性、方法等。
  2.  beforeCreate 钩子：在 setup 之后执行。
  3.  created 钩子：在组件实例创建完成后执行。
- 由于 setup 函数是为了构造组件的响应式数据，因此在 setup 函数执行完毕之后，返回的数据已经准备好了。在 beforeCreate 钩子中，这些数据已经可以使用。这与 Vue 2 的生命周期有所不同，在 Vue 2 中，data 是在 beforeCreate 钩子之后初始化的。

# setup 函数的作用

- 初始化组件的响应式数据。它返回的数据、计算属性和方法会直接绑定到组件实例上，并可以在模板中使用。

# setup 函数中的响应式数据和 beforeCreate 钩子中的 data 是有区别的

- 在 Vue 3 中，setup 函数返回的数据直接绑定到模板中，但这些数据并不会绑定到组件实例的 this 上。
- 在 setup 中，this 不指向组件实例，因此不能使用 this 访问组件实例的属性。
- 在 beforeCreate 钩子中，组件实例尚未完全初始化，因此无法通过 this 访问 data、props、computed 等。
- 可以通过定义全局变量来在生命周期钩子中访问 setup 返回的响应式数据。

# setup 函数中 this 指向什么？

- 在 setup 函数中使用 this 是未定义的
- setup 函数的上下文与传统的选项式 API 不同，避免了对 this 的依赖，使得代码更加清晰和易于测试。
- 如果确实需要访问组件实例，可以使用 getCurrentInstance，但应谨慎使用以保持代码简洁和可维护。

```
import { ref, getCurrentInstance } from 'vue';

export default {
  setup() {
    const message = ref('Hello Vue 3!');
    const count = ref(0);

    const instance = getCurrentInstance();
    console.log(instance);

    function increment() {
      count.value++;
    }

    return {
      message,
      count,
      increment
    };
  }
};
```
