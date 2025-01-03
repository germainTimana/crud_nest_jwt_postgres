import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const ActiveUser = createParamDecorator(
    (data: unknown, contex: ExecutionContext) => {
      const request = contex.switchToHttp().getRequest();
      return request.user;
    }
  );