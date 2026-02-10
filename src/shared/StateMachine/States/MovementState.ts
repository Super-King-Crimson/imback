import { State } from "../State";

export abstract class MovementState extends State {
    public static runBoost = 8;

    // private _mover: Maybe<IMover>;

    public player: Player;
    public character: Model;
    public humanoid: Humanoid;
    public rootPart: Part;
    public animator: Animator;

    public animation: Maybe<Animation>;

    constructor(
        name: string,
        player: Player,
        character: Model,
        humanoid: Humanoid,
        rootPart: Part,
        animator: Animator,
    ) {
        super(name);
        this.player = player;
        this.character = character;
        this.humanoid = humanoid;
        this.rootPart = rootPart;
        this.animator = animator;
    }

    public override Enter(_prevState: State): Maybe<State> {
        if (this.animation) this.animator.LoadAnimation(this.animation);

        return undefined;
    }

    public override Exit(_nextState: State): void {}

    public override OnInputBegan(input: InputObject): Maybe<State> {
        return undefined;
    }

    public override OnInputEnded(input: InputObject): Maybe<State> {
        return undefined;
    }

    public override OnStepped(_delta: number): Maybe<State> {
        return undefined;
    }
}
