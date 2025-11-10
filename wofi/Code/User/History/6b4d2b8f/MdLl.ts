export class Project {
  private _id: string;
  private _name: string;
  private _description: string;
  private _coust: number;
  private _deadline: Date;
  private _scope: Array<string>;
  private _backlogId: string;
  private _clientId: string;
  private _planId: string;
  private _sprints: Array<string>;
  private _requirements: Array<string>;
  private _members: Array<string>;

  constructor(
    id: string,
    name: string,
    description: string,
    coust: number,
    deadline: Date,
    scope: Array<string>,
    backlogId: string,
    clientId: string,
    planId: string,
    sprints: Array<string>,
    requirements: Array<string>,
    members: Array<string>
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._coust = coust;
    this._deadline = deadline;
    this._scope = scope;
    this._backlogId = backlogId;
    this._clientId = clientId;
    this._planId = planId;
    this._sprints = sprints;
    this._requirements = requirements;
    this._members = members;
  }
}
