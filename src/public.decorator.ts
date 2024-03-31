import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
// Custom decorator to make routes public
export const CustomPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
