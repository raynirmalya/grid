import { DatagridPage } from './app.po';

describe('datagrid App', () => {
  let page: DatagridPage;

  beforeEach(() => {
    page = new DatagridPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
