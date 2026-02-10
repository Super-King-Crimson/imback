import { UserInputService, Players, RunService } from "@rbxts/services";
import { StateMachine } from "shared/StateMachine/StateMachine";
import { EMovementState } from "shared/StateMachine/State";

const lp = Players.LocalPlayer;
let stateMachine: Maybe<StateMachine>;

lp.CharacterAdded.Connect((character: Model) => {
    print("what is happening");

    const hum = character.WaitForChild("Humanoid") as Humanoid;
    const hrp = character.WaitForChild("HumanoidRootPart") as Part;
    const animator = hum.WaitForChild("Animator") as Animator;

    const firstState = EMovementState.Idle;
    const states = new Set([
        EMovementState.Airborne,
        EMovementState.Jumping,
        EMovementState.Running,
        EMovementState.Walking,
    ]);

    stateMachine = new StateMachine(
        lp,
        character,
        hum,
        hrp,
        animator,
        firstState,
        states,
    );

    const hb = RunService.Heartbeat.Connect((delta) =>
        stateMachine?.OnStepped(delta),
    );
    const ib = UserInputService.InputBegan.Connect((input) =>
        stateMachine?.OnInputBegan(input),
    );

    const ie = UserInputService.InputEnded.Connect((input) =>
        stateMachine?.OnInputEnded(input),
    );

    hum.Died.Once(() => {
        hb.Disconnect();
        ib.Disconnect();
        ie.Disconnect();

        stateMachine = undefined;
    });
});
