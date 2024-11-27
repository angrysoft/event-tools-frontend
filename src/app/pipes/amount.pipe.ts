import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "amount",
})
export class AmountPipe implements PipeTransform {
  transform(value: string, hideAmount: boolean): unknown {
    if (hideAmount) {
      return value
        .split("\n")
        .map((v) => v.split(":").at(0))
        .join("\n");
    }
    return value;
  }
}
