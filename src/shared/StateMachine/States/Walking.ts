import { UserInputService } from "@rbxts/services";
import { EMovementState, State } from "../State";
import { MovementState } from "./MovementState";

export class Walking extends MovementState {
    private _airborneState: Maybe<MovementState>;
    private _idleState: Maybe<MovementState>;
    private _jumpingState: Maybe<MovementState>;
    private _runningState: Maybe<MovementState>;

    constructor(
        player: Player,
        character: Model,
        humanoid: Humanoid,
        rootPart: Part,
        animator: Animator,
    ) {
        super(
            EMovementState.Walking,
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
        }
    }

    public override Enter(prevState: State): Maybe<State> {
        super.Enter(prevState);
        if (this.humanoid.MoveDirection.Magnitude <= 0) {
            if (!this._idleState) error("Forgot to link");

            return this._idleState;
        }
    }

    public override OnInputBegan(input: InputObject): Maybe<State> {
        if (input.KeyCode === Enum.KeyCode.LeftControl) {
            if (!this._runningState) error("Forgot to link");
            return this._runningState;
        }
    }

    public override OnInputEnded(_input: InputObject): Maybe<State> {
        super.OnInputEnded(_input);
        return undefined;
    }

    public override OnHeartbeat(delta: number): Maybe<State> {
        super.OnHeartbeat(delta);

        if (this.humanoid.GetState() === Enum.HumanoidStateType.Freefall) {
            if (!this._airborneState) error("Forgot to link");
            return this._airborneState;
        }

        if (UserInputService.IsKeyDown(Enum.KeyCode.Space)) {
            if (!this._jumpingState) error("Forgot to link");
            return this._jumpingState;
        }

        if (this.humanoid.MoveDirection.Magnitude === 0) {
            if (!this._idleState) error("Forgot to link");
            return this._idleState;
        }
    }
}
