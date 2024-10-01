// TODO: refactor: Implement Whiteboard.find()

export default class Whiteboard {
  public id: string
  public owner: string
  public content: any[]
  public visibility: 'public' | 'private'
  constructor(owner: string) {
    this.id = crypto.randomUUID()
    this.owner = owner
    this.content = []
    this.visibility = 'private'
  }
}
