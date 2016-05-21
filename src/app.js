export class App {
  configureRouter(config, router) {
    config.title = 'Stellaris';
    config.map([
      { route: ['', 'techs'], name: 'techs',      moduleId: 'techs',      nav: true, title: 'Technologies' }
  //    { route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title: 'Github Users' },
  //    { route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }
    ]);

    this.router = router;
  }
}
