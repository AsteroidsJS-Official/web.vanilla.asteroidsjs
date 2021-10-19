export class Tweener {
  private _value: number

  private _progress = 0

  private _isCompleted = false

  private _isStopped = false

  get isCompleted(): boolean {
    return this._isCompleted
  }

  get isStopped(): boolean {
    return this._isStopped
  }

  get value(): number {
    return this._value
  }

  set progress(value: number) {
    this._progress = value
    this._value = this._endValue * (value / this._totalDuration)
  }

  get progress(): number {
    return this._progress
  }

  get duration(): number {
    return this._totalDuration
  }

  constructor(
    private readonly _totalDuration: number,
    private readonly _endValue: number,
  ) {}

  stop(): void {
    this._isStopped = true
  }
}
