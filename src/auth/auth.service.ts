import { RegisterUserDto } from './dtos/register.user.dto.ts';

export const register = async (data: RegisterUserDto) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return `User registered with data: ${data}`;
};
