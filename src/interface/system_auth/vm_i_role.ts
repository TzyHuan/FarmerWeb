export class ActionNode {
    id: number;
    name: string;
    method: string;
    controllerId: number;
    description: string;
    children: ActionNode[];
}

export class ActionFlatNode {
    constructor(
        public name: string,
        public id: number,
        public method: string,
        public level: number,
        public expandable: boolean,
    ) { }
}

export class RoleGroupNode {
    id: number;
    name: string;
    children: RoleGroupNode[];
}

export class RoleGroupFlatNode {
    constructor(
        public name: string,
        public id: number,
        public level: number,
        public expandable: boolean,
    ) { }
}