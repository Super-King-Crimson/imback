import { EMovementState } from "../State";
import { MovementState } from "./MovementState";

export class Jumping extends MovementState {
    private _airborneState: Maybe<MovementState>;

    public prevState: Maybe<MovementState>;
    public prevJumpPower: number = 0;

    constructor(
        player: Player,
        character: Model,
        humanoid: Humanoid,
        rootPart: Part,
        animator: Animator,
    ) {
        super(
            EMovementState.Jumping,
            player,
            character,
            humanoid,
            rootPart,
            animator,
        );
    }

    public override Link(states: MovementState[]): void {
        for (const state of states) {
            if (!this._airborneState) {
                if (state.name === EMovementState.Airborne) {
                    this._airborneState = state;
                    print("Linked airborne state: ");
                    print(state);
                }
            }
        }
    }

    public override Enter(prevState: MovementState): Maybe<MovementState> {
        super.Enter(prevState);

        this.prevJumpPower = this.humanoid.JumpPower;
        if (math.random() > 0.5) {
            this.humanoid.JumpPower += 20;
            print("you win the lottery!");
        }

        this.prevState = prevState as MovementState;

        return undefined;
    }

    public override Exit(_nextState: MovementState): void {
        super.Exit(_nextState);

        this.humanoid.JumpPower = this.prevJumpPower;
    }

    public override OnStepped(_delta: number): Maybe<MovementState> {
        return this._airborneState;
    }
}
