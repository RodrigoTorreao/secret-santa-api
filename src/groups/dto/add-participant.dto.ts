import { ApiProperty } from "@nestjs/swagger";

export class AddParticipantDto {
  @ApiProperty()
  userId!: string
}