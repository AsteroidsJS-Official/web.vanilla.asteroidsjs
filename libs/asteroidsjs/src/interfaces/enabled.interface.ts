export interface IEnabled {
  /**
   * Property that enables the structure.
   *
   * All "loop" methods such as "onLoop" or "onLateLoop" are only executed
   * when the structure is activated, as well as its children's "loop"
   * methods.
   */
  get enabled(): boolean
}
