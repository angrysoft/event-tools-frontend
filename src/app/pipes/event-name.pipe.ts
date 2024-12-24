import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventName'
})
export class EventNamePipe implements PipeTransform {

  transform(name: string): string{
    const newName = name.replace(/.._.._/i, "");
    if (newName.length > 10)
      return newName.slice(0,10) + "...";
    return newName;
  }

}
