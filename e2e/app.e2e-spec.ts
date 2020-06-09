import { EletticaFrontendPage } from './app.po';

describe('elettica-frontend App', () => {
  let page: EletticaFrontendPage;

  beforeEach(() => {
    page = new EletticaFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
