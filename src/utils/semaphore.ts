export class Semaphore {
  private queue: (() => void)[] = []
  private count = 0

  constructor(private max: number) {}

  async acquire() {
    if (this.count < this.max) {
      this.count++
      return
    }
    await new Promise<void>(res => this.queue.push(res))
    this.count++
  }

  release() {
    this.count--
    if (this.queue.length) {
      const next = this.queue.shift()
      if (next) next()
    }
  }
}
