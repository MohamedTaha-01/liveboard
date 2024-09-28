export default class Whiteboard {
  public id: string;
  public content: any[];
  constructor() {
    this.id = crypto.randomUUID();
    this.content = [];
  }
}
