import { Pipe, PipeTransform } from "@angular/core";
import { Rate } from "../models/rate";

@Pipe({
  name: "workerRates",
  standalone: true,
})
export class WorkerRatesPipe implements PipeTransform {
  transform(value: Rate[], accepted: number[]): Rate[] {
    return value
      .filter((v) => accepted.includes(v.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
