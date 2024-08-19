import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CustomCurrency',
})
export class CurrencyPipe implements PipeTransform {
  transform(
    value: any,
    currencySymbol = '$',
    decimalPlaces = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.'
  ): string {
    // Handle null or undefined values
    if (value == null) return '';

    // Convert value to number if it's a string
    const numericValue = +value;

    // Basic formatting using toLocaleString
    let formattedValue = numericValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    // Replace default separators if needed
    formattedValue = formattedValue
      .replace('$', currencySymbol)
      .replace(/,/g, thousandsSeparator)
      .replace(/\./g, decimalSeparator);

    return formattedValue;
  }
}
