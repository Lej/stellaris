export class App {
  configureRouter(config, router) {
    config.title = 'Stellaris';
    config.map([
      { route: ['', 'techs'], name: 'techs',      moduleId: 'techs',      nav: true, title: 'Technologies' },
      { route: ['example'],     name: 'example',    moduleId: 'example',    nav: true, title: 'Example' }
    ]);

    this.router = router;
  }
}
