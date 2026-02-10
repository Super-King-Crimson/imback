import { EMovementState } from "../State";
import { Jumping } from "./Jumping";
import { MovementState } from "./MovementState";

export class Airborne extends MovementState {
    private _idleState: Maybe<MovementState>;
    private _jumpingState: Maybe<MovementState>;
    private _runningState: Maybe<MovementState>;
    private _walkingState: Maybe<MovementState>;

    private _nextState: Maybe<MovementState>;

    public coyoteTime = 1;
    private _coyoteTimer = 0;

    constructor(
        player: Player,
        character: Model,
        humanoid: Humanoid,
        rootPart: Part,
        animator: Animator,
    ) {
        super(
            EMovementState.Airborne,
            player,
            character,
            humanoid,
            rootPart,
            animator,
        );
    }

    public override Link(states: MovementState[]): void {
        for (const state of states) {
            if (!this._idleState) {
                if (state.name === EMovementState.Idle) {
                    this._idleState = state;
                    print("Linked idle state: ");
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

            if (!this._runningState) {
                if (state.name === EMovementState.Running) {
                    this._runningState = state;
                    print("Linked running state: ");
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

        if (prevState === this._jumpingState) {
            print("jump over");

            this._coyoteTimer = this.coyoteTime + 1;
            this._nextState = (prevState as Jumping).prevState;
        } else {
            this._nextState = this._idleState;
        }

        return undefined;
    }

    public override Exit(_nextState: MovementState): void {
        super.Exit(_nextState);

        this._coyoteTimer = 0;
    }

    public override OnInputBegan(input: InputObject): Maybe<MovementState> {
        if (input.KeyCode === Enum.KeyCode.Space) {
            if (this._coyoteTimer <= this.coyoteTime) {
                this.humanoid.ChangeState(Enum.HumanoidStateType.Jumping);
                if (!this._jumpingState) error("forgot to link");
                return this._jumpingState;
            }
        }
    }

    public override OnStepped(_delta: number): Maybe<MovementState> {
        this._coyoteTimer += _delta;

        if (this.humanoid.GetState() !== Enum.HumanoidStateType.Freefall) {
            if (!this._nextState) error("Forgot to link");
            return this._nextState;
        }
    }
}
