import { EMovementState } from "../State";
import { MovementState } from "./MovementState";

export class Jumping extends MovementState {
    private _airborneState: Maybe<MovementState>;

    public jumpPower = 0;
    public randomBoost = 100;

    public prevState: Maybe<MovementState>;
    private _frameDelay: boolean = false;

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
        print(this.humanoid.GetState());
        this._frameDelay = false;

        this.jumpPower = this.humanoid.JumpPower;
        this.humanoid.JumpPower = this.jumpPower + this.randomBoost;

        this.prevState = prevState;

        return undefined;
    }

    public override Exit(_nextState: MovementState): void {
        super.Exit(_nextState);

        this.humanoid.JumpPower = this.jumpPower;
    }

    public override OnHeartbeat(_delta: number): Maybe<MovementState> {
        if (!this._frameDelay) {
            this._frameDelay = true;
            this.humanoid.ChangeState(Enum.HumanoidStateType.Jumping);
            return;
        }

        return this._airborneState;
    }
}
