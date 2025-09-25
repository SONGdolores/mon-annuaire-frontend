import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyXaf'
})
export class CurrencyXafPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }
    const formattedNumber = value.toLocaleString('fr-FR').replace(/\s/g, '.');

    return `${formattedNumber} XAF`;
  }

}
