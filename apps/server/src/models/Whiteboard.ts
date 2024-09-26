export default class Whiteboard {
  public id: string;
  public content: [];
  constructor() {
    this.id = crypto.randomUUID();
    this.content = [];
  }
}
