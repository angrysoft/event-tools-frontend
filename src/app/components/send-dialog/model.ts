import { WritableSignal } from "@angular/core";

interface SendStatus {
  name: string;
  progress: WritableSignal<number>;
  sending: WritableSignal<boolean>;
  error: WritableSignal<string | null>;
}

export { SendStatus };
