import { Controller, Get } from "@nestjs/common";


@Controller("cat")
export class CatController {
  @Get()
  findAll(): string {
    return "returns all cats";
  }
}