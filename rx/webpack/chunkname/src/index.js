console.log('App is running');

document.getElementById('loadModuleButton').addEventListener('click', () => {
  import(/* webpackChunkName: "myChunkName-raferu" */ './module').then(module => {
    module.default();
  });
});
