import { EMovementState } from "../State";
import { MovementState } from "./MovementState";

export class Idle extends MovementState {
    private _airborneState: Maybe<MovementState>;
    private _jumpingState: Maybe<MovementState>;
    private _walkingState: Maybe<MovementState>;

    constructor(
        player: Player,
        character: Model,
        humanoid: Humanoid,
        rootPart: Part,
        animator: Animator,
    ) {
        super(
            EMovementState.Idle,
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

            if (!this._jumpingState) {
                if (state.name === EMovementState.Jumping) {
                    this._jumpingState = state;
                    print("Linked jump state: ");
                    print(state);
                }
            }

            if (!this._walkingState) {
                if (state.name === EMovementState.Walking) {
                    this._walkingState = state;
                    print("Linked walking state: ");
                    print(state);
                }
            }
        }
    }

    public override Enter(prevState: MovementState): Maybe<MovementState> {
        super.Enter(prevState);

        if (this.humanoid.MoveDirection.Magnitude > 0) {
            if (!this._walkingState) error("Forgot to link");
            return this._walkingState;
        }
    }
    public override OnInputBegan(input: InputObject): Maybe<MovementState> {
        super.OnInputBegan(input);

        return undefined;
    }

    public override OnStepped(delta: number): Maybe<MovementState> {
        super.OnStepped(delta);
        if (this.humanoid.GetState() === Enum.HumanoidStateType.Freefall) {
            if (!this._airborneState) error("Forgot to link");
            return this._airborneState;
        }

        if (this.humanoid.GetState() === Enum.HumanoidStateType.Jumping) {
            if (!this._jumpingState) error("Forgot to link");
            return this._jumpingState;
        }

        if (this.humanoid.MoveDirection.Magnitude > 0) {
            if (!this._walkingState) error("Forgot to link");
            return this._walkingState;
        }
    }
}
