export abstract class State {
  /**
   * enter
   */
  public abstract enter(): Opt<State>;
  public abstract exit(): Opt<State>;

  public abstract onInput(): Opt<State>;
  public abstract onHeartbeat(delta: number): Opt<State>;
}
