import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @Length(3, 50)
  @Matches(/^[A-Za-z0-9-]+$/, {
    message: 'SKU must containt only alphanumeric characters and dashes',
  })
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @Length(3, 3)
  @IsOptional()
  currency?: string = 'USD';

  @IsNumber()
  @Min(0)
  stock: number;
}
